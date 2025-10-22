<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\StoreLimpiezaRequest;
use App\Http\Requests\UpdateLimpiezaRequest;
use App\Models\Limpieza;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LimpiezaController extends Controller
{
    public function buscarPorFecha(Request $request)
    {
        try {
            $fechaInicio = $request->input('p_fecha_inicio');
            $fechaFin = $request->input('p_fecha_fin');
            $anio = $request->input('p_anio');
            $perPage = intval($request->input('per_page', 20));
            $page = intval($request->input('page', 1));

            // Construcción de la query base
            $query = Limpieza::with(['departamento', 'usuario']);

            // Aplicar filtros según los parámetros
            if ($fechaInicio && $fechaFin) {
                $query->whereBetween('fecha_limpieza', [$fechaInicio, $fechaFin]);
            } elseif ($anio) {
                $query->whereYear('fecha_limpieza', $anio);
            }

            // Paginar los resultados
            $limpiezas = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => HTTPStatus::Success,
                'limpiezas' => $limpiezas->items(),
                'paginacion' => [
                    'total'         => $limpiezas->total(),
                    'por_pagina'    => $limpiezas->perPage(),
                    'pagina_actual' => $limpiezas->currentPage(),
                    'ultima_pagina' => $limpiezas->lastPage(),
                    'desde'         => $limpiezas->firstItem(),
                    'hasta'         => $limpiezas->lastItem()
                ]
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    // Almacenar una nueva limpieza
    public function store(StoreLimpiezaRequest $request)
    {
        $data = $request->validated();

        // Asignar la fecha actual si no se envió
        $data['fecha_limpieza'] = now();

        // Asignar el ID del usuario autenticado
        $data['usuario_registra'] = Auth::id();

        Limpieza::create($data);

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg'    => HTTPStatus::Creacion
        ], 201);
    }

    // Actualizar una limpieza existente (solo personal_limpieza)
    public function update(UpdateLimpiezaRequest $request, $id)
    {
        $limpieza = Limpieza::findOrFail($id);

        // Solo actualiza el campo personal_limpieza
        $limpieza->update($request->validated());

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg'    => HTTPStatus::Actualizado
        ], 200);
    }
};
