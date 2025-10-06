<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Models\ConceptoPago;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConceptoPagoController extends Controller
{
    function getConceptosPagos(Request $request): JsonResponse
    {
        try {
            $conceptos_pagos = ConceptoPago::where('activo', $request->activo)->get();
            return response()->json([
                'status' => HTTPStatus::Success,
                'conceptos_pagos' => $conceptos_pagos
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
