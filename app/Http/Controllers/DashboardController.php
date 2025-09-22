<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{
    /**
     * KPIs que NO requieren filtro de fechas/año
     */

    // Huéspedes y ganancias por mes (requiere año)
    public function huespedesYGananciasPorMes(Request $request)
    {
        try {
            $anio = $request->anio;
            $result = DB::select('CALL kpi_huespedes_y_ganancias_por_mes(?)', [$anio]);
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

    /**
     * KPIs que SÍ requieren filtro de fechas/año
     * Puedes enviar: fecha_inicio, fecha_fin, anio, limite (opcional)
     */

    /* KPI DE CABECERA */
    public function kpiResumen(Request $request)
    {
        try {
            $fecha_inicio = $request->p_fecha_inicio;
            $fecha_fin = $request->p_fecha_fin;
            $anio = $request->p_anio;
            $result = DB::select('CALL sp_kpi_resumen(?, ?, ?)', [
                $fecha_inicio,
                $fecha_fin,
                $anio
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
    // Huéspedes recurrentes
    public function huespedesRecurrentes(Request $request)
    {
        try {
            $fecha_inicio = $request->fecha_inicio;
            $fecha_fin = $request->fecha_fin;
            $anio = $request->anio;
            $limite = $request->limite ?? 5;
            $result = DB::select('CALL kpi_huespedes_mas_recurrentes(?, ?, ?, ?)', [
                $fecha_inicio,
                $fecha_fin,
                $anio,
                $limite
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

    // Productos más consumidos
    public function productosMasConsumidos(Request $request)
    {
        try {
            $fecha_inicio = $request->fecha_inicio;
            $fecha_fin = $request->fecha_fin;
            $anio = $request->anio;
            $limite = $request->limite ?? 10;
            $result = DB::select('CALL kpi_productos_mas_consumidos(?, ?, ?, ?)', [
                $fecha_inicio,
                $fecha_fin,
                $anio,
                $limite
            ]);
            return response()->json(
                [
                    'status' => HTTPStatus::Success,
                    'result' => $result
                ],
                200
            );
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    // Ingresos por tipo de departamento
    public function ingresosPorTipoDepartamento(Request $request)
    {
        try {
            $fecha_inicio = $request->fecha_inicio;
            $fecha_fin = $request->fecha_fin;
            $anio = $request->anio;
            $result = DB::select('CALL kpi_ingresos_por_tipo_departamento(?, ?, ?)', [
                $fecha_inicio,
                $fecha_fin,
                $anio
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
