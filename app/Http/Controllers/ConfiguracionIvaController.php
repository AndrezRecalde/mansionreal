<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\ConfiguracionIvaRequest;
use App\Http\Requests\StatusRequest;
use App\Models\ConfiguracionIva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfiguracionIvaController extends Controller
{
    function getConfiguracionesIva(Request $request): JsonResponse
    {
        try {
            $configuracionesIva = ConfiguracionIva::buscarActivos($request->activo)->get();

            return response()->json([
                'status'             => HTTPStatus::Success,
                'configuracionesIva' => $configuracionesIva
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function store(ConfiguracionIvaRequest $request): JsonResponse
    {
        try {
            $configuracionIva = ConfiguracionIva::create($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'data'   => $configuracionIva
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function update(ConfiguracionIvaRequest $request, int $id): JsonResponse
    {
        try {
            $configuracionIva = ConfiguracionIva::find($id);
            if (!$configuracionIva) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $configuracionIva->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'data'   => $configuracionIva
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    //Metodo para activar una configuracion de iva y desactivar las demas
    function updateStatus(StatusRequest $request): JsonResponse
    {
        try {
            $configuracionIva = ConfiguracionIva::find($request->id);
            if (!$configuracionIva) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            //Desactivar todas las configuraciones de iva
            ConfiguracionIva::where('activo', true)->update(['activo' => false]);

            //Activar la configuracion de iva seleccionada
            $configuracionIva->update(['activo' => true]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Actualizado
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
