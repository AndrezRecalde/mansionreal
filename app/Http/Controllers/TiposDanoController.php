<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Models\TiposDano;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TiposDanoController extends Controller
{
    function getTiposDano(Request $request): JsonResponse
    {
        try {
            $tiposDano = TiposDano::where('activo', $request->activo)->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'tiposDano'   => $tiposDano
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
