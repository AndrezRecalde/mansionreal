<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\ServicioRequest;
use App\Models\Servicio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiciosController extends Controller
{

    function getServicios(): JsonResponse
    {
        try {
            $servicios = Servicio::orderBy('nombre_servicio', 'ASC')->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'servicios'   => $servicios
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function getServiciosAgrupados(): JsonResponse
    {
        try {
            $servicios = Servicio::all()
                ->groupBy('nombre_servicio')
                ->map(function ($group) {
                    return $group->map(function ($servicio) {
                        return [
                            'id' => $servicio->id,
                            'tipo_servicio' => $servicio->tipo_servicio,
                        ];
                    });
                });

            return response()->json([
                'status' => HTTPStatus::Success,
                'servicios'   => $servicios
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function store(ServicioRequest $request): JsonResponse
    {
        try {
            $servicio = Servicio::create($request->validated());

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

    function update(ServicioRequest $request, int $id): JsonResponse
    {
        try {
            $servicio = Servicio::find($id);
            if (!$servicio) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $servicio->update($request->validated());

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
