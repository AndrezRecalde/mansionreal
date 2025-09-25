<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\HuespedRequest;
use App\Models\Huesped;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HuespedController extends Controller
{
    function getHuespedes(): JsonResponse
    {
        try {
            $huespedes = Huesped::from('huespedes as h')
                ->select(
                    'h.id',
                    'h.apellidos',
                    'h.nombres',
                    'h.dni',
                    'h.telefono',
                    'h.email',
                    'h.direccion',
                    'h.provincia_id',
                    'p.nombre_provincia as provincia'
                )
                ->leftJoin('provincias as p', 'h.provincia_id', '=', 'p.id')
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'huespedes'   => $huespedes
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
