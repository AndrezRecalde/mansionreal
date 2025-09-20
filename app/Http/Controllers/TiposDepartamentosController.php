<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\TipoDepartamentoRequest;
use App\Models\TipoDepartamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TiposDepartamentosController extends Controller
{
    function getTiposDepartamentos(): JsonResponse
    {
        try {
            $tiposDepartamentos = TipoDepartamento::all();

            return response()->json([
                'status' => HTTPStatus::Success,
                'tiposDepartamentos'   => $tiposDepartamentos
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function store(TipoDepartamentoRequest $request): JsonResponse
    {
        try {
            TipoDepartamento::create($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Creacion,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function update(TipoDepartamentoRequest $request, int $id): JsonResponse
    {
        try {
            $tipoDepartamento = TipoDepartamento::find($id);
            if (!$tipoDepartamento) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $tipoDepartamento->update($request->validated());

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
