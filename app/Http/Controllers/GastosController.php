<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\GastoRequest;
use App\Models\Gasto;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GastosController extends Controller
{
    function getGastos(Request $request): JsonResponse
    {
        // Obtener gastos con filtros opcionales de fecha, reserva_id y codigo_reserva
        try {
            $gastos = Gasto::from('gastos as g')
                ->join('reservas as r', 'g.reserva_id', '=', 'r.id')
                ->join('tipos_danos as td', 'g.tipo_dano_id', '=', 'td.id', 'left')
                ->select('g.*', 'r.codigo_reserva', 'td.nombre_tipo_dano as tipo_dano')
                ->when($request->filled('fecha_inicio') && $request->filled('fecha_fin'), function ($query) use ($request) {
                    $query->whereBetween('g.fecha_creacion', [$request->fecha_inicio, $request->fecha_fin]);
                })
                ->when($request->filled('reserva_id'), function ($query) use ($request) {
                    $query->where('g.reserva_id', $request->reserva_id);
                })
                ->when($request->filled('codigo_reserva'), function ($query) use ($request) {
                    $query->where('r.codigo_reserva', 'like', '%' . $request->codigo_reserva . '%');
                })
                ->orderBy('g.fecha_creacion', 'desc')
                ->get();

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

    function delete(Request $request, int $id): JsonResponse
    {
        try {
            $gasto = Gasto::find($id);

            if (!$gasto) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $user = User::where('dni', $request->dni)->where('activo', 1)->first();

            // Validar existencia y rol GERENTE
            if (!$user || !$user->hasRole('GERENTE')) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'El DNI no corresponde a un usuario con rol GERENTE o no existe.'
                ], 403);
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
