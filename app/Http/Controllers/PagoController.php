<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\PagoRequest;
use App\Http\Requests\PagoUpdateRequest;
use App\Models\Pago;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PagoController extends Controller
{

    function getPagos(Request $request): JsonResponse
    {
        try {
            $pagos = Pago::with('conceptoPago')
                ->where('reserva_id', $request->reserva_id)
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'pagos'   => $pagos
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function getHistorialPagos(Request $request): JsonResponse
    {
        try {
            $pagos = Pago::with(['conceptoPago', 'reserva'])
                ->buscarPorCodigoVoucher($request->codigo_voucher)
                ->buscarPorFechas($request->fecha_inicio, $request->fecha_fin)
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'pagos'   => $pagos
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    public function store(PagoRequest $request): JsonResponse
    {
        $reserva = Reserva::findOrFail($request->reserva_id);

        $pagosCreados = [];

        foreach ($request->pagos as $pagoData) {
            $pagosCreados[] = $reserva->pagos()->create([
                'codigo_voucher'   => $pagoData['codigo_voucher'],
                'concepto_pago_id' => $pagoData['concepto_pago_id'],
                'monto'            => $pagoData['monto'],
                'metodo_pago'      => $pagoData['metodo_pago'],
                'fecha_pago'       => now(),
                'observaciones'    => $pagoData['observaciones'] ?? null,
                'usuario_creador_id' => Auth::id(),
            ]);
        }

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg'    => HTTPStatus::Creacion
        ], 201);
    }

    public function update(PagoUpdateRequest $request, int $id): JsonResponse
    {
        try {
            $pago = Pago::findOrFail($id);

            $pago->update([
                'codigo_voucher'   => $request->codigo_voucher,
                'concepto_pago_id' => $request->concepto_pago_id,
                'monto'            => $request->monto,
                'metodo_pago'      => $request->metodo_pago,
                'observaciones'    => $request->observaciones,
                'usuario_modificador_id' => Auth::id(),
            ]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Actualizado
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function delete(Request $request, int $id): JsonResponse
    {
        try {
            $pago = Pago::fing($id);

            if (!$pago) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $user = User::where('dni', $request->dni)->where('activo', 1)->first();

            // Validar existencia y rol GERENTE
            if (!$user || !$user->hasRole('GERENTE')) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'El DNI no corresponde a un usuario con rol GERENTE o no existe.'
                ], 403);
            }

            $pago->delete();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Eliminado,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
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
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
