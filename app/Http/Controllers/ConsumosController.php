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
use App\Models\Inventario;
use App\Models\Reserva;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

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
                        motivo: 'Actualización de consumo (cambio de producto)',
                        observaciones: "Consumo ID: {$consumo->id}",
                        reservaId: $consumo->reserva_id,
                        consumoId: $consumo->id,
                        usuarioId: Auth::id()
                    );
                }
            } else {
                if ($diferencia != 0 && !$inventario->sin_stock) {
                    if ($diferencia > 0) {
                        if ($inventario->stock < $diferencia) {
                            throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Adicional requerido: {$diferencia}");
                        }

                        $inventario->registrarSalida(
                            cantidad: $diferencia,
                            motivo: 'Ajuste de consumo (incremento de cantidad)',
                            observaciones: "Consumo ID: {$consumo->id} - Aumentó de {$cantidadAnterior} a {$cantidadNueva}",
                            reservaId: $consumo->reserva_id,
                            consumoId: $consumo->id,
                            usuarioId: Auth::id()
                        );
                    } else {
                        $inventario->registrarEntrada(
                            cantidad: abs($diferencia),
                            motivo: 'Ajuste de consumo (reducción de cantidad)',
                            observaciones: "Consumo ID: {$consumo->id} - Disminuyó de {$cantidadAnterior} a {$cantidadNueva}",
                            usuarioId: Auth::id()
                        );
                    }
                }
            }

            $consumo->inventario_id = $inventario->id;
            $consumo->cantidad = $cantidadNueva;
            $precio_unitario = $inventario->precio_unitario;
            $consumo->subtotal = $cantidadNueva * $precio_unitario;

            if ($consumo->tiene_descuento) {
                $consumo->recalcularTotales();
            } else {
                $consumo->iva = $consumo->subtotal * ($consumo->tasa_iva / 100);
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

            $query = DB::table('consumos as c')
                ->join('inventarios as i', 'c.inventario_id', '=', 'i.id')
                ->join('categorias as cat', 'i.categoria_id', '=', 'cat.id')
                ->select(
                    'cat.id as categoria_id',
                    'cat.nombre_categoria',
                    'i.id as producto_id',
                    'i.nombre_producto',
                    DB::raw('SUM(c.cantidad) as cantidad_total'),
                    'i.precio_unitario',
                    DB::raw('SUM(c.subtotal) as subtotal_producto'),
                    DB::raw('SUM(c.iva) as iva_producto'),
                    DB::raw('SUM(c.total) as total_producto')
                );

            if ($fechaInicio && $fechaFin) {
                $query->whereBetween('c.fecha_creacion', [$fechaInicio, $fechaFin]);
            }

            $consumosPorCategoria = $query
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
                    'subtotal_categoria' => (float) $productos->sum('subtotal_producto'),
                    'iva_categoria' => (float) $productos->sum('iva_producto'),
                    'total_categoria' => (float) $productos->sum('total_producto'),
                ];
            }

            // Totales generales
            $totales = [
                'subtotal_general' => (float) $consumosPorCategoria->sum('subtotal_producto'),
                'iva_general' => (float) $consumosPorCategoria->sum('iva_producto'),
                'total_general' => (float) $consumosPorCategoria->sum('total_producto'),
                'cantidad_categorias' => count($categorias),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'periodo' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                ],
                'categorias' => $categorias,
                'totales' => $totales,
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
            $fechaInicio = $request->input('fecha_inicio');
            $fechaFin = $request->input('fecha_fin');

            $response = $this->reporteConsumosPorCategoria($request);
            $data = json_decode($response->getContent(), true);

            if ($data['status'] !== HTTPStatus::Success) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se pudo generar el reporte PDF: ' . ($data['msg'] ?? 'Error desconocido')
                ], 500);
            }

            $pdfData = [
                'title' => 'Reporte de Consumos por Categoría',
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'categorias' => $data['categorias'],
                'totales' => $data['totales'],
            ];

            $pdf = Pdf::loadView('pdf.reportes.consumo.reporte_consumos_categoria', $pdfData);
            $pdf->setPaper('a4', 'portrait');

            return $pdf->download('reporte_consumos_categoria.pdf');
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
