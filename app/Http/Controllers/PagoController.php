<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\PagoRequest;
use App\Http\Requests\PagoUpdateRequest;
use App\Models\Consumo;
use App\Models\Pago;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PagoController extends Controller
{
    // ====================================================================
    // VENTAS DE MOSTRADOR (SIN RESERVA)
    // ====================================================================

    /**
     * Registrar un pago para una venta de mostrador (sin reserva).
     * El campo consumo_ids[] es requerido para asociar el pago
     * a los consumos externos correspondientes.
     */
    public function storeExterno(Request $request): JsonResponse
    {
        $request->validate([
            'codigo_voucher' => 'nullable|string|max:100',
            'concepto_pago_id' => 'required|integer|exists:conceptos_pagos,id',
            'monto' => 'required|numeric|min:0.01',
            'metodo_pago' => 'required|in:EFECTIVO,TRANSFERENCIA,TARJETA,OTRO',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $turnoAbierto = \App\Models\TurnoCaja::where('usuario_id', Auth::id())
                ->where('estado', 'ABIERTO')
                ->first();

            $pago = Pago::create([
                'reserva_id' => null, // ← Venta de mostrador
                'turno_caja_id' => $turnoAbierto ? $turnoAbierto->id : null,
                'codigo_voucher' => $request->codigo_voucher,
                'concepto_pago_id' => $request->concepto_pago_id,
                'monto' => $request->monto,
                'metodo_pago' => $request->metodo_pago,
                'fecha_pago' => now(),
                'observaciones' => $request->observaciones,
                'usuario_creador_id' => Auth::id(),
            ]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Creacion,
                'pago' => $pago->load('conceptoPago'),
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar pagos de ventas de mostrador (reserva_id IS NULL).
     */
    public function getPagosExternos(Request $request): JsonResponse
    {
        try {
            $query = Pago::with('conceptoPago')
                ->whereNull('reserva_id');

            if ($request->fecha_inicio && $request->fecha_fin) {
                $query->buscarPorFechas($request->fecha_inicio, $request->fecha_fin);
            }

            $pagos = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'pagos' => $pagos,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Calcular los totales (subtotal, IVA, total, descuentos)
     * para un conjunto de consumos externos dados por sus IDs.
     */
    public function getTotalesExterno(Request $request): JsonResponse
    {
        $request->validate([
            'consumo_ids' => 'required|array|min:1',
            'consumo_ids.*' => 'integer|exists:consumos,id',
        ]);

        try {
            $consumos = Consumo::whereIn('id', $request->consumo_ids)
                ->whereNull('reserva_id')
                ->get();

            $result = [
                'subtotal' => (float) round($consumos->sum('subtotal'), 2),
                'total_descuentos' => (float) round($consumos->sum('descuento'), 2),
                'total_iva' => (float) round($consumos->sum('iva'), 2),
                'total' => (float) round($consumos->sum('total'), 2),
                'cantidad_items' => $consumos->count(),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'totales' => $result,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    // ====================================================================
    // EXISTENTES (con reserva)
    // ====================================================================


    function getPagos(Request $request): JsonResponse
    {
        try {
            $pagos = Pago::with('conceptoPago')
                ->where('reserva_id', $request->reserva_id)
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'pagos' => $pagos
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function getHistorialPagos(Request $request): JsonResponse
    {
        try {
            $codigoReserva = $request->codigo_reserva;
            $fechaInicio = $request->fecha_inicio;
            $fechaFin = $request->fecha_fin;
            $anio = $request->anio;

            $pagos = Pago::with(['conceptoPago', 'reserva'])
                ->buscarPorCodigoVoucher($request->codigo_voucher)
                ->buscarPorFechas($fechaInicio, $fechaFin)
                ->porAnio($anio)
                ->when($codigoReserva, function ($query) use ($codigoReserva) {
                    $query->whereHas('reserva', function ($q) use ($codigoReserva) {
                        $q->where('codigo_reserva', 'like', '%' . $codigoReserva . '%');
                    });
                })
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'pagos' => $pagos
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    public function store(PagoRequest $request): JsonResponse
    {
        $reserva = Reserva::findOrFail($request->reserva_id);

        $pagosCreados = [];

        $turnoAbierto = \App\Models\TurnoCaja::where('usuario_id', Auth::id())
            ->where('estado', 'ABIERTO')
            ->first();

        foreach ($request->pagos as $pagoData) {
            $pagosCreados[] = $reserva->pagos()->create([
                'turno_caja_id' => $turnoAbierto ? $turnoAbierto->id : null,
                'codigo_voucher' => $pagoData['codigo_voucher'] ?? null,
                'concepto_pago_id' => $pagoData['concepto_pago_id'],
                'monto' => $pagoData['monto'],
                'metodo_pago' => $pagoData['metodo_pago'],
                'fecha_pago' => now(),
                'observaciones' => $pagoData['observaciones'] ?? null,
                'usuario_creador_id' => Auth::id(),
            ]);
        }

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg' => HTTPStatus::Creacion
        ], 201);
    }

    public function update(PagoUpdateRequest $request, int $id): JsonResponse
    {
        try {
            $pago = Pago::findOrFail($id);

            $pago->update([
                'codigo_voucher' => $request->codigo_voucher ?? null,
                'concepto_pago_id' => $request->concepto_pago_id,
                'monto' => $request->monto,
                'metodo_pago' => $request->metodo_pago,
                'observaciones' => $request->observaciones ?? null,
                'usuario_modificador_id' => Auth::id(),
            ]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Actualizado
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function delete(Request $request, int $id): JsonResponse
    {
        try {
            $pago = Pago::find($id);

            if (!$pago) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => HTTPStatus::NotFound
                ], 404);
            }

            $user = User::where('dni', $request->dni)->where('activo', 1)->first();

            // Validar existencia y rol ADMINISTRADOR
            if (!$user || !$user->hasRole('ADMINISTRADOR')) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'El DNI no corresponde a un usuario con rol ADMINISTRADOR del Hotel o no existe.'
                ], 403);
            }

            $pago->delete();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Eliminado,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function getTotalesPorReserva(Request $request): JsonResponse
    {
        try {
            $p_reserva_id = $request->reserva_id;
            $result = DB::select('CALL sp_GetTotalesPorReserva(?)', [
                $p_reserva_id
            ]);
            return response()->json([
                'status' => HTTPStatus::Success,
                'result' => $result
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
