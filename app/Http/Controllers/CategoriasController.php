<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\CategoriaRequest;
use App\Http\Requests\StatusRequest;
use App\Models\Categoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriasController extends Controller
{
    function getCategorias(Request $request): JsonResponse
    {
        try {
            if ($request->busqueda === "INVENTARIO") {
                $categorias = Categoria::buscarActivos($request->activo)->get();
            } else {
                $categorias = Categoria::buscarActivos($request->activo)->skip(2)->take(100)->get();
            }
            return response()->json([
                'status'       => HTTPStatus::Success,
                'categorias'   => $categorias
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function store(CategoriaRequest $request): JsonResponse
    {
        try {
            Categoria::create($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Creacion,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function update(CategoriaRequest $request, int $id): JsonResponse
    {
        try {
            $categoria = Categoria::find($id);
            if (!$categoria) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $categoria->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Actualizado,
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
        $categoria = Categoria::find($id);
        try {
            if ($categoria) {
                $categoria->update($request->validated());
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg' => HTTPStatus::Actualizado
                ], 201);
            } else {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' =>  HTTPStatus::Error,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
