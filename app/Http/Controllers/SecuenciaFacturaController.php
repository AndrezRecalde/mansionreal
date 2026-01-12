<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\SecuenciaFacturaRequest;
use App\Services\Facturacion\SecuenciaFacturaService;
use App\Services\Facturacion\Exceptions\FacturacionException;
use App\Models\SecuenciaFactura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecuenciaFacturaController extends Controller
{
    protected SecuenciaFacturaService $secuenciaService;

    public function __construct(SecuenciaFacturaService $secuenciaService)
    {
        $this->secuenciaService = $secuenciaService;
    }

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
     * Obtener secuencia activa (USANDO SERVICIO)
     */
    public function getActiva(): JsonResponse
    {
        try {
            $secuencia = $this->secuenciaService->obtenerSecuenciaActiva();

            $disponibilidad = $this->secuenciaService->verificarDisponibilidad($secuencia->id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'secuencia' => $secuencia,
                'siguiente_numero' => $disponibilidad['siguiente_numero'],
                'numeros_disponibles' => $disponibilidad['numeros_disponibles'],
                'puede_generar' => $disponibilidad['puede_generar'],
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar disponibilidad de números (USANDO SERVICIO)
     */
    public function verificarDisponibilidad(int $id): JsonResponse
    {
        try {
            $disponibilidad = $this->secuenciaService->verificarDisponibilidad($id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'puede_generar' => $disponibilidad['puede_generar'],
                'numeros_disponibles' => $disponibilidad['numeros_disponibles'],
                'siguiente_numero' => $disponibilidad['siguiente_numero'],
                'secuencial_actual' => $disponibilidad['secuencial_actual'],
                'secuencial_fin' => $disponibilidad['secuencial_fin'],
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nueva secuencia (USANDO SERVICIO)
     */
    public function store(SecuenciaFacturaRequest $request): JsonResponse
    {
        try {
            $secuencia = $this->secuenciaService->crearSecuencia($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Secuencia de facturas creada correctamente',
                'secuencia' => $secuencia,
            ], 201);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 409);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar secuencia (USANDO SERVICIO)
     */
    public function update(SecuenciaFacturaRequest $request, int $id): JsonResponse
    {
        try {
            $secuencia = $this->secuenciaService->actualizarSecuencia($id, $request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Secuencia actualizada correctamente',
                'secuencia' => $secuencia,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Activar/Desactivar secuencia (USANDO SERVICIO)
     */
    public function toggleEstado(int $id): JsonResponse
    {
        try {
            $secuencia = $this->secuenciaService->toggleEstado($id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => $secuencia->activo ? 'Secuencia activada correctamente' : 'Secuencia desactivada correctamente',
                'secuencia' => $secuencia,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Reiniciar secuencia (SOLO PARA DESARROLLO/TESTING)
     */
    public function reiniciar(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'confirmacion' => 'required|string|in: REINICIAR_SECUENCIA'
        ]);

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

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Secuencia reiniciada correctamente',
                'secuencia' => $secuencia->fresh(),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
