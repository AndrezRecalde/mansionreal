<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Enums\TIPOSRESERVA;
use App\Http\Requests\EstadiaRequest;
use App\Models\ConfiguracionIva;
use App\Models\Consumo;
use App\Models\Estado;
use App\Models\Huesped;
use App\Models\Inventario;
use App\Models\Reserva;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;


class EstadiaController extends Controller
{
    public function getEstadias(Request $request): JsonResponse
    {
        try {
            // 1. Determinar fecha de consulta (si no viene en request, usar hoy)
            $fecha = $request->fecha
                ? Carbon::parse($request->fecha)->toDateString()
                : now()->toDateString();

            // 2. Consultar reservas tipo ESTADIA en esa fecha con relaciones
            $estadias = Reserva::with(['huesped', 'estado'])
                ->where('tipo_reserva', 'ESTADIA')
                ->whereDate('fecha_checkin', $fecha)
                ->whereHas('estado', function ($query) {
                    $query->where('nombre_estado', 'RESERVADO');
                })
                ->select(
                    'id',
                    'codigo_reserva',
                    'huesped_id',
                    'estado_id',
                    'fecha_checkin',
                    'fecha_checkout',
                    'total_noches',
                    'total_adultos',
                    'total_ninos',
                    'total_mascotas'
                )
                ->get()
                ->map(function ($reserva) {
                    return [
                        'id'             => $reserva->id,
                        'codigo_reserva' => $reserva->codigo_reserva,
                        'huesped_id'     => $reserva->huesped_id,
                        'huesped'        => $reserva->huesped->nombres . " " . $reserva->huesped->apellidos,
                        'dni'            => $reserva->huesped->dni,
                        'fecha_checkin'  => $reserva->fecha_checkin,
                        'fecha_checkout' => $reserva->fecha_checkout,
                        'total_noches'   => $reserva->total_noches,
                        'total_adultos'  => $reserva->total_adultos,
                        'total_ninos'    => $reserva->total_ninos,
                        'total_mascotas' => $reserva->total_mascotas,
                        'estado'              => [
                            'id'    => $reserva ? $reserva->estado->id : null,
                            'nombre_estado' => $reserva ? $reserva->estado->nombre_estado : 'SIN ESTADO',
                            'color' => $reserva ? $reserva->estado->color : 'transparent',
                        ],
                    ];
                });

            return response()->json([
                'status'         => HTTPStatus::Success,
                'fecha_consulta' => $fecha,
                'estadias'       => $estadias,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }


    public function storeEstadia(EstadiaRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            // 1. Obtener o crear huésped
            if ($request->huesped['huesped_id'] == null) {
                $huesped = Huesped::create([
                    'nombres'       => $request->huesped['nombres'],
                    'apellidos'     => $request->huesped['apellidos'],
                    'dni'           => $request->huesped['dni'],
                    'telefono'      => $request->huesped['telefono'] ?? null,
                    'email'         => $request->huesped['email'] ?? null,
                ]);
            } else {
                $huesped = Huesped::findOrFail($request->huesped['huesped_id']);
            }

            // 2. Crear reserva tipo ESTADIA
            $reserva = new Reserva();
            $reserva->fill($request->validated());
            $reserva->huesped_id = $huesped->id;
            $reserva->departamento_id = null;
            $reserva->estado_id = Estado::where('activo', 1)
                ->where('tipo_estado', 'RESERVA')
                ->where('nombre_estado', 'RESERVADO')
                ->value('id');
            $reserva->fecha_creacion = now();
            $reserva->usuario_creador_id = Auth::id();
            $reserva->tipo_reserva = TIPOSRESERVA::ESTADIA;
            $reserva->save();

            // 3. Obtener tasa de IVA (para TODOS)
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 15.00;

            // 4. Obtener productos de estadía
            $inventarioAdulto = Inventario::where('nombre_producto', 'LIKE', '%ADULTO%')
                ->where('sin_stock', true)
                ->first();

            $inventarioNino = Inventario::where('nombre_producto', 'LIKE', '%NIÑO%')
                ->where('sin_stock', true)
                ->first();

            // ================================================================
            // SIMPLIFICADO:  Consumo de adultos (IVA siempre aplica)
            // ================================================================
            if ($reserva->total_adultos > 0 && $inventarioAdulto) {
                $subtotal = $reserva->total_adultos * $inventarioAdulto->precio_unitario;
                $iva = $subtotal * ($tasa_iva / 100);

                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioAdulto->id,
                    'cantidad'        => $reserva->total_adultos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                ]);
            }

            // ================================================================
            // SIMPLIFICADO: Consumo de niños (IVA siempre aplica)
            // ================================================================
            if ($reserva->total_ninos > 0 && $inventarioNino) {
                $subtotal = $reserva->total_ninos * $inventarioNino->precio_unitario;
                $iva = $subtotal * ($tasa_iva / 100);

                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioNino->id,
                    'cantidad'        => $reserva->total_ninos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Estadía registrada exitosamente',
                'estadia' => $reserva->load(['huesped', 'estado']),
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    public function updateEstadia(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            // 1. Validar entrada
            $validated = $request->validate([
                'total_adultos'  => 'nullable|integer|min:0',
                'total_ninos'    => 'nullable|integer|min:0',
                'total_mascotas' => 'nullable|integer|min:0',
            ]);

            // 2. Buscar reserva tipo ESTADIA
            $reserva = Reserva::where('id', $id)
                ->where('tipo_reserva', 'ESTADIA')
                ->firstOrFail();

            // 3. Actualizar campos
            $reserva->update([
                'total_adultos'  => $validated['total_adultos'] ?? $reserva->total_adultos,
                'total_ninos'    => $validated['total_ninos'] ?? $reserva->total_ninos,
                'total_mascotas' => $validated['total_mascotas'] ?? $reserva->total_mascotas,
            ]);

            // ================================================================
            // 4.  RECALCULAR CONSUMOS (SIMPLIFICADO)
            // ================================================================

            // Obtener tasa de IVA (para TODOS)
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 15.00;

            // Obtener productos de estadía
            $inventarioAdulto = Inventario::where('nombre_producto', 'LIKE', '%ADULTO%')
                ->where('sin_stock', true)
                ->first();

            $inventarioNino = Inventario::where('nombre_producto', 'LIKE', '%NIÑO%')
                ->where('sin_stock', true)
                ->first();

            // ================================================================
            // 5. ELIMINAR CONSUMOS ANTERIORES DE ADULTOS/NIÑOS
            // ================================================================
            $inventariosEstadia = array_filter([
                $inventarioAdulto?->id,
                $inventarioNino?->id
            ]);

            if (!empty($inventariosEstadia)) {
                Consumo::where('reserva_id', $reserva->id)
                    ->whereIn('inventario_id', $inventariosEstadia)
                    ->delete();
            }

            // ================================================================
            // 6. CREAR NUEVOS CONSUMOS ACTUALIZADOS (SIMPLIFICADO)
            // ================================================================

            // Consumo de adultos
            if ($reserva->total_adultos > 0 && $inventarioAdulto) {
                $subtotal = $reserva->total_adultos * $inventarioAdulto->precio_unitario;
                $iva = $subtotal * ($tasa_iva / 100);

                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioAdulto->id,
                    'cantidad'        => $reserva->total_adultos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                ]);
            }

            // Consumo de niños
            if ($reserva->total_ninos > 0 && $inventarioNino) {
                $subtotal = $reserva->total_ninos * $inventarioNino->precio_unitario;
                $iva = $subtotal * ($tasa_iva / 100);

                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioNino->id,
                    'cantidad'        => $reserva->total_ninos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Estadía actualizada correctamente',
                'estadia' => $reserva->fresh(['huesped', 'estado']),
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function reporteEstadiasPorFechas(Request $request): JsonResponse
    {
        try {
            $fecha_inicio = $request->p_fecha_inicio;
            $fecha_fin = $request->p_fecha_fin;
            $anio = $request->p_anio;
            $result = DB::select('CALL reporte_estadias_por_fechas(?, ?, ?)', [
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

    public function exportConsumosEstadiasPDF(Request $request)
    {
        $fecha_inicio = $request->p_fecha_inicio;
        $fecha_fin    = $request->p_fecha_fin;
        $anio         = $request->p_anio;

        $query = DB::table('consumos as c')
            ->join('reservas as r', 'c.reserva_id', '=', 'r.id')
            ->join('inventarios as i', 'c.inventario_id', '=', 'i.id')
            ->join('estados as e', 'r.estado_id', '=', 'e.id')
            ->select(
                'i.nombre_producto',
                DB::raw('SUM(c.cantidad) as total_consumido'),
                DB::raw('SUM(c.subtotal) as subtotal_consumido'),
                DB::raw('SUM(c.iva) as total_iva'),
                DB::raw('SUM(c.total) as total_importe')
            )
            ->where('e.nombre_estado', 'PAGADO')
            ->where('r.tipo_reserva', 'ESTADIA');

        // Filtro por rango de fechas o año
        if ($fecha_inicio && $fecha_fin) {
            $query->whereBetween('c.fecha_creacion', [$fecha_inicio, $fecha_fin]);
        } elseif ($anio) {
            $query->whereYear('c.fecha_creacion', $anio);
        }

        $query->groupBy('i.nombre_producto')
            ->orderBy('i.nombre_producto', 'asc');

        $consumos = $query->get();

        // Calcular el total de reservas tipo ESTADIA en el periodo
        $queryReservas = DB::table('reservas as r')
            ->join('estados as e', 'r.estado_id', '=', 'e.id')
            ->where('e.nombre_estado', 'PAGADO')
            ->where('r.tipo_reserva', 'ESTADIA')
            ->select(
                DB::raw('COUNT(r.id) as total_reservas'),
                DB::raw('
                        COALESCE(SUM(
                            COALESCE(r.total_adultos,0) +
                            COALESCE(r.total_ninos,0) +
                            COALESCE(r.total_mascotas,0)
                        ), 0) as total_visitantes
                    ')
            );

        // Aplicar los mismos filtros de fecha
        if ($fecha_inicio && $fecha_fin) {
            $queryReservas->whereBetween('r.fecha_creacion', [$fecha_inicio, $fecha_fin]);
        } elseif ($anio) {
            $queryReservas->whereYear('r.fecha_creacion', $anio);
        }

        $total_reservas = $queryReservas->get();

        $pdf = Pdf::loadView('pdf.reportes.estadia.consumos_estadias_pdf', [
            'consumos'        => $consumos,
            'fecha_inicio'    => $fecha_inicio,
            'fecha_fin'       => $fecha_fin,
            'anio'            => $anio,
            'total_reservas'  => $total_reservas,
        ]);

        return $pdf->download('consumos_estadias.pdf');
    }
}
