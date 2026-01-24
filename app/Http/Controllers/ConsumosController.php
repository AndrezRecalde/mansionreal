<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\AplicarDescuentoConsumoRequest;
use App\Http\Requests\RegistrarConsumosRequest;
use App\Http\Resources\ConsumoResource;
use App\Models\Consumo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ConfiguracionIva;
use App\Models\Estado;
use App\Models\Inventario;
use App\Models\Reserva;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class ConsumosController extends Controller
{
    /**
     * ✅ ACTUALIZADO: Buscar consumos por reserva (incluye descuentos)
     */
    public function buscarConsumosPorReserva(Request $request): JsonResponse
    {
        $reserva_id = $request->reserva_id;

        if (!$reserva_id) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Debe proporcionar el reserva_id'
            ], 400);
        }

        $consumos = Consumo::with(['inventario', 'reserva.huesped', 'usuarioRegistroDescuento'])
            ->where('reserva_id', $reserva_id)
            ->get();

        return response()->json([
            'status' => HTTPStatus::Success,
            'consumos' => ConsumoResource::collection($consumos), // ✅ Usar Resource
        ], 200);
    }

    /**
     * Registrar consumos (sin descuentos iniciales)
     */
    public function registrarConsumos(RegistrarConsumosRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumos = $request->validated()['consumos'];
            $reserva_id = $request->reserva_id;

            // Validar reserva
            $reserva = Reserva::findOrFail($reserva_id);

            // Obtener tasa de IVA
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 15.00;

            $consumosProcesados = [];

            foreach ($consumos as $c) {
                $inventario = Inventario::findOrFail($c['inventario_id']);
                $cantidad = $c['cantidad'];
                $precio_unitario = $inventario->precio_unitario;
                $subtotal = $cantidad * $precio_unitario;

                // Calcular IVA
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
                    'descuento'       => 0,
                    'tipo_descuento'  => Consumo::TIPO_DESCUENTO_SIN_DESCUENTO,
                    'creado_por_usuario_id' => Auth::id(),
                ]);

                $consumosProcesados[] = $consumo;

                // Descontar stock si aplica
                if (!$inventario->sin_stock) {
                    $inventario->stock -= $cantidad;
                    $inventario->save();
                }
            }

            DB::commit();

            // ✅ Cargar relaciones y usar Resource
            $consumosProcesados = Consumo::with(['inventario', 'reserva.huesped'])
                ->whereIn('id', collect($consumosProcesados)->pluck('id'))
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Consumos registrados correctamente',
                'consumos' => ConsumoResource::collection($consumosProcesados), // ✅ Usar Resource
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ ACTUALIZADO: Actualizar consumo (usando Resource)
     */
    public function update(Request $request, int $id): JsonResponse
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

            if ($consumo->esta_facturado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se puede modificar un consumo que ya está facturado'
                ], 400);
            }

            $cantidadAnterior = $consumo->cantidad;
            $cantidadNueva = $request->cantidad;
            $diferencia = $cantidadNueva - $cantidadAnterior;

            $inventario = Inventario::findOrFail($request->inventario_id);
            $cambioInventario = $consumo->inventario_id !== $request->inventario_id;

            // ====================================================================
            // ✅ NUEVO: Validar traslape de fechas si es categoría HOSPEDAJE
            // ====================================================================
            $categoria = $inventario->categoria;

            if ($categoria && strtoupper($categoria->nombre_categoria) === 'HOSPEDAJE' && $diferencia != 0) {
                $reserva = Reserva::findOrFail($consumo->reserva_id);

                // Calcular la nueva fecha_checkout propuesta
                $nuevaFechaCheckout = Carbon::parse($reserva->fecha_checkout)->addDays($diferencia);

                // Obtener estados activos de reserva (RESERVADO, CONFIRMADO)
                $estadoReservaIds = Estado::where('activo', 1)
                    ->where('tipo_estado', 'RESERVA')
                    ->whereIn('nombre_estado', ['RESERVADO', 'CONFIRMADO'])
                    ->pluck('id')
                    ->toArray();

                // Verificar si hay traslape con otras reservas del mismo departamento
                $reservaConflictiva = Reserva::where('departamento_id', $reserva->departamento_id)
                    ->where('id', '!=', $reserva->id) // Excluir la reserva actual
                    ->whereIn('estado_id', $estadoReservaIds)
                    ->where(function ($query) use ($reserva, $nuevaFechaCheckout) {
                        $query->whereBetween('fecha_checkin', [$reserva->fecha_checkin, $nuevaFechaCheckout])
                            ->orWhereBetween('fecha_checkout', [$reserva->fecha_checkin, $nuevaFechaCheckout])
                            ->orWhere(function ($subQuery) use ($reserva, $nuevaFechaCheckout) {
                                $subQuery->where('fecha_checkin', '<=', $reserva->fecha_checkin)
                                    ->where('fecha_checkout', '>=', $nuevaFechaCheckout);
                            });
                    })
                    ->first();

                if ($reservaConflictiva) {
                    return response()->json([
                        'status' => HTTPStatus::Error,
                        'msg' => sprintf(
                            'No se puede extender la reserva. El departamento %s ya tiene una reserva (Código: %s) desde %s hasta %s',
                            $reserva->departamento->numero_departamento ?? 'N/A',
                            $reservaConflictiva->codigo_reserva,
                            Carbon::parse($reservaConflictiva->fecha_checkin)->format('d/m/Y H:i'),
                            Carbon::parse($reservaConflictiva->fecha_checkout)->format('d/m/Y H:i')
                        )
                    ], 422);
                }
            }

            if ($cambioInventario) {
                $inventarioAnterior = Inventario::findOrFail($consumo->inventario_id);
                if (!$inventarioAnterior->sin_stock) {
                    $inventarioAnterior->registrarEntrada(
                        cantidad: $cantidadAnterior,
                        motivo: 'Corrección de consumo (cambio de producto)',
                        observaciones: "Consumo ID: {$consumo->id} - Se cambió a otro producto",
                        usuarioId: Auth::id()
                    );
                }

                if (!$inventario->sin_stock) {
                    if ($inventario->stock < $cantidadNueva) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Solicitado: {$cantidadNueva}");
                    }

                    $inventario->registrarSalida(
                        cantidad: $cantidadNueva,
                        motivo: 'Consumo actualizado (nuevo producto)',
                        observaciones: "Consumo ID: {$consumo->id}",
                        usuarioId: Auth::id()
                    );
                }
            } else {
                // Mismo producto, ajustar diferencia
                if (!$inventario->sin_stock) {
                    if ($diferencia > 0) {
                        // Se aumentó la cantidad
                        if ($inventario->stock < $diferencia) {
                            throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Requerido: {$diferencia}");
                        }

                        $inventario->registrarSalida(
                            cantidad: abs($diferencia),
                            motivo: 'Aumento de cantidad en consumo',
                            observaciones: "Consumo ID: {$consumo->id} - Cantidad anterior: {$cantidadAnterior}, Nueva: {$cantidadNueva}",
                            usuarioId: Auth::id()
                        );
                    } elseif ($diferencia < 0) {
                        // Se redujo la cantidad
                        $inventario->registrarEntrada(
                            cantidad: abs($diferencia),
                            motivo: 'Reducción de cantidad en consumo',
                            observaciones: "Consumo ID: {$consumo->id} - Cantidad anterior: {$cantidadAnterior}, Nueva: {$cantidadNueva}",
                            usuarioId: Auth::id()
                        );
                    }
                }
            }

            // ====================================================================
            // ✅ Ajustar fecha_checkout de la Reserva si es HOSPEDAJE
            // ====================================================================
            if ($categoria && strtoupper($categoria->nombre_categoria) === 'HOSPEDAJE') {
                $reserva = Reserva::findOrFail($consumo->reserva_id);

                // Calcular el ajuste de días según la diferencia de cantidad
                if ($diferencia != 0) {
                    // fecha_checkout se ajusta según la diferencia de noches
                    $reserva->fecha_checkout = Carbon::parse($reserva->fecha_checkout)
                        ->addDays($diferencia)
                        ->format('Y-m-d H:i:s');

                    // Actualizar también el total de noches
                    $reserva->total_noches = $cantidadNueva;

                    $reserva->save();

                    Log::info("Fecha checkout actualizada por cambio en consumo de HOSPEDAJE", [
                        'consumo_id' => $consumo->id,
                        'reserva_id' => $reserva->id,
                        'diferencia_noches' => $diferencia,
                        'nueva_fecha_checkout' => $reserva->fecha_checkout,
                        'total_noches' => $reserva->total_noches
                    ]);
                }
            }

            // Actualizar datos del consumo
            $consumo->inventario_id = $request->inventario_id;
            $consumo->cantidad = $cantidadNueva;

            // Recalcular precio unitario y tasa IVA
            $precio_unitario = $inventario->precio_unitario;
            $tasa_iva = ConfiguracionIva::where('activo', true)->first()?->tasa_iva ?? 15.00;

            // Recalcular totales
            $subtotal = $cantidadNueva * $precio_unitario;
            $consumo->subtotal = $subtotal;
            $consumo->tasa_iva = $tasa_iva;

            if ($consumo->tipo_descuento == Consumo::TIPO_DESCUENTO_SIN_DESCUENTO) {
                $consumo->iva = $subtotal * ($tasa_iva / 100);
                $consumo->total = $consumo->subtotal + $consumo->iva;
            } else {
                $consumo->aplicarDescuento(
                    descuento: $consumo->descuento,
                    tipo: $consumo->tipo_descuento,
                    motivo: $consumo->motivo_descuento,
                    usuarioId: $consumo->usuario_registro_descuento_id
                );

                // Recalcular totales después del descuento
                $consumo->tasa_iva = $tasa_iva;
                $consumo->iva = ($consumo->subtotal - $consumo->descuento) * ($tasa_iva / 100);
                $consumo->total = $consumo->subtotal + $consumo->iva;
            }

            $consumo->actualizado_por_usuario_id = Auth::id();
            $consumo->save();

            DB::commit();

            // ✅ Usar Resource
            $consumo->load(['inventario', 'reserva.huesped', 'usuarioRegistroDescuento']);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => 'Consumo actualizado correctamente',
                'consumo' => new ConsumoResource($consumo) // ✅ Usar Resource
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar consumo
     */
    public function delete(Request $request, int $id): JsonResponse
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

            if ($consumo->esta_facturado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se puede eliminar un consumo que ya está facturado'
                ], 400);
            }

            $user = User::where('dni', $request->dni)->where('activo', 1)->first();

            if (!$user || !$user->hasRole('GERENTE')) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'El DNI no corresponde a un usuario con rol GERENTE o no existe.'
                ], 403);
            }

            $inventario = Inventario::find($consumo->inventario_id);

            if ($inventario && !$inventario->sin_stock && $consumo->cantidad > 0) {
                $inventario->registrarEntrada(
                    cantidad: $consumo->cantidad,
                    motivo: 'Devolución por eliminación de consumo',
                    observaciones: "Consumo ID: {$consumo->id} eliminado por el usuario {$user->name} (GERENTE)",
                    usuarioId: $user->id
                );
            }

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
     * ✅ NUEVO: Aplicar descuento a un consumo (usando Resource)
     */
    public function aplicarDescuento(AplicarDescuentoConsumoRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumo = Consumo::findOrFail($id);

            // Aplicar descuento
            $success = $consumo->aplicarDescuento(
                descuento: $request->descuento,
                tipo: $request->tipo_descuento,
                motivo: $request->motivo_descuento,
                usuarioId: Auth::id()
            );

            if (!$success) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Error al aplicar el descuento al consumo'
                ], 500);
            }

            DB::commit();

            // ✅ Cargar relaciones y usar Resource
            $consumo->load(['inventario', 'reserva.huesped', 'usuarioRegistroDescuento']);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento aplicado correctamente',
                'consumo' => new ConsumoResource($consumo), // ✅ Usar Resource
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
     * ✅ NUEVO: Eliminar descuento de un consumo (usando Resource)
     */
    public function eliminarDescuento(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumo = Consumo::findOrFail($id);

            if ($consumo->esta_facturado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se puede eliminar descuento de un consumo ya facturado'
                ], 400);
            }

            $success = $consumo->removerDescuento();

            if (!$success) {
                throw new \Exception('Error al eliminar descuento del consumo');
            }

            DB::commit();

            // ✅ Usar Resource
            $consumo->load(['inventario', 'reserva.huesped']);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento eliminado correctamente',
                'consumo' => new ConsumoResource($consumo), // ✅ Usar Resource
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
     * Reporte de consumos por categoría
     */
    public function reporteConsumosPorCategoria(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->input('fecha_inicio');
            $fechaFin = $request->input('fecha_fin');
            $anio = $request->input('p_anio');

            $query = DB::table('consumos as c')
                ->join('inventarios as i', 'c.inventario_id', '=', 'i.id')
                ->join('categorias as cat', 'i.categoria_id', '=', 'cat.id')
                ->join('reservas as r', 'c.reserva_id', '=', 'r.id')
                ->join('estados as e', 'r.estado_id', '=', 'e.id')
                ->where('e.nombre_estado', 'PAGADO') // Solo reservas PAGADAS
                ->select(
                    'cat.id as categoria_id',
                    'cat.nombre_categoria',
                    'i.id as producto_id',
                    'i.nombre_producto',
                    DB::raw('SUM(c.cantidad) as cantidad_total'),
                    'i.precio_unitario',
                    DB::raw('SUM(c.subtotal) as subtotal'), // Subtotal SIN descuento
                    DB::raw('SUM(c.descuento) as descuento_total'), // ✅ NUEVO: Total de descuentos
                    DB::raw('SUM(c.iva) as iva'),
                    DB::raw('SUM(c.total) as total')
                );

            // ✅ Aplicar filtro por rango de fechas o por año
            if ($fechaInicio && $fechaFin) {
                $query->whereBetween('c.fecha_creacion', [$fechaInicio, $fechaFin]);
            } elseif ($anio) {
                $query->whereYear('c.fecha_creacion', $anio);
            }

            $consumosPorCategoria = $query
                ->groupBy('cat.id', 'cat.nombre_categoria', 'i.id', 'i.nombre_producto', 'i.precio_unitario')
                ->orderBy('cat.nombre_categoria')
                ->orderBy('i.nombre_producto')
                ->get();

            // Agrupar productos por categoría
            $categorias = [];
            $categoriasAgrupadas = $consumosPorCategoria->groupBy('categoria_id');
            $cantidadTotalGeneral = 0;
            $descuentoTotalGeneral = 0; // ✅ NUEVO

            foreach ($categoriasAgrupadas as $categoriaId => $productos) {
                $primeraFila = $productos->first();

                // ✅ Calcular cantidad total de la categoría
                $cantidadTotalCategoria = $productos->sum('cantidad_total');
                $descuentoTotalCategoria = $productos->sum('descuento_total'); // ✅ NUEVO

                $cantidadTotalGeneral += $cantidadTotalCategoria;
                $descuentoTotalGeneral += $descuentoTotalCategoria; // ✅ NUEVO

                $categorias[] = [
                    'categoria_id' => $categoriaId,
                    'nombre_categoria' => $primeraFila->nombre_categoria,
                    'productos' => $productos->map(function ($p) {
                        return [
                            'producto_id' => $p->producto_id,
                            'nombre_producto' => $p->nombre_producto,
                            'cantidad_total' => (int) $p->cantidad_total,
                            'precio_unitario' => (float) $p->precio_unitario,
                            'subtotal' => (float) $p->subtotal,
                            'descuento' => (float) $p->descuento_total, // ✅ NUEVO
                            'iva' => (float) $p->iva,
                            'total' => (float) $p->total,
                        ];
                    })->toArray(),
                    'totales_categoria' => [
                        'cantidad_total' => $cantidadTotalCategoria,
                        'subtotal' => (float) $productos->sum('subtotal'),
                        'descuento' => (float) $descuentoTotalCategoria, // ✅ NUEVO
                        'iva' => (float) $productos->sum('iva'),
                        'total' => (float) $productos->sum('total'),
                    ],
                ];
            }

            $totales_generales = [
                'cantidad_total_general' => $cantidadTotalGeneral,
                'subtotal_general' => (float) $consumosPorCategoria->sum('subtotal'),
                'descuento_general' => (float) $descuentoTotalGeneral, // ✅ NUEVO
                'iva_general' => (float) $consumosPorCategoria->sum('iva'),
                'total_general' => (float) $consumosPorCategoria->sum('total'),
                'cantidad_categorias' => count($categorias),
                'cantidad_productos' => $consumosPorCategoria->count(),
            ];

            // ✅ Estructura de metadatos esperada por el frontend
            $metadatos = [
                'p_fecha_inicio' => $fechaInicio,
                'p_fecha_fin' => $fechaFin,
                'p_anio' => $anio,
                'fecha_generacion' => now()->format('Y-m-d H:i:s'),
                'total_categorias' => count($categorias),
                'total_productos' => $consumosPorCategoria->count(),
            ];

            // ✅ Estructura correcta esperada por el frontend
            $reporteData = [
                'metadatos' => $metadatos,
                'categorias' => $categorias,
                'totales_generales' => $totales_generales,
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'reporteData' => $reporteData,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar reporte de consumos a PDF
     */
    public function exportarReporteConsumosPDF(Request $request)
    {
        try {
            $fechaInicio = $request->input('p_fecha_inicio');
            $fechaFin = $request->input('p_fecha_fin');
            $anio = $request->input('p_anio');

            $normalizedRequest = new Request([
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'p_anio' => $anio,
            ]);

            // Obtener los datos del reporte
            $response = $this->reporteConsumosPorCategoria($normalizedRequest);
            $data = json_decode($response->getContent(), true);

            if (!isset($data['status']) || $data['status'] !== 'success') {
                $errorMsg = isset($data['msg']) ? $data['msg'] : 'Estructura de respuesta inválida';
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Error al obtener datos del reporte: ' . $errorMsg
                ], 500);
            }

            if (!isset($data['reporteData'])) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Datos del reporte no encontrados en la respuesta'
                ], 500);
            }

            $reporteData = $data['reporteData'];
            $metadatos = $reporteData['metadatos'] ?? [];
            $categorias = $reporteData['categorias'] ?? [];
            $totales_generales = $reporteData['totales_generales'] ?? [];

            $pdfData = [
                'title' => 'Reporte de Consumos por Categoría',
                'metadatos' => $metadatos,
                'categorias' => $categorias,
                'totales_generales' => $totales_generales,
            ];

            $pdf = Pdf::loadView('pdf.reportes.consumo.reporte_consumos_categoria', $pdfData);
            $pdf->setPaper('a4', 'portrait');

            $nombreArchivo = 'reporte_consumos_categoria';
            if ($fechaInicio && $fechaFin) {
                $nombreArchivo .= "_{$fechaInicio}_{$fechaFin}";
            } elseif ($anio) {
                $nombreArchivo .= "_{$anio}";
            } else {
                $nombreArchivo .= '_todos';
            }
            $nombreArchivo .= '.pdf';

            return $pdf->download($nombreArchivo);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al generar PDF: ' . $th->getMessage()
            ], 500);
        }
    }
}
