<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Services\Facturacion\FacturaService;
use App\Services\Facturacion\ClienteFacturacionService;
use App\Services\Facturacion\Exceptions\FacturacionException;
use App\Models\Factura;
use App\Models\ClienteFacturacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class FacturaController extends Controller
{
    protected FacturaService $facturaService;
    protected ClienteFacturacionService $clienteService;

    public function __construct(
        FacturaService $facturaService,
        ClienteFacturacionService $clienteService
    ) {
        $this->facturaService = $facturaService;
        $this->clienteService = $clienteService;
    }

    /**
     * Listar facturas con filtros y paginación
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 20;
            $fechaInicio = $request->p_fecha_inicio;
            $fechaFin = $request->p_fecha_fin;
            $anio = $request->p_anio;
            $estado = $request->p_estado;
            $clienteId = $request->p_cliente_id;

            $query = Factura::with([
                'reserva:id,codigo_reserva',
                'clienteFacturacion:id,nombres_completos,identificacion',
                'usuarioGenero:id,nombres,apellidos'
            ]);

            // Filtros
            if ($fechaInicio && $fechaFin) {
                $query->entreFechas($fechaInicio, $fechaFin);
            } elseif ($anio) {
                $query->porAnio($anio);
            }

            if ($estado) {
                $query->where('estado', $estado);
            }

            if ($clienteId) {
                $query->where('cliente_facturacion_id', $clienteId);
            }

            $facturas = $query->orderBy('fecha_emision', 'desc')
                ->orderBy('numero_factura', 'desc')
                ->paginate($perPage);

            return response()->json([
                'status' => HTTPStatus::Success,
                'facturas' => $facturas->items(),
                'filtros_aplicados' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                    'anio' => $anio,
                    'estado' => $estado,
                    'cliente_id' => $clienteId,
                ],
                'paginacion' => [
                    'total' => $facturas->total(),
                    'por_pagina' => $facturas->perPage(),
                    'pagina_actual' => $facturas->currentPage(),
                    'ultima_pagina' => $facturas->lastPage(),
                    'desde' => $facturas->firstItem(),
                    'hasta' => $facturas->lastItem()
                ]
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
                'reserva.departamento.tipoDepartamento',
                'clienteFacturacion',
                'consumos.inventario.categoria',
                'usuarioGenero:id,nombres,apellidos',
                'usuarioAnulo:id,nombres,apellidos',
                'usuarioRegistroDescuento:id,nombres,apellidos',
            ])->findOrFail($id);

            $consumosAgrupados = $factura->consumos->groupBy(function ($consumo) {
                return $consumo->inventario->categoria->nombre_categoria ??  'Sin categoría';
            })->map(function ($grupo) {
                return $grupo->map(function ($consumo) {
                    return [
                        'id' => $consumo->id,
                        'producto' => $consumo->inventario->nombre_producto,
                        'cantidad' => $consumo->cantidad,
                        'precio_unitario' => $consumo->inventario->precio_unitario,
                        'subtotal' => $consumo->subtotal,
                        'tasa_iva' => $consumo->tasa_iva,
                        'iva' => $consumo->iva,
                        'total' => $consumo->total,
                    ];
                });
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
     * Generar factura para una reserva (USANDO SERVICIO)
     */
    public function generarFactura(Request $request): JsonResponse
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'cliente_facturacion_id' => 'required|exists:clientes_facturacion,id',
            'solicita_factura_detallada' => 'required|boolean',
            'observaciones' => 'nullable|string|max:500',

            // ✅ NUEVOS:  Validaciones de descuento
            'descuento' => 'nullable|numeric|min:0',
            'tipo_descuento' => 'nullable|in:MONTO_FIJO,PORCENTAJE',
            'porcentaje_descuento' => 'nullable|numeric|min:0|max: 100',
            'motivo_descuento' => 'nullable|string|max:200',
        ]);

        try {
            // Validar lógica de descuento
            $descuento = $request->descuento ?? 0;
            $tipoDescuento = $request->tipo_descuento ??  Factura::TIPO_DESCUENTO_MONTO_FIJO;
            $porcentajeDescuento = $request->porcentaje_descuento;
            $motivoDescuento = $request->motivo_descuento;

            // Si hay descuento mayor a 50%, exigir motivo
            if ($tipoDescuento === Factura::TIPO_DESCUENTO_PORCENTAJE && $porcentajeDescuento > 50 && empty($motivoDescuento)) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Los descuentos mayores al 50% requieren justificación obligatoria'
                ], 400);
            }

            $factura = $this->facturaService->generarFactura(
                reservaId: $request->reserva_id,
                clienteFacturacionId: $request->cliente_facturacion_id,
                solicitaFacturaDetallada: $request->solicita_factura_detallada,
                usuarioId: Auth::id(),
                opciones: [
                    'observaciones' => $request->observaciones,
                    'descuento' => $descuento,
                    'tipo_descuento' => $tipoDescuento,
                    'porcentaje_descuento' => $porcentajeDescuento,
                    'motivo_descuento' => $motivoDescuento,
                ]
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Factura generada correctamente',
                'factura' => $factura,
            ], 201);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
                'code' => $e->getCode(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al generar factura:   ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Aplicar descuento a una factura existente
     */
    public function aplicarDescuento(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'descuento' => 'required|numeric|min:0',
            'tipo_descuento' => 'required|in:MONTO_FIJO,PORCENTAJE',
            'porcentaje_descuento' => 'required_if:tipo_descuento,PORCENTAJE|nullable|numeric|min:0|max:100',
            'motivo_descuento' => 'required|string|min:10|max:200',
        ]);

        try {
            $factura = $this->facturaService->aplicarDescuentoFactura(
                facturaId: $id,
                descuento: $request->descuento,
                tipoDescuento: $request->tipo_descuento,
                porcentaje: $request->porcentaje_descuento,
                motivo: $request->motivo_descuento,
                usuarioId: Auth::id()
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento aplicado correctamente',
                'factura' => $factura,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al aplicar descuento:  ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Eliminar descuento de una factura
     */
    public function eliminarDescuento(int $id): JsonResponse
    {
        try {
            $factura = $this->facturaService->eliminarDescuentoFactura(
                facturaId: $id,
                usuarioId: Auth::id()
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento eliminado correctamente',
                'factura' => $factura,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al eliminar descuento:  ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Anular factura (USANDO SERVICIO)
     */
    public function anularFactura(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'motivo_anulacion' => 'required|string|min:10|max:500'
        ]);

        try {
            $factura = $this->facturaService->anularFactura(
                facturaId: $id,
                motivo: $request->motivo_anulacion,
                usuarioId: Auth::id()
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Factura anulada correctamente',
                'factura' => $factura,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
                'code' => $e->getCode(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar si puede facturar (USANDO SERVICIO) - CORREGIDO
     */
    public function verificarPuedeFacturar(int $reservaId): JsonResponse
    {
        try {
            $resultado = $this->facturaService->verificarPuedeFacturar($reservaId);

            return response()->json([
                'status' => HTTPStatus::Success,
                'puede_facturar' => $resultado['puede_facturar'],
                'motivos' => $resultado['motivos'],
                'tiene_factura' => $resultado['tiene_factura'],
                'factura_existente' => $resultado['factura_existente'],
                'total_consumos' => $resultado['total_consumos'],
                'cantidad_consumos' => $resultado['cantidad_consumos'],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener factura por reserva (USANDO SERVICIO)
     */
    public function getFacturaPorReserva(int $reservaId): JsonResponse
    {
        try {
            $factura = $this->facturaService->obtenerFacturaPorReserva($reservaId);

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
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recalcular totales de una factura
     */
    public function recalcularTotales(int $id): JsonResponse
    {
        try {
            $factura = $this->facturaService->recalcularTotales($id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Totales recalculados correctamente',
                'factura' => $factura,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
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

            $consumosAgrupados = $factura->consumos->groupBy(function ($consumo) {
                return $consumo->inventario->categoria->nombre_categoria ?? 'Sin categoría';
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
                $pdf = Pdf::loadView('pdf.facturas.factura', $data);
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
            $fechaInicio = $request->p_fecha_inicio;
            $fechaFin = $request->p_fecha_fin;
            $anio = $request->p_anio;

            // Query base para facturas emitidas
            $facturasEmitidasQuery = Factura::emitidas();
            $facturasAnuladasQuery = Factura::anuladas();

            if ($fechaInicio && $fechaFin) {
                // Si hay rango de fechas, usarlo
                $facturasEmitidasQuery->entreFechas($fechaInicio, $fechaFin);
                $facturasAnuladasQuery->entreFechas($fechaInicio, $fechaFin);
            } elseif ($anio) {
                // Si solo hay año, filtrar por año
                $facturasEmitidasQuery->porAnio($anio);
                $facturasAnuladasQuery->porAnio($anio);
            }

            // Obtener colecciones
            $facturasEmitidas = $facturasEmitidasQuery->get();
            $facturasAnuladas = $facturasAnuladasQuery->get();

            // ✅ NUEVO: Estadísticas de descuentos
            $facturasConDescuento = $facturasEmitidasQuery->conDescuento()->count();

            $stats = [
                'periodo' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                    'anio' => $anio ?  (int)$anio : null,
                    'es_rango' => ($fechaInicio && $fechaFin) ? true : false,
                    'es_anio' => (! $fechaInicio && !$fechaFin && $anio) ? true : false,
                ],
                'facturas' => [
                    'total_emitidas' => (int)$facturasEmitidas->count(),
                    'total_anuladas' => (int)$facturasAnuladas->count(),
                    'total_con_descuento' => $facturasConDescuento,
                    'total_general' => (int)($facturasEmitidas->count() + $facturasAnuladas->count()),
                ],
                'montos' => [
                    'total_facturado' => (float)round($facturasEmitidas->sum('total_factura'), 2),
                    'total_iva' => (float)round($facturasEmitidas->sum('total_iva'), 2),
                    'total_sin_iva' => (float)round($facturasEmitidas->sum('subtotal_sin_iva'), 2),
                    'total_descuentos' => (float)round($facturasEmitidas->sum('descuento'), 2),
                    'promedio_factura' => $facturasEmitidas->count() > 0
                        ? (float)round($facturasEmitidas->avg('total_factura'), 2)
                        : 0.0,
                    'ticket_maximo' => (float)($facturasEmitidas->max('total_factura') ?? 0),
                    'ticket_minimo' => (float)($facturasEmitidas->min('total_factura') ?? 0),
                ],
                'clientes' => [
                    'consumidores_finales' => (int)$facturasEmitidas
                        ->where('cliente_identificacion', ClienteFacturacion::CONSUMIDOR_FINAL_IDENTIFICACION)
                        ->count(),
                    'clientes_registrados' => (int)$facturasEmitidas
                        ->where('cliente_identificacion', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_IDENTIFICACION)
                        ->count(),
                    'clientes_unicos' => (int)$facturasEmitidas
                        ->where('cliente_identificacion', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_IDENTIFICACION)
                        ->unique('cliente_facturacion_id')
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

            $cliente = $this->clienteService->validarCliente($clienteId);

            $query = Factura::with(['reserva.huesped', 'reserva.departamento'])
                ->delCliente($clienteId)
                ->emitidas();

            if ($fechaInicio && $fechaFin) {
                $query->entreFechas($fechaInicio, $fechaFin);
            }

            $facturas = $query->orderBy('fecha_emision', 'desc')->get();

            $resumen = [
                'cantidad_facturas' => $facturas->count(),
                'total_facturado' => round($facturas->sum('total_factura'), 2),
                'total_iva' => round($facturas->sum('total_iva'), 2),
                'promedio_factura' => round($facturas->avg('total_factura'), 2),
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
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 400);
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
                'ventas_exentas' => round($facturas->sum('subtotal_sin_iva'), 2),
                'iva_cobrado' => round($facturas->sum('total_iva'), 2),
                'total_ventas' => round($facturas->sum('total_factura'), 2),
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
