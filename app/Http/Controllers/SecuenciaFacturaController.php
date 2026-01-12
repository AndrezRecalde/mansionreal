<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\SecuenciaFacturaRequest;
use App\Models\SecuenciaFactura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SecuenciaFacturaController extends Controller
{
    /**
     * Listar todas las secuencias de facturas
     */
    public function index(): JsonResponse
    {
        try {
            $secuencias = SecuenciaFactura::orderBy('activo', 'desc')
                ->orderBy('establecimiento')
                ->orderBy('punto_emision')
                ->get()
                ->map(function ($secuencia) {
                    return [
                        'id' => $secuencia->id,
                        'establecimiento' => $secuencia->establecimiento,
                        'punto_emision' => $secuencia->punto_emision,
                        'punto_completo' => "{$secuencia->establecimiento}-{$secuencia->punto_emision}",
                        'secuencial_actual' => $secuencia->secuencial_actual,
                        'secuencial_inicio' => $secuencia->secuencial_inicio,
                        'secuencial_fin' => $secuencia->secuencial_fin,
                        'activo' => $secuencia->activo,
                        'descripcion' => $secuencia->descripcion,
                        'longitud_secuencial' => $secuencia->longitud_secuencial,
                        'siguiente_numero' => $secuencia->siguienteNumero(),
                        'numeros_disponibles' => $secuencia->numerosDisponibles(),
                        'puede_generar' => $secuencia->puedeGenerarMas(),
                        'created_at' => $secuencia->created_at,
                        'updated_at' => $secuencia->updated_at,
                    ];
                });

            return response()->json([
                'status' => HTTPStatus::Success,
                'secuencias' => $secuencias,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener secuencia específica
     */
    public function show(int $id): JsonResponse
    {
        try {
            $secuencia = SecuenciaFactura::findOrFail($id);

            $data = [
                'secuencia' => $secuencia,
                'siguiente_numero' => $secuencia->siguienteNumero(),
                'numeros_disponibles' => $secuencia->numerosDisponibles(),
                'puede_generar' => $secuencia->puedeGenerarMas(),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'data' => $data,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener secuencia activa por defecto
     */
    public function getActiva(): JsonResponse
    {
        try {
            $secuencia = SecuenciaFactura::obtenerDefault();

            if (! $secuencia) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No hay secuencia activa configurada'
                ], 404);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'secuencia' => $secuencia,
                'siguiente_numero' => $secuencia->siguienteNumero(),
                'numeros_disponibles' => $secuencia->numerosDisponibles(),
                'puede_generar' => $secuencia->puedeGenerarMas(),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nueva secuencia
     */
    public function store(SecuenciaFacturaRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            // Verificar que no exista la combinación establecimiento-punto_emision
            $existe = SecuenciaFactura::where('establecimiento', $validated['establecimiento'])
                ->where('punto_emision', $validated['punto_emision'])
                ->exists();

            if ($existe) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Ya existe una secuencia con ese establecimiento y punto de emisión'
                ], 409);
            }

            // Validar que secuencial_fin sea mayor que secuencial_inicio
            if ($validated['secuencial_fin'] && $validated['secuencial_fin'] < $validated['secuencial_inicio']) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'El secuencial final debe ser mayor al secuencial inicial'
                ], 400);
            }

            $secuencia = SecuenciaFactura::create([
                'establecimiento' => $validated['establecimiento'],
                'punto_emision' => $validated['punto_emision'],
                'secuencial_actual' => 0, // Siempre inicia en 0
                'secuencial_inicio' => $validated['secuencial_inicio'],
                'secuencial_fin' => $validated['secuencial_fin'] ?? null,
                'longitud_secuencial' => $validated['longitud_secuencial'] ?? 9,
                'activo' => $validated['activo'] ?? true,
                'descripcion' => $validated['descripcion'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Secuencia de facturas creada correctamente',
                'secuencia' => $secuencia,
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar secuencia
     */
    public function update(SecuenciaFacturaRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $secuencia = SecuenciaFactura::findOrFail($id);
            $validated = $request->validated();

            // Solo permitir actualizar descripción y límite final (no el secuencial actual)
            $secuencia->update([
                'descripcion' => $validated['descripcion'] ?? $secuencia->descripcion,
                'secuencial_fin' => $validated['secuencial_fin'] ??  $secuencia->secuencial_fin,
            ]);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Secuencia actualizada correctamente',
                'secuencia' => $secuencia->fresh(),
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Activar/Desactivar secuencia
     */
    public function toggleEstado(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $secuencia = SecuenciaFactura::findOrFail($id);

            $nuevoEstado = ! $secuencia->activo;
            $secuencia->activo = $nuevoEstado;
            $secuencia->save();

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => $nuevoEstado ? 'Secuencia activada correctamente' : 'Secuencia desactivada correctamente',
                'secuencia' => $secuencia,
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Reiniciar secuencia (solo para testing/desarrollo - con confirmación)
     */
    public function reiniciar(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'confirmacion' => 'required|string|in: REINICIAR_SECUENCIA'
        ]);

        DB::beginTransaction();
        try {
            $secuencia = SecuenciaFactura::findOrFail($id);

            // Validar que no esté activa (medida de seguridad)
            if ($secuencia->activo) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se puede reiniciar una secuencia activa.  Desactívela primero.'
                ], 400);
            }

            $secuencia->reiniciar();

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Secuencia reiniciada correctamente',
                'secuencia' => $secuencia->fresh(),
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
