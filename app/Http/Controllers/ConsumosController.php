<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\ConsumoRequest;
use App\Http\Requests\RegistrarConsumosRequest;
use App\Models\Consumo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ConfiguracionIva;
use App\Models\Estado;
use App\Models\Huesped;
use App\Models\Inventario;
use App\Models\Reserva;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Svg\Tag\Rect;

class ConsumosController extends Controller
{
    public function buscarConsumosPorReserva(Request $request): JsonResponse
    {
        $reserva_id = $request->reserva_id;

        if (!$reserva_id) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Debe proporcionar el reserva_id'
            ], 400);
        }

        $consumos = Consumo::with('inventario')
            ->where('reserva_id', $reserva_id)
            ->get()
            ->map(function ($c) {
                return [
                    'id'              => $c->id,
                    'inventario_id'   => $c->inventario->id,
                    'nombre_producto' => $c->inventario->nombre_producto,
                    'precio_unitario' => $c->inventario->precio_unitario,
                    'reserva_id'      => $c->reserva_id,
                    'huesped'         => $c->reserva->huesped->nombres_completos,
                    'cantidad'        => $c->cantidad,
                    'subtotal'        => $c->subtotal,
                    'tasa_iva'        => $c->tasa_iva,
                    'iva'             => $c->iva,
                    'total'           => $c->total,
                    'fecha_creacion'  => $c->fecha_creacion,
                ];
            });

        return response()->json([
            'status' => HTTPStatus::Success,
            'consumos' => $consumos
        ], 200);
    }

    public function registrarConsumos(RegistrarConsumosRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumos = $request->validated()['consumos'];
            $reserva_id = $request->reserva_id;

            // Validar reserva
            $reserva = Reserva::findOrFail($reserva_id);

            // Obtener tasa de IVA (para TODOS)
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ?  $ivaConfig->tasa_iva : 15.00;

            $consumosProcesados = [];

            foreach ($consumos as $c) {
                $inventario = Inventario::findOrFail($c['inventario_id']);
                $cantidad = $c['cantidad'];
                $precio_unitario = $inventario->precio_unitario;
                $subtotal = $cantidad * $precio_unitario;

                // ============================================================
                // SIMPLIFICADO:  IVA siempre se calcula (no hay condicionales)
                // ============================================================
                $iva = $subtotal * ($tasa_iva / 100);
                $total = $subtotal + $iva;

                $consumo = Consumo::create([
                    'reserva_id'      => $reserva_id,
                    'inventario_id'   => $inventario->id,
                    'cantidad'        => $cantidad,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $total,
                    'creado_por_usuario_id' => Auth::id(),
                ]);

                $consumosProcesados[] = $consumo;

                // Descontar stock si aplica
                if (! $inventario->sin_stock) {
                    $inventario->stock -= $cantidad;
                    $inventario->save();
                }
            }

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Consumos registrados correctamente',
                'consumos' => $consumosProcesados,
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function update(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumo = Consumo::find($id);

            if (!$consumo) {
                return response()->json([
                    'status' => 'error',
                    'msg'    => 'Consumo no encontrado'
                ], 404);
            }

            $cantidadAnterior = $consumo->cantidad;
            $cantidadNueva = $request->cantidad;
            $diferencia = $cantidadNueva - $cantidadAnterior;

            // Obtener inventario
            $inventario = Inventario::findOrFail($request->inventario_id);

            // Verificar si cambió el inventario_id
            $cambioInventario = $consumo->inventario_id !== $request->inventario_id;

            if ($cambioInventario) {
                // ========== CAMBIÓ EL PRODUCTO ==========

                // Devolver al inventario anterior (solo si maneja stock)
                $inventarioAnterior = Inventario::findOrFail($consumo->inventario_id);
                if (!$inventarioAnterior->sin_stock) {
                    $inventarioAnterior->registrarEntrada(
                        cantidad: $cantidadAnterior,
                        motivo: 'Corrección de consumo (cambio de producto)',
                        observaciones: "Consumo ID: {$consumo->id} - Se cambió a otro producto",
                        usuarioId: Auth::id()
                    );
                }

                // Descontar del nuevo inventario (solo si maneja stock)
                if (!$inventario->sin_stock) {
                    if ($inventario->stock < $cantidadNueva) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Solicitado: {$cantidadNueva}");
                    }

                    $inventario->registrarSalida(
                        cantidad: $cantidadNueva,
                        motivo: 'Corrección de consumo (nuevo producto)',
                        observaciones: "Consumo ID: {$consumo->id} - Cambio de producto",
                        reservaId: $consumo->reserva_id,
                        consumoId: $consumo->id,
                        usuarioId: Auth::id()
                    );
                }
            } else {
                // ========== MISMO PRODUCTO, CAMBIÓ LA CANTIDAD ==========

                if ($diferencia > 0 && !$inventario->sin_stock) {
                    // Aumentó la cantidad = salida adicional
                    if ($inventario->stock < $diferencia) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Solicitado: {$diferencia}");
                    }

                    $inventario->registrarSalida(
                        cantidad: $diferencia,
                        motivo: 'Ajuste de consumo (aumento)',
                        observaciones: "Consumo ID: {$consumo->id} - Cantidad anterior: {$cantidadAnterior}, Nueva: {$cantidadNueva}",
                        reservaId: $consumo->reserva_id,
                        consumoId: $consumo->id,
                        usuarioId: Auth::id()
                    );
                } elseif ($diferencia < 0 && !$inventario->sin_stock) {
                    // Disminuyó la cantidad = devolución
                    $inventario->registrarEntrada(
                        cantidad: abs($diferencia),
                        motivo: 'Ajuste de consumo (devolución)',
                        observaciones: "Consumo ID: {$consumo->id} - Cantidad anterior: {$cantidadAnterior}, Nueva: {$cantidadNueva}",
                        usuarioId: Auth::id()
                    );
                }
            }

            // Obtener la tasa de IVA activa
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;

            // Obtener Precio Unitario del producto
            $precioUnitario = $inventario->precio_unitario;

            // Actualizar el consumo
            $consumo->inventario_id = $request->inventario_id;
            $consumo->cantidad = $cantidadNueva;
            $consumo->subtotal = $cantidadNueva * $precioUnitario;
            $consumo->tasa_iva = $tasa_iva;
            $consumo->iva = $consumo->subtotal * ($tasa_iva / 100);
            $consumo->total = $consumo->iva + $consumo->subtotal;
            $consumo->actualizado_por_usuario_id = Auth::id();
            $consumo->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'msg' => 'Consumo actualizado correctamente',
                'data' => $consumo
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function delete(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumo = Consumo::find($id);

            if (!$consumo) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            // Buscar al usuario con ese DNI
            $user = User::where('dni', $request->dni)->where('activo', 1)->first();

            // Validar existencia y rol GERENTE
            if (!$user || !$user->hasRole('GERENTE')) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'El DNI no corresponde a un usuario con rol GERENTE o no existe.'
                ], 403);
            }

            // Obtener inventario relacionado
            $inventario = Inventario::find($consumo->inventario_id);

            // Devolver stock al inventario si corresponde
            if ($inventario && !$inventario->sin_stock && $consumo->cantidad > 0) {
                $inventario->registrarEntrada(
                    cantidad: $consumo->cantidad,
                    motivo: 'Devolución por eliminación de consumo',
                    observaciones: "Consumo ID: {$consumo->id} eliminado por el usuario {$user->name} (GERENTE)",
                    usuarioId: $user->id
                );
            }

            // Eliminar el consumo
            $consumo->delete();

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Eliminado,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }


    /**
     * Genera un reporte de consumos de inventario agrupados por categoría
     * para reservas con estado PAGADO en un rango de fechas o año
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reporteConsumosPorCategoria(Request $request)
    {
        try {
            // Validación flexible:  puede venir año o rango de fechas
            $request->validate([
                'p_fecha_inicio' => 'nullable|date',
                'p_fecha_fin' => 'nullable|date|after_or_equal:p_fecha_inicio',
                'p_anio' => 'nullable|integer|min:2000|max:' . (date('Y') + 10),
            ]);

            // Determinar el rango de fechas a usar
            $rangoFechas = $this->determinarRangoFechas($request);

            // Obtener el ID del estado PAGADO
            $estadoPagado = Estado::where('nombre_estado', 'PAGADO')
                ->where('tipo_estado', 'PAGO')
                ->first();

            if (!$estadoPagado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Estado PAGADO no encontrado en el sistema'
                ], 404);
            }

            // Obtener los datos del reporte
            $reporteData = $this->obtenerDatosReporte(
                $estadoPagado->id,
                $rangoFechas['p_fecha_inicio'],
                $rangoFechas['p_fecha_fin']
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Reporte generado exitosamente',
                'reporteData' => $reporteData
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error de validación' . $e->errors()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al generar el reporte:  ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Exporta el reporte de consumos a PDF
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportarReporteConsumosPDF(Request $request)
    {
        try {
            // Validación flexible: puede venir año o rango de fechas
            $request->validate([
                'p_fecha_inicio' => 'nullable|date',
                'p_fecha_fin' => 'nullable|date|after_or_equal:p_fecha_inicio',
                'p_anio' => 'nullable|integer|min:2000|max:' .  (date('Y')),
            ]);

            // Determinar el rango de fechas a usar
            $rangoFechas = $this->determinarRangoFechas($request);

            // Obtener el ID del estado PAGADO
            $estadoPagado = Estado::where('nombre_estado', 'PAGADO')
                ->where('tipo_estado', 'PAGO')
                ->first();

            if (!$estadoPagado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Estado PAGADO no encontrado en el sistema'
                ], 404);
            }

            // Obtener los datos del reporte
            $reporteData = $this->obtenerDatosReporte(
                $estadoPagado->id,
                $rangoFechas['p_fecha_inicio'],
                $rangoFechas['p_fecha_fin']
            );

            if (empty($reporteData['categorias']) || count($reporteData['categorias']) === 0) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No hay datos para generar el reporte en el período seleccionado'
                ], 404);
            }

            // Datos para la vista PDF
            $data = [
                'title' => 'Reporte de Consumos por Categoría - Mansión Real',
                'categorias' => $reporteData['categorias'],
                'totales_generales' => $reporteData['totales_generales'],
                'metadatos' => $reporteData['metadatos'],
            ];

            // Generar el PDF
            $pdf = Pdf::loadView('pdf.reportes.consumo.reporte_consumos_categoria', $data)
                ->setPaper('a4', 'portrait')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            // Nombre del archivo
            $tipoFiltro = $rangoFechas['tipo_filtro'] === 'p_anio'
                ? 'anio_' . $rangoFechas['anio_usado']
                : 'desde_' . $rangoFechas['p_fecha_inicio'] . '_hasta_' . $rangoFechas['p_fecha_fin'];

            $nombreArchivo = 'reporte_consumos_' . $tipoFiltro .  '_' . date('YmdHis') . '.pdf';

            return $pdf->download($nombreArchivo);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error de validación' . $e->errors()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al generar el PDF: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Determina el rango de fechas basado en los parámetros del request
     * Prioridad: 1. Rango de fechas explícito, 2. Año
     *
     * @param Request $request
     * @return array
     */
    private function determinarRangoFechas(Request $request): array
    {
        // PRIORIDAD 1: Si vienen ambas fechas (inicio y fin), usarlas
        if ($request->filled('p_fecha_inicio') && $request->filled('p_fecha_fin')) {
            return [
                'p_fecha_inicio' => $request->p_fecha_inicio,
                'p_fecha_fin' => $request->p_fecha_fin,
                'tipo_filtro' => 'rango',
                'anio_usado' => null,
            ];
        }

        // PRIORIDAD 2: Si viene solo el año, calcular el rango de ese año
        if ($request->filled('p_anio')) {
            $anio = $request->p_anio;
            return [
                'p_fecha_inicio' => $anio .  '-01-01',
                'p_fecha_fin' => $anio . '-12-31',
                'tipo_filtro' => 'p_anio',
                'anio_usado' => $anio,
            ];
        }

        // CASO POR DEFECTO:  Usar el año actual si no viene nada
        $anioActual = date('Y');
        return [
            'p_fecha_inicio' => $anioActual . '-01-01',
            'p_fecha_fin' => $anioActual . '-12-31',
            'tipo_filtro' => 'p_anio',
            'anio_usado' => $anioActual,
        ];
    }

    /**
     * Método privado para obtener los datos del reporte
     * (reutilizable para JSON y PDF)
     *
     * @param int $estadoPagadoId
     * @param string $fechaInicio
     * @param string $fechaFin
     * @return array
     */
    private function obtenerDatosReporte($estadoPagadoId, $fechaInicio, $fechaFin)
    {
        // Consulta optimizada para obtener consumos agrupados por categoría y producto
        $consumosPorCategoria = DB::table('consumos as c')
            ->join('reservas as r', 'c.reserva_id', '=', 'r.id')
            ->join('inventarios as i', 'c.inventario_id', '=', 'i.id')
            ->join('categorias as cat', 'i.categoria_id', '=', 'cat.id')
            ->where('r.estado_id', $estadoPagadoId)
            ->whereBetween('c.fecha_creacion', [$fechaInicio, $fechaFin])
            ->select(
                'cat.id as categoria_id',
                'cat.nombre_categoria',
                'i.id as producto_id',
                'i.nombre_producto',
                'i.precio_unitario',
                DB::raw('SUM(c.cantidad) as cantidad_total'),
                DB::raw('SUM(c.subtotal) as subtotal_producto'),
                DB::raw('SUM(c. iva) as iva_producto'),
                DB::raw('SUM(c.total) as total_producto')
            )
            ->groupBy('cat.id', 'cat.nombre_categoria', 'i.id', 'i.nombre_producto', 'i.precio_unitario')
            ->orderBy('cat.nombre_categoria')
            ->orderBy('i.nombre_producto')
            ->get();

        // Agrupar productos por categoría
        $categorias = [];
        $categoriasAgrupadas = $consumosPorCategoria->groupBy('categoria_id');

        foreach ($categoriasAgrupadas as $categoriaId => $productos) {
            $primeraFila = $productos->first();

            $productosArray = $productos->map(function ($producto) {
                return [
                    'producto_id' => $producto->producto_id,
                    'nombre_producto' => $producto->nombre_producto,
                    'cantidad_total' => (int) $producto->cantidad_total,
                    'precio_unitario' => (float) $producto->precio_unitario,
                    'subtotal' => (float) $producto->subtotal_producto,
                    'iva' => (float) $producto->iva_producto,
                    'total' => (float) $producto->total_producto,
                ];
            })->toArray();

            $categorias[] = [
                'categoria_id' => $categoriaId,
                'nombre_categoria' => $primeraFila->nombre_categoria,
                'productos' => $productosArray,
                'totales_categoria' => [
                    'cantidad_total' => (int) $productos->sum('cantidad_total'),
                    'subtotal' => (float) $productos->sum('subtotal_producto'),
                    'iva' => (float) $productos->sum('iva_producto'),
                    'total' => (float) $productos->sum('total_producto'),
                ]
            ];
        }

        // Calcular totales generales
        $totalesGenerales = [
            'cantidad_total_general' => (int) $consumosPorCategoria->sum('cantidad_total'),
            'subtotal_general' => (float) $consumosPorCategoria->sum('subtotal_producto'),
            'iva_general' => (float) $consumosPorCategoria->sum('iva_producto'),
            'total_general' => (float) $consumosPorCategoria->sum('total_producto'),
        ];

        // Información adicional del reporte
        $metadatos = [
            'p_fecha_inicio' => $fechaInicio,
            'p_fecha_fin' => $fechaFin,
            'fecha_generacion' => now()->format('Y-m-d H:i:s'),
            'total_categorias' => count($categorias),
            'total_productos' => $consumosPorCategoria->count(),
        ];

        return [
            'metadatos' => $metadatos,
            'categorias' => $categorias,
            'totales_generales' => $totalesGenerales
        ];
    }
}
