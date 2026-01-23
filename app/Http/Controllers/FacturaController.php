<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Services\Facturacion\FacturaService;
use App\Services\Facturacion\ClienteFacturacionService;
use App\Services\Facturacion\Exceptions\FacturacionException;
use App\Models\Factura;
use App\Models\Consumo;
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
     * ✅ ACTUALIZADO: Obtener detalle completo de una factura
     */
    public function show(int $id): JsonResponse
    {
        try {
            $factura = Factura::with([
                'reserva.huesped',
                'reserva.departamento.tipoDepartamento',
                'clienteFacturacion',
                'consumos.inventario.categoria',
                'consumos.usuarioRegistroDescuento', // ✅ NUEVO
                'usuarioGenero',
                'usuarioAnulo'
            ])->findOrFail($id);

            // ✅ NUEVO: Agregar información de descuentos desde consumos
            $resumenDescuentos = $factura->getResumenDescuentos();

            return response()->json([
                'status' => HTTPStatus::Success,
                'factura' => $factura,
                'resumen_descuentos' => $resumenDescuentos, // ✅ NUEVO
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ ACTUALIZADO: Generar factura (con descuentos en consumos)
     */
    public function generarFactura(Request $request): JsonResponse
    {
        $request->validate([
            'reserva_id' => 'required|integer|exists:reservas,id',
            'cliente_facturacion_id' => 'required|integer|exists:clientes_facturacion,id',
            'solicita_factura_detallada' => 'required|boolean',
            'observaciones' => 'nullable|string|max:500',
            // ✅ NUEVO: Validación para descuentos en consumos
            'descuentos_consumos' => 'nullable|array',
            'descuentos_consumos.*.consumo_id' => 'required|integer|exists:consumos,id',
            'descuentos_consumos.*.descuento' => 'required|numeric|min:0',
            'descuentos_consumos.*.tipo_descuento' => 'required|in:MONTO_FIJO,PORCENTAJE,SIN_DESCUENTO',
            'descuentos_consumos.*.porcentaje_descuento' => 'nullable|numeric|min:0|max:100',
            'descuentos_consumos.*.motivo_descuento' => 'required|string|min:10|max:200',
        ]);

        try {
            // ✅ NUEVO: Transformar descuentos_consumos a formato esperado por el servicio
            $descuentosConsumos = [];
            if ($request->has('descuentos_consumos')) {
                foreach ($request->descuentos_consumos as $desc) {
                    $descuentosConsumos[$desc['consumo_id']] = [
                        'descuento' => $desc['descuento'],
                        'tipo_descuento' => $desc['tipo_descuento'],
                        'porcentaje_descuento' => $desc['porcentaje_descuento'] ?? null,
                        'motivo_descuento' => $desc['motivo_descuento'],
                    ];
                }
            }

            $factura = $this->facturaService->generarFactura(
                reservaId: $request->reserva_id,
                clienteFacturacionId: $request->cliente_facturacion_id,
                solicitaFacturaDetallada: $request->solicita_factura_detallada,
                usuarioId: Auth::id(),
                opciones: [
                    'observaciones' => $request->observaciones,
                    'descuentos_consumos' => $descuentosConsumos, // ✅ NUEVO
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
                'msg' => 'Error al generar factura: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Aplicar descuento a un consumo específico
     */
    public function aplicarDescuentoConsumo(Request $request, int $consumoId): JsonResponse
    {
        $request->validate([
            'descuento' => 'required|numeric|min:0',
            'tipo_descuento' => 'required|in:MONTO_FIJO,PORCENTAJE',
            'porcentaje_descuento' => 'required_if:tipo_descuento,PORCENTAJE|nullable|numeric|min:0|max:100',
            'motivo_descuento' => 'required|string|min:10|max:200',
        ]);

        try {
            $consumo = $this->facturaService->aplicarDescuentoConsumo(
                consumoId: $consumoId,
                descuento: $request->descuento,
                tipoDescuento: $request->tipo_descuento,
                porcentajeDescuento: $request->porcentaje_descuento,
                motivo: $request->motivo_descuento,
                usuarioId: Auth::id()
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento aplicado correctamente al consumo',
                'consumo' => $consumo,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al aplicar descuento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Eliminar descuento de un consumo
     */
    public function eliminarDescuentoConsumo(int $consumoId): JsonResponse
    {
        try {
            $consumo = $this->facturaService->eliminarDescuentoConsumo(
                consumoId: $consumoId,
                usuarioId: Auth::id()
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento eliminado correctamente del consumo',
                'consumo' => $consumo,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al eliminar descuento: ' . $e->getMessage()
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
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al anular factura: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar si puede facturar (USANDO SERVICIO)
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
     * ✅ ACTUALIZADO: Recalcular totales de una factura (desde consumos)
     */
    public function recalcularTotales(int $id): JsonResponse
    {
        try {
            $factura = $this->facturaService->recalcularTotales($id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Totales recalculados correctamente desde consumos',
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
                'msg' => 'Error al recalcular totales: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar factura a PDF
     */
    public function exportarPDF(int $id): mixed
    {
        try {
            $factura = Factura::with([
                'reserva.huesped',
                'reserva.departamento.tipoDepartamento',
                'consumos.inventario.categoria',
                'consumos.usuarioRegistroDescuento',
                'clienteFacturacion',
                'usuarioGenero',
                'usuarioAnulo'
            ])->findOrFail($id);

            // Determinar si solicita factura detallada
            $solicitaDetallada = $factura->reserva->clientesFacturacion()
                ->wherePivot('cliente_facturacion_id', $factura->cliente_facturacion_id)
                ->first()
                ?->pivot
                ?->solicita_factura_detallada ?? false;

            $factura->solicita_factura_detallada = $solicitaDetallada;

            // Agrupar consumos por categoría
            $consumosAgrupados = [];
            foreach ($factura->consumos as $consumo) {
                $categoriaNombre = $consumo->inventario->categoria->nombre_categoria ?? 'Sin Categoría';

                if (!isset($consumosAgrupados[$categoriaNombre])) {
                    $consumosAgrupados[$categoriaNombre] = [];
                }

                $consumosAgrupados[$categoriaNombre][] = $consumo;
            }

            // Ordenar categorías alfabéticamente
            ksort($consumosAgrupados);

            $data = [
                'factura' => $factura,
                'consumos_agrupados' => $consumosAgrupados,
                'hotel_nombre' => config('app.hotel_nombre', 'Hotel Mansión Real'),
                'hotel_ruc' => config('app.hotel_ruc', '1234567890001'),
                'hotel_direccion' => config('app.hotel_direccion', 'Dirección'),
                'hotel_telefono' => config('app.hotel_telefono', 'Teléfono'),
                'hotel_email' => config('app.hotel_email', 'email@hotel.com'),
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
     * ✅ ACTUALIZADO: Obtener estadísticas generales de facturación
     */
    public function estadisticas(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->p_fecha_inicio;
            $fechaFin = $request->p_fecha_fin;
            $anio = $request->p_anio;

            // Query base para facturas emitidas
            $facturasEmitidasQuery = Factura::emitidas();
            $queryClone = clone $facturasEmitidasQuery;

            if ($fechaInicio && $fechaFin) {
                $facturasEmitidasQuery->entreFechas($fechaInicio, $fechaFin);
            } elseif ($anio) {
                $facturasEmitidasQuery->porAnio($anio);
            }

            $totalEmitidas = $facturasEmitidasQuery->count();
            $totalFacturado = $facturasEmitidasQuery->sum('total_factura');
            $totalIva = $facturasEmitidasQuery->sum('total_iva');
            $totalSinIva = $facturasEmitidasQuery->sum('subtotal_sin_iva');

            // ✅ ACTUALIZADO: Total de descuentos desde consumos
            $totalDescuentos = $facturasEmitidasQuery->get()
                ->sum(function ($factura) {
                    return $factura->total_descuentos;
                });

            // ✅ NUEVO: Facturas con descuentos
            $facturasConDescuento = $facturasEmitidasQuery->conDescuentos()->count();

            // Facturas anuladas
            $facturasAnuladasQuery = Factura::anuladas();
            if ($fechaInicio && $fechaFin) {
                $facturasAnuladasQuery->entreFechas($fechaInicio, $fechaFin);
            } elseif ($anio) {
                $facturasAnuladasQuery->porAnio($anio);
            }
            $totalAnuladas = $facturasAnuladasQuery->count();

            // Clientes
            $clientesFacturados = $facturasEmitidasQuery->distinct('cliente_facturacion_id')->count();
            $consumidoresFinales = $facturasEmitidasQuery
                ->where('cliente_facturacion_id', ClienteFacturacion::CONSUMIDOR_FINAL_ID)
                ->count();
            $clientesRegistrados = $totalEmitidas - $consumidoresFinales;

            return response()->json([
                'status' => HTTPStatus::Success,
                'periodo' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                    'anio' => $anio,
                    'es_rango' => ($fechaInicio && $fechaFin) ? true : false,
                    'es_anio' => (!$fechaInicio && !$fechaFin && $anio) ? true : false,
                ],
                'facturas' => [
                    'total_emitidas' => (int)$totalEmitidas,
                    'total_anuladas' => (int)$totalAnuladas,
                    'total_con_descuento' => $facturasConDescuento,
                    'total_general' => (int)($totalEmitidas + $totalAnuladas),
                ],
                'montos' => [
                    'total_facturado' => (float)round($totalFacturado, 2),
                    'total_iva' => (float)round($totalIva, 2),
                    'total_sin_iva' => (float)round($totalSinIva, 2),
                    'total_descuentos' => (float)round($totalDescuentos, 2),
                    'ticket_maximo' => (float)round(
                        $totalEmitidas > 0
                            ? $queryClone->max('total_factura')
                            : 0,
                        2
                    ),
                    'ticket_minimo' => (float)round(
                        $totalEmitidas > 0
                            ? $queryClone->min('total_factura')
                            : 0,
                        2
                    ),
                    'promedio_factura' => $totalEmitidas > 0
                        ? (float)round($totalFacturado / $totalEmitidas, 2)
                        : 0,
                ],
                'clientes' => [
                    'total_clientes' => $clientesFacturados,
                    'consumidores_finales' => $consumidoresFinales,
                    'clientes_registrados' => $clientesRegistrados,
                    'clientes_unicos'      => $clientesFacturados - $consumidoresFinales,
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
     * Reporte de facturas por cliente
     */
    public function reportePorCliente(int $cliente_id, Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->p_fecha_inicio;
            $fechaFin = $request->p_fecha_fin;

            $query = Factura::with('reserva')
                ->where('cliente_facturacion_id', $cliente_id)
                ->emitidas();

            if ($fechaInicio && $fechaFin) {
                $query->entreFechas($fechaInicio, $fechaFin);
            }

            $facturas = $query->orderBy('fecha_emision', 'desc')->get();

            $totalFacturado = $facturas->sum('total_factura');
            $cantidadFacturas = $facturas->count();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente_id' => $cliente_id,
                'periodo' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                ],
                'facturas' => $facturas,
                'resumen' => [
                    'cantidad_facturas' => $cantidadFacturas,
                    'total_facturado' => $totalFacturado,
                    'promedio_factura' => $cantidadFacturas > 0
                        ? round($totalFacturado / $cantidadFacturas, 2)
                        : 0
                ]
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
