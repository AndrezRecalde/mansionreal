<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Models\Provincia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProvinciaController extends Controller
{
    function getProvincias(): JsonResponse
    {
        try {
            $provincias = Provincia::where('activo', 1)->get();

            return response()->json([
                'status'       => HTTPStatus::Success,
                'provincias'   => $provincias
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
