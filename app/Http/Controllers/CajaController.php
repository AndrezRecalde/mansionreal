<?php

namespace App\Http\Controllers;

use App\Models\Caja;
use Illuminate\Http\Request;
use App\Enums\HTTPStatus;
use Illuminate\Http\JsonResponse;

class CajaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $cajas = Caja::withCount(['turnos' => function ($query) {
            $query->where('estado', 'ABIERTO');
        }])->get();

        return response()->json([
            'status' => HTTPStatus::Success,
            'cajas' => $cajas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:100|unique:cajas,nombre',
            'descripcion' => 'nullable|string|max:255',
            'activa' => 'boolean'
        ]);

        $caja = Caja::create($request->all());

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg' => 'Caja creada correctamente',
            'caja' => $caja
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:100|unique:cajas,nombre,' . $id,
            'descripcion' => 'nullable|string|max:255',
            'activa' => 'boolean'
        ]);

        $caja = Caja::findOrFail($id);
        $caja->update($request->all());

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg' => 'Caja actualizada correctamente',
            'caja' => $caja
        ]);
    }

    /**
     * Activar/Desactivar caja
     */
    public function toggleEstado($id): JsonResponse
    {
        $caja = Caja::findOrFail($id);
        $caja->activa = !$caja->activa;
        $caja->save();

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg' => $caja->activa ? 'Caja activada' : 'Caja desactivada',
            'caja' => $caja
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $caja = Caja::findOrFail($id);

        if ($caja->turnos()->count() > 0) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'No se puede eliminar la caja porque ya tiene turnos asociados. Desactívela en su lugar.'
            ], 400);
        }

        $caja->delete();

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg' => 'Caja eliminada correctamente'
        ]);
    }
}
