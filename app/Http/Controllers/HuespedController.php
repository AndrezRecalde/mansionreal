<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\HuespedRequest;
use App\Models\Huesped;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HuespedController extends Controller
{
    function getHuespedes(Request $request): JsonResponse
    {
        try {
            $perPage = intval($request->input('per_page', 20));
            $page = intval($request->input('page', 1));

            $huespedes = Huesped::paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => HTTPStatus::Success,
                'huespedes'   => $huespedes->items(),
                'paginacion' => [
                    'total' => $huespedes->total(),
                    'por_pagina' => $huespedes->perPage(),
                    'pagina_actual' => $huespedes->currentPage(),
                    'ultima_pagina' => $huespedes->lastPage(),
                    'desde' => $huespedes->firstItem(),
                    'hasta' => $huespedes->lastItem()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function store(HuespedRequest $request): JsonResponse
    {
        try {
            Huesped::create($request->validated());

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

    function update(HuespedRequest $request, int $id): JsonResponse
    {
        try {
            $huesped = Huesped::find($id);
            if (!$huesped) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $huesped->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Actualizado,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function buscarHuespedPorDni(Request $request): JsonResponse
    {
        try {
            $huesped = Huesped::where('dni', $request->dni)
                ->first();

            return response()->json([
                'status' => HTTPStatus::Success,
                'huesped'   => $huesped
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
