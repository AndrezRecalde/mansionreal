<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\GastoRequest;
use App\Models\Gasto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GastosController extends Controller
{
    function getGastos(Request $request): JsonResponse
    {
        // Obtener gastos con filtros opcionales de fecha, reserva_id y codigo_reserva
        try {
            $query = Gasto::with(['reserva', 'tipoDano']);

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->whereBetween('fecha_creacion', [$request->fecha_inicio, $request->fecha_fin]);
            }

            if ($request->has('reserva_id')) {
                $query->where('reserva_id', $request->reserva_id);
            }

            if ($request->has('codigo_reserva')) {
                $codigoReserva = $request->codigo_reserva;
                $query->whereHas('reserva', function ($q) use ($codigoReserva) {
                    $q->where('codigo_reserva', $codigoReserva);
                });
            }

            $gastos = $query->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'gastos'   => $gastos
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function store(GastoRequest $request): JsonResponse
    {
        try {
            $gasto = new Gasto;
            $gasto->fill($request->validated());
            $gasto->fecha_creacion = now();
            $gasto->save();

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

    function update(GastoRequest $request, int $id): JsonResponse
    {
        try {
            $gasto = Gasto::find($id);
            if (!$gasto) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $gasto->update($request->validated());

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

    function delete(int $id): JsonResponse
    {
        try {
            $gasto = Gasto::find($id);
            if (!$gasto) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $gasto->delete();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Eliminado,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
