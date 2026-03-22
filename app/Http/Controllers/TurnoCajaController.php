<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TurnoCaja;
use App\Models\Caja;
use App\Models\MovimientoCaja;
use App\Models\Pago;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Enums\HTTPStatus;
use Illuminate\Http\JsonResponse;

class TurnoCajaController extends Controller
{
    /**
     * Devuelve el turno activo del usuario autenticado (si lo hay) y lista de cajas
     */
    public function miTurno(): JsonResponse
    {
        $turnoAbierto = TurnoCaja::where('usuario_id', Auth::id())
            ->where('estado', 'ABIERTO')
            ->with('caja')
            ->first();

        $cajasDisponibles = Caja::where('activa', true)->get();

        return response()->json([
            'status' => HTTPStatus::Success,
            'turno' => $turnoAbierto,
            'cajas' => $cajasDisponibles
        ]);
    }

    /**
     * Abre un nuevo turno de caja
     */
    public function abrir(Request $request): JsonResponse
    {
        $request->validate([
            'caja_id' => 'required|exists:cajas,id',
            'monto_apertura_efectivo' => 'required|numeric|min:0',
        ]);

        $turnoAbierto = TurnoCaja::where('usuario_id', Auth::id())
            ->where('estado', 'ABIERTO')
            ->first();

        if ($turnoAbierto) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Ya tienes un turno de caja abierto en: ' . $turnoAbierto->caja->nombre
            ], 400);
        }

        $turno = TurnoCaja::create([
            'caja_id' => $request->caja_id,
            'usuario_id' => Auth::id(),
            'fecha_apertura' => now(),
            'monto_apertura_efectivo' => $request->monto_apertura_efectivo,
            'estado' => 'ABIERTO'
        ]);

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg' => 'Turno abierto exitosamente.',
            'turno' => $turno->load('caja')
        ], 201);
    }

    /**
     * Registra un movimiento manual (ingreso/egreso)
     */
    public function crearMovimiento(Request $request): JsonResponse
    {
        $request->validate([
            'tipo' => 'required|in:INGRESO,EGRESO',
            'monto' => 'required|numeric|min:0.01',
            'concepto' => 'required|string|max:255',
        ]);

        $turnoAbierto = TurnoCaja::where('usuario_id', Auth::id())
            ->where('estado', 'ABIERTO')
            ->first();

        if (!$turnoAbierto) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'No tienes un turno de caja abierto para asentar movimientos.'
            ], 400);
        }

        $movimiento = MovimientoCaja::create([
            'turno_caja_id' => $turnoAbierto->id,
            'tipo' => $request->tipo,
            'monto' => $request->monto,
            'concepto' => $request->concepto,
            'usuario_id' => Auth::id(),
        ]);

        return response()->json([
            'status' => HTTPStatus::Success,
            'msg' => 'Movimiento registrado correctamente.',
            'movimiento' => $movimiento
        ], 201);
    }

    /**
     * Prepara el reporte X/Z con los montos actuales del sistema para el cierre
     */
    public function reporteCierre(): JsonResponse
    {
        $turno = TurnoCaja::where('usuario_id', Auth::id())
            ->where('estado', 'ABIERTO')
            ->first();

        if (!$turno) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => 'No hay turno abierto.'], 400);
        }

        $pagosEfectivo = Pago::where('turno_caja_id', $turno->id)->where('metodo_pago', 'EFECTIVO')->sum('monto');
        $pagosOtros = Pago::where('turno_caja_id', $turno->id)->where('metodo_pago', '!=', 'EFECTIVO')->sum('monto');
        
        $ingresosExtra = MovimientoCaja::where('turno_caja_id', $turno->id)->where('tipo', 'INGRESO')->sum('monto');
        $egresosExtra = MovimientoCaja::where('turno_caja_id', $turno->id)->where('tipo', 'EGRESO')->sum('monto');

        $efectivoEsperado = $turno->monto_apertura_efectivo + $pagosEfectivo + $ingresosExtra - $egresosExtra;

        // Recuperar también el detalle de movimientos para la UI
        $movimientos = MovimientoCaja::where('turno_caja_id', $turno->id)->orderBy('id','desc')->get();

        return response()->json([
            'status' => HTTPStatus::Success,
            'reporte' => [
                'monto_apertura' => (float)$turno->monto_apertura_efectivo,
                'ventas_efectivo' => (float)$pagosEfectivo,
                'ventas_otros' => (float)$pagosOtros,
                'ingresos_extra' => (float)$ingresosExtra,
                'egresos_extra' => (float)$egresosExtra,
                'efectivo_esperado_caja' => (float)round($efectivoEsperado, 2)
            ],
            'movimientos' => $movimientos
        ]);
    }

    /**
     * Cierra el turno de caja permanentemente
     */
    public function cerrar(Request $request): JsonResponse
    {
        $request->validate([
            'monto_cierre_efectivo_declarado' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $turno = TurnoCaja::where('usuario_id', Auth::id())
                ->where('estado', 'ABIERTO')
                ->lockForUpdate()
                ->first();

            if (!$turno) {
                throw new \Exception('No tienes un turno de caja abierto para cerrar.');
            }

            $pagosEfectivo = Pago::where('turno_caja_id', $turno->id)->where('metodo_pago', 'EFECTIVO')->sum('monto');
            $ingresosExtra = MovimientoCaja::where('turno_caja_id', $turno->id)->where('tipo', 'INGRESO')->sum('monto');
            $egresosExtra = MovimientoCaja::where('turno_caja_id', $turno->id)->where('tipo', 'EGRESO')->sum('monto');

            $efectivoEsperado = $turno->monto_apertura_efectivo + $pagosEfectivo + $ingresosExtra - $egresosExtra;

            $montoDeclarado = $request->monto_cierre_efectivo_declarado;
            $diferencia = $montoDeclarado - $efectivoEsperado;

            $turno->update([
                'fecha_cierre' => now(),
                'monto_cierre_efectivo_declarado' => $montoDeclarado,
                'monto_ventas_sistema' => $efectivoEsperado, 
                'diferencia' => round($diferencia, 2),
                'estado' => 'CERRADO'
            ]);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Caja Cerrada Exitosamente.',
                'turno' => $turno
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reporte global de Cajas cerradas (Para Gerencia)
     */
    public function historial(Request $request): JsonResponse
    {
        $query = TurnoCaja::with(['caja', 'usuario'])
            ->where('estado', 'CERRADO');

        if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
            $query->whereBetween('fecha_apertura', [$request->fecha_inicio . ' 00:00:00', $request->fecha_fin . ' 23:59:59']);
        } elseif ($request->has('anio')) {
            $query->whereYear('fecha_apertura', $request->anio);
        }

        if ($request->has('usuario_id') && $request->usuario_id) {
            $query->where('usuario_id', $request->usuario_id);
        }

        $turnos = $query->orderBy('fecha_cierre', 'desc')->get();

        return response()->json([
            'status' => HTTPStatus::Success,
            'turnos' => $turnos
        ]);
    }
}
