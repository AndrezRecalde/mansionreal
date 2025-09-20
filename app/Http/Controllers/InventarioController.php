<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\InventarioRequest;
use App\Http\Requests\StatusRequest;
use App\Models\Inventario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    function getProductosInventario(Request $request): JsonResponse
    {
        // Obtener todos los productos del inventario con un scope por categoria y otro por nombre de producto
        try {
            $productos = Inventario::from('inventarios as i')
                ->select('i.*', 'c.id as categoria_id', 'c.nombre_categoria')
                ->join('categorias as c', 'i.categoria_id', '=', 'c.id')
                ->porCategoria($request->categoria_id)
                ->porNombreProducto($request->nombre_producto)
                ->buscarActivos($request->activo)
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'productos'   => $productos
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function store(InventarioRequest $request): JsonResponse
    {
        try {
            $producto = Inventario::create($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Creacion
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
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
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $producto->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Actualizado
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
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
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $producto->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Actualizado
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
