<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\InventarioRequest;
use App\Http\Requests\StatusRequest;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InventarioController extends Controller
{
    function getProductosInventario(Request $request): JsonResponse
    {
        try {
            $query = Inventario::from('inventarios as i')
                ->select('i.*', 'c.id as categoria_id', 'c.nombre_categoria')
                ->join('categorias as c', 'i.categoria_id', '=', 'c.id')
                ->porCategoria($request->input('categoria_id'))
                ->porNombreProducto($request->input('nombre_producto'));

            if ($request->has('activo')) {
                $query->buscarActivos($request->input('activo'));
            }

            $productos = $query->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'productos' => $productos,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function store(InventarioRequest $request): JsonResponse
    {
        try {
            Inventario::create($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Creacion
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function update(InventarioRequest $request, int $id): JsonResponse
    {
        try {
            $producto = Inventario::find($id);
            if (!$producto) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => HTTPStatus::NotFound
                ], 404);
            }

            if ($request->sin_stock) {
                $producto->stock = 0;
            }

            $producto->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Actualizado
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function updateStatus(StatusRequest $request, int $id): JsonResponse
    {
        try {
            $producto = Inventario::find($id);
            if (!$producto) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => HTTPStatus::NotFound
                ], 404);
            }

            $producto->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Actualizado
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }


    /**
     * Agregar stock a un inventario
     */
    public function agregarStock(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1',
            'motivo' => 'required|string|max:255',
            'observaciones' => 'nullable|string'
        ]);

        $inventario = Inventario::findOrFail($id);

        try {
            $movimiento = $inventario->registrarEntrada(
                cantidad: $request->cantidad,
                motivo: $request->motivo,
                observaciones: $request->observaciones
            );

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Stock agregado correctamente',
                'inventario' => $inventario->fresh(),
                'movimiento' => $movimiento
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Ver historial de movimientos de un inventario
     */
    public function historialMovimientos(Request $request, int $id): JsonResponse
    {
        try {
            $inventario = Inventario::findOrFail($id);
            $anio = $request->query('anio');

            $query = $inventario->movimientos()
                ->with(['usuario:id,nombres,apellidos', 'reserva:id,codigo_reserva', 'consumo:id,cantidad']);

            if ($anio) {
                $query->whereYear('fecha_movimiento', $anio);
            }

            $movimientos = $query->orderBy('fecha_movimiento', 'desc')->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'inventario' => [
                    'id' => $inventario->id,
                    'nombre_producto' => $inventario->nombre_producto,
                    'stock_actual' => $inventario->stock,
                    'sin_stock' => $inventario->sin_stock,
                    'activo' => $inventario->activo,
                ],
                'movimientos' => $movimientos,
                'total' => $movimientos->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'mensaje' => 'Error al obtener el historial de movimientos',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Reporte de movimientos por fecha
     */
    public function reporteMovimientos(Request $request): JsonResponse
    {
        try {
            $query = MovimientoInventario::query()
                ->with([
                    'inventario:id,nombre_producto,stock,sin_stock',
                    'usuario:id,name,email',
                    'reserva:id,codigo_reserva'
                ]);

            // Filtro por rango de fechas
            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porFecha($request->fecha_inicio, $request->fecha_fin);
            }

            // Filtro por tipo de movimiento
            if ($request->has('tipo_movimiento')) {
                $query->where('tipo_movimiento', $request->tipo_movimiento);
            }

            // Filtro por inventario específico
            if ($request->has('inventario_id')) {
                $query->porInventario($request->inventario_id);
            }

            $movimientos = $query->orderBy('fecha_movimiento', 'desc')->paginate(50);

            // Estadísticas adicionales
            $estadisticas = [
                'total_entradas' => MovimientoInventario::query()
                    ->where('tipo_movimiento', 'entrada')
                    ->when($request->has('fecha_inicio') && $request->has('fecha_fin'), function ($q) use ($request) {
                        $q->porFecha($request->fecha_inicio, $request->fecha_fin);
                    })
                    ->sum('cantidad'),
                'total_salidas' => abs(MovimientoInventario::query()
                    ->where('tipo_movimiento', 'salida')
                    ->when($request->has('fecha_inicio') && $request->has('fecha_fin'), function ($q) use ($request) {
                        $q->porFecha($request->fecha_inicio, $request->fecha_fin);
                    })
                    ->sum('cantidad')),
                'total_movimientos' => $movimientos->total(),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'filtros' => [
                    'fecha_inicio' => $request->fecha_inicio ?? null,
                    'fecha_fin' => $request->fecha_fin ?? null,
                    'tipo_movimiento' => $request->tipo_movimiento ?? null,
                    'inventario_id' => $request->inventario_id ?? null,
                ],
                'estadisticas' => $estadisticas,
                'movimientos' => $movimientos->items(),
                'paginacion' => [
                    'total' => $movimientos->total(),
                    'por_pagina' => $movimientos->perPage(),
                    'pagina_actual' => $movimientos->currentPage(),
                    'ultima_pagina' => $movimientos->lastPage(),
                    'desde' => $movimientos->firstItem(),
                    'hasta' => $movimientos->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'mensaje' => 'Error al generar el reporte de movimientos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
