<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Models\TipoReserva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TipoReservaController extends Controller
{
    function getTiposReservas(Request $request): JsonResponse
    {
        try {
            $tipos_reservas = TipoReserva::where('activo', $request->activo)->get();
            return response()->json([
                'status' => HTTPStatus::Success,
                'tipos_reservas'   => $tipos_reservas
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
