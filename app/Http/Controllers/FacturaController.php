<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Models\Factura;
use App\Models\Reserva;
use App\Models\ClienteFacturacion;
use App\Models\ReservaClienteFacturacion;
use App\Models\SecuenciaFactura;
use App\Models\Consumo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class FacturaController extends Controller
{
    /**
     * Listar facturas con filtros y paginación
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 20;
            $estado = $request->estado;
            $fechaInicio = $request->fecha_inicio;
            $fechaFin = $request->fecha_fin;
            $clienteId = $request->cliente_id;
            $numeroFactura = $request->numero_factura;
            $search = $request->search;

            $query = Factura::with([
                'reserva. huesped: id,nombres,apellidos,dni',
                'reserva.departamento:id,numero_departamento',
                'clienteFacturacion: id,identificacion,nombres,apellidos',
                'usuarioGenero:id,nombres,apellidos'
            ]);

            if ($estado) {
                $query->where('estado', $estado);
            }

            if ($fechaInicio && $fechaFin) {
                $query->entreFechas($fechaInicio, $fechaFin);
            }

            if ($clienteId) {
                $query->delCliente($clienteId);
            }

            if ($numeroFactura) {
                $query->where('numero_factura', 'like', "%{$numeroFactura}%");
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('numero_factura', 'like', "%{$search}%")
                        ->orWhere('cliente_nombres', 'like', "%{$search}%")
                        ->orWhere('cliente_apellidos', 'like', "%{$search}%")
                        ->orWhere('cliente_identificacion', 'like', "%{$search}%");
                });
            }

            $facturas = $query->orderBy('fecha_emision', 'desc')
                ->orderBy('numero_factura', 'desc')
                ->paginate($perPage);

            return response()->json([
                'status' => HTTPStatus::Success,
                'facturas' => $facturas,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener detalle completo de una factura
     */
    public function show(int $id): JsonResponse
    {
        try {
            $factura = Factura::with([
                'reserva.huesped',
                'reserva.departamento. tipoDepartamento',
                'clienteFacturacion',
                'consumos. inventario. categoria',
                'usuarioGenero: id,nombres,apellidos,email',
                'usuarioAnulo:id,nombres,apellidos,email'
            ])->findOrFail($id);

            $consumosAgrupados = $factura->consumos->groupBy(function ($consumo) {
                return $consumo->inventario->categoria->nombre_categoria ??  'Sin categoría';
            });

            return response()->json([
                'status' => HTTPStatus::Success,
                'factura' => $factura,
                'consumos_agrupados' => $consumosAgrupados,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Generar factura para una reserva
     */
    public function generarFactura(Request $request): JsonResponse
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'cliente_facturacion_id' => 'required|exists:clientes_facturacion,id',
            'solicita_factura_detallada' => 'required|boolean',
            'observaciones' => 'nullable|string|max:500',
            'descuento' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $reservaId = $request->reserva_id;
            $clienteId = $request->cliente_facturacion_id;
            $solicitaDetallada = $request->solicita_factura_detallada;
            $descuento = $request->descuento ??  0;

            // 1. VALIDACIONES PREVIAS
            $reserva = Reserva::with(['consumos', 'huesped', 'departamento'])->findOrFail($reservaId);

            if ($reserva->tiene_factura) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Esta reserva ya tiene una factura generada',
                    'factura_existente' => $reserva->factura
                ], 409);
            }

            if ($reserva->consumos->isEmpty()) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'La reserva no tiene consumos para facturar'
                ], 400);
            }

            $consumosFacturados = $reserva->consumos->where('factura_id', '!=', null);
            if ($consumosFacturados->isNotEmpty()) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Algunos consumos ya están facturados'
                ], 400);
            }

            // 2. VALIDAR Y OBTENER CLIENTE
            $cliente = ClienteFacturacion::findOrFail($clienteId);

            if (!$cliente->activo && $cliente->id !== ClienteFacturacion::CONSUMIDOR_FINAL_ID) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'El cliente de facturación está inactivo'
                ], 400);
            }

            // 3. ASIGNAR CLIENTE A LA RESERVA
            $reserva->asignarClienteFacturacion(
                $clienteId,
                $solicitaDetallada,
                Auth::id()
            );

            // 4. GENERAR NÚMERO DE FACTURA
            try {
                $numeroFactura = SecuenciaFactura::generarSiguienteNumero();
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Error al generar número de factura: ' . $e->getMessage()
                ], 500);
            }

            // ================================================================
            // 5. CALCULAR TOTALES DESDE CONSUMOS (SIMPLIFICADO)
            // ================================================================
            $consumos = $reserva->consumos;

            // TODOS los consumos tienen IVA, solo verificamos si tasa_iva > 0
            $subtotalSinIva = 0;
            $subtotalConIva = 0;
            $totalIva = 0;

            foreach ($consumos as $consumo) {
                if ($consumo->tasa_iva > 0) {
                    // Producto con IVA
                    $subtotalConIva += $consumo->subtotal;
                    $totalIva += $consumo->iva;
                } else {
                    // Producto sin IVA (por si acaso, aunque todos deberían tener)
                    $subtotalSinIva += $consumo->subtotal;
                }
            }

            $subtotalTotal = $subtotalSinIva + $subtotalConIva;
            $totalAntesDescuento = $subtotalTotal + $totalIva;
            $totalFactura = $totalAntesDescuento - $descuento;

            if ($descuento > $totalAntesDescuento) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'El descuento no puede ser mayor al total de la factura'
                ], 400);
            }

            // 6. CREAR FACTURA
            $factura = new Factura();
            $factura->numero_factura = $numeroFactura;
            $factura->reserva_id = $reservaId;
            $factura->cliente_facturacion_id = $clienteId;
            $factura->fecha_emision = now()->toDateString();
            $factura->observaciones = $request->observaciones;
            $factura->usuario_genero_id = Auth::id();

            // Copiar datos del cliente (inmutabilidad fiscal)
            $factura->copiarDatosCliente($cliente);

            // Asignar totales
            $factura->subtotal_sin_iva = $subtotalSinIva;
            $factura->subtotal_con_iva = $subtotalConIva;
            $factura->total_iva = $totalIva;
            $factura->descuento = $descuento;
            $factura->total_factura = $totalFactura;

            $factura->save();

            // 7. ACTUALIZAR CONSUMOS CON FACTURA_ID
            Consumo::whereIn('id', $consumos->pluck('id'))
                ->update(['factura_id' => $factura->id]);

            DB::commit();

            // 8. RETORNAR FACTURA COMPLETA
            $facturaCompleta = Factura::with([
                'reserva.huesped',
                'reserva.departamento.tipoDepartamento',
                'consumos.inventario.categoria',
                'clienteFacturacion',
                'usuarioGenero'
            ])->find($factura->id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Factura generada correctamente',
                'factura' => $facturaCompleta,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al generar factura: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Anular factura
     */
    public function anularFactura(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'motivo_anulacion' => 'required|string|min:10|max:500'
        ]);

        DB::beginTransaction();
        try {
            $factura = Factura::with('consumos')->findOrFail($id);

            if (! $factura->puedeAnularse()) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'La factura no puede ser anulada (ya está anulada)'
                ], 400);
            }

            $resultado = $factura->anular(
                $request->motivo_anulacion,
                Auth::id()
            );

            if (! $resultado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se pudo anular la factura'
                ], 500);
            }

            // Desasignar consumos de la factura anulada
            Consumo::where('factura_id', $factura->id)
                ->update(['factura_id' => null]);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Factura anulada correctamente',
                'factura' => $factura->fresh(['usuarioAnulo']),
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar si una reserva puede generar factura
     */
    public function verificarPuedeFacturar(int $reservaId): JsonResponse
    {
        try {
            $reserva = Reserva::with(['consumos', 'factura', 'clienteFacturacion'])->findOrFail($reservaId);

            $puede = $reserva->puedeGenerarFactura();
            $motivos = [];

            if ($reserva->tiene_factura) {
                $motivos[] = 'Ya tiene factura generada';
            }

            if ($reserva->consumos->isEmpty()) {
                $motivos[] = 'No tiene consumos registrados';
            }

            $consumosFacturados = $reserva->consumos->where('factura_id', '!=', null);
            if ($consumosFacturados->isNotEmpty()) {
                $motivos[] = 'Algunos consumos ya están facturados';
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'puede_facturar' => $puede,
                'motivos' => $motivos,
                'tiene_factura' => $reserva->tiene_factura,
                'factura_existente' => $reserva->factura,
                'total_consumos' => $reserva->total_consumos,
                'cantidad_consumos' => $reserva->consumos->count(),
                'consumos_pendientes' => $reserva->consumos->where('factura_id', null)->count(),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener factura por reserva
     */
    public function getFacturaPorReserva(int $reservaId): JsonResponse
    {
        try {
            $factura = Factura::with([
                'consumos.inventario',
                'clienteFacturacion',
                'usuarioGenero'
            ])->where('reserva_id', $reservaId)->first();

            if (!$factura) {
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'factura' => null,
                    'msg' => 'La reserva no tiene factura generada'
                ], 200);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'factura' => $factura,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar factura a PDF
     */
    public function exportarPDF(int $id)
    {
        try {
            $factura = Factura::with([
                'reserva.huesped',
                'reserva.departamento.tipoDepartamento',
                'consumos.inventario.categoria',
                'usuarioGenero'
            ])->findOrFail($id);

            // Agrupar consumos por categoría
            $consumosAgrupados = $factura->consumos->groupBy(function ($consumo) {
                return $consumo->inventario->categoria->nombre_categoria ??  'Sin categoría';
            });

            $data = [
                'factura' => $factura,
                'consumos_agrupados' => $consumosAgrupados,
                'hotel_nombre' => 'Hotel Mansión Real',
                'hotel_direccion' => 'Dirección del hotel',
                'hotel_telefono' => 'Teléfono del hotel',
                'hotel_email' => 'info@mansionreal.com',
            ];

            if ($factura->esta_anulada) {
                $pdf = Pdf::loadView('pdf.facturas.factura_anulada', $data);
            } else {
                $pdf = Pdf::loadView('pdf. facturas.factura', $data);
            }

            $pdf->setPaper('a4', 'portrait');

            return $pdf->download("factura_{$factura->numero_factura}.pdf");
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas generales de facturación
     */
    public function estadisticas(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ??  now()->startOfMonth()->toDateString();
            $fechaFin = $request->fecha_fin ?? now()->endOfMonth()->toDateString();

            $facturasEmitidas = Factura::emitidas()
                ->entreFechas($fechaInicio, $fechaFin);

            $facturasAnuladas = Factura::anuladas()
                ->entreFechas($fechaInicio, $fechaFin);

            $stats = [
                'periodo' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                ],
                'facturas' => [
                    'total_emitidas' => $facturasEmitidas->count(),
                    'total_anuladas' => $facturasAnuladas->count(),
                    'total_general' => Factura::entreFechas($fechaInicio, $fechaFin)->count(),
                ],
                'montos' => [
                    'total_facturado' => $facturasEmitidas->sum('total_factura'),
                    'total_iva' => $facturasEmitidas->sum('total_iva'),
                    'total_sin_iva' => $facturasEmitidas->sum('subtotal_sin_iva'),
                    'total_con_iva' => $facturasEmitidas->sum('subtotal_con_iva'),
                    'total_descuentos' => $facturasEmitidas->sum('descuento'),
                    'promedio_factura' => $facturasEmitidas->avg('total_factura'),
                ],
                'clientes' => [
                    'consumidores_finales' => $facturasEmitidas
                        ->where('cliente_identificacion', ClienteFacturacion::CONSUMIDOR_FINAL_IDENTIFICACION)
                        ->count(),
                    'clientes_registrados' => $facturasEmitidas
                        ->where('cliente_identificacion', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_IDENTIFICACION)
                        ->count(),
                ],
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'estadisticas' => $stats,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Reporte de facturas por cliente
     */
    public function reportePorCliente(int $clienteId, Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio;
            $fechaFin = $request->fecha_fin;

            $cliente = ClienteFacturacion::findOrFail($clienteId);

            $query = Factura::with(['reserva.huesped', 'reserva.departamento'])
                ->delCliente($clienteId)
                ->emitidas();

            if ($fechaInicio && $fechaFin) {
                $query->entreFechas($fechaInicio, $fechaFin);
            }

            $facturas = $query->orderBy('fecha_emision', 'desc')->get();

            $resumen = [
                'cantidad_facturas' => $facturas->count(),
                'total_facturado' => $facturas->sum('total_factura'),
                'total_iva' => $facturas->sum('total_iva'),
                'promedio_factura' => $facturas->avg('total_factura'),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $cliente,
                'facturas' => $facturas,
                'resumen' => $resumen,
                'periodo' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                ],
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Reporte consolidado de IVA para SRI
     */
    public function reporteIVA(Request $request): JsonResponse
    {
        $request->validate([
            'mes' => 'required|integer|min:1|max:12',
            'anio' => 'required|integer|min:2020|max:' . (date('Y') + 1),
        ]);

        try {
            $mes = $request->mes;
            $anio = $request->anio;

            $facturas = Factura::emitidas()
                ->whereMonth('fecha_emision', $mes)
                ->whereYear('fecha_emision', $anio)
                ->get();

            $reporte = [
                'periodo' => [
                    'mes' => $mes,
                    'anio' => $anio,
                    'mes_nombre' => Carbon::create($anio, $mes, 1)->locale('es')->isoFormat('MMMM'),
                ],
                'ventas_gravadas' => $facturas->sum('subtotal_con_iva'),
                'ventas_exentas' => $facturas->sum('subtotal_sin_iva'),
                'iva_cobrado' => $facturas->sum('total_iva'),
                'total_ventas' => $facturas->sum('total_factura'),
                'cantidad_facturas' => $facturas->count(),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'reporte' => $reporte,
                'facturas' => $facturas,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
