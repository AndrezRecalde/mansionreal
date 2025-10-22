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
                        'huesped'        => $reserva->huesped->nombres . " " . $reserva->huesped->apellidos,
                        'dni'            => $reserva->huesped->dni,
                        'fecha_checkin'  => $reserva->fecha_checkin,
                        'fecha_checkout' => $reserva->fecha_checkout,
                        'total_noches'   => $reserva->total_noches,
                        'total_adultos'  => $reserva->total_adultos,
                        'total_ninos'    => $reserva->total_ninos,
                        'total_mascotas' => $reserva->total_mascotas,
                        'estado'         => $reserva->estado->nombre_estado ?? 'SIN ESTADO',
                        'estado_color'   => $reserva->estado->color
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
        try {
            // 1. Obtener o crear huésped
            if ($request->huesped['huesped_id'] == null) {
                // Crear nuevo huésped
                $huesped = Huesped::create([
                    'nombres'       => $request->huesped['nombres'],
                    'apellidos'     => $request->huesped['apellidos'],
                    'dni'           => $request->huesped['dni'],
                    'telefono'      => $request->huesped['telefono'],
                    'email'         => $request->huesped['email'],
                    'direccion'     => $request->huesped['direccion'],
                    'nacionalidad'  => $request->huesped['nacionalidad'],
                ]);
            } else {
                // Obtener huésped existente
                $huesped = Huesped::findOrFail($request->huesped['huesped_id']);
            }

            // 2. Crear la reserva tipo ESTADIA
            $reserva = new Reserva();
            $reserva->fill($request->validated());
            $reserva->huesped_id = $huesped->id; // ← Simplificado
            $reserva->estado_id = Estado::where('activo', 1)
                ->where('tipo_estado', 'RESERVA')
                ->where('nombre_estado', 'RESERVADO')
                ->value('id');
            $reserva->fecha_creacion = now();
            $reserva->usuario_creador_id = Auth::id();

            // ---------------- Hardcode tipo_reserva ----------------
            $reserva->tipo_reserva = TIPOSRESERVA::ESTADIA;
            $reserva->departamento_id = null;  // No se asigna habitación
            $reserva->fecha_checkin = now();
            $reserva->fecha_checkout = now();
            $reserva->total_noches = 0;        // No aplica para estadía
            // --------------------------------------------------------
            $reserva->save();

            // 3. Obtener inventario de estadía
            $inventarioAdulto = Inventario::where('nombre_producto', 'Estadia Adultos')->first();
            $inventarioNino   = Inventario::where('nombre_producto', 'Estadia Ninos')->first();

            // 4. Obtener tasa de IVA activa
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();

            // --- Determinar tasa de IVA según nacionalidad ---
            $nacionalidad = $huesped->nacionalidad; // ← Ahora $huesped siempre existe
            if ($nacionalidad === 'ECUATORIANO') {
                $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;
            } else {
                $tasa_iva = 0;
            }

            // 5. Crear consumos automáticos
            if ($reserva->total_adultos > 0 && $inventarioAdulto) {
                $subtotal = $reserva->total_adultos * $inventarioAdulto->precio_unitario;
                $iva      = $subtotal * ($tasa_iva / 100);
                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioAdulto->id,
                    'cantidad'        => $reserva->total_adultos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                    'aplica_iva'      => $tasa_iva > 0,
                ]);
            }

            if ($reserva->total_ninos > 0 && $inventarioNino) {
                $subtotal = $reserva->total_ninos * $inventarioNino->precio_unitario;
                $iva      = $subtotal * ($tasa_iva / 100);
                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioNino->id,
                    'cantidad'        => $reserva->total_ninos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                    'aplica_iva'      => $tasa_iva > 0,
                ]);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => 'Estadía #' . $reserva->codigo_reserva . ' creada con éxito',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    public function updateEstadia(Request $request, int $id): JsonResponse
    {
        try {
            // 1. Validar entrada mínima
            $validated = $request->validate([
                'total_adultos' => 'nullable|integer|min:0',
                'total_ninos'   => 'nullable|integer|min:0',
                'total_mascotas' => 'nullable|integer|min:0',
            ]);

            // 2. Buscar la reserva tipo ESTADIA
            $reserva = Reserva::where('id', $id)
                ->where('tipo_reserva', 'estadia')
                ->firstOrFail();

            // 3. Actualizar los campos esenciales
            $reserva->update([
                'total_adultos'  => $validated['total_adultos'] ?? $reserva->total_adultos,
                'total_ninos'    => $validated['total_ninos'] ?? $reserva->total_ninos,
                'total_mascotas' => $validated['total_mascotas'] ?? $reserva->total_mascotas,
            ]);

            // 4. Recalcular consumos (adultos y niños)
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;

            $inventarioAdulto = Inventario::where('nombre_producto', 'Estadia Adulto')->first();
            $inventarioNino   = Inventario::where('nombre_producto', 'Estadia Niño')->first();

            // 👉 Eliminar consumos anteriores de adultos/niños
            Consumo::where('reserva_id', $reserva->id)
                ->whereIn('inventario_id', [$inventarioAdulto->id ?? 0, $inventarioNino->id ?? 0])
                ->delete();

            // 👉 Crear nuevamente consumos actualizados
            if ($reserva->total_adultos > 0 && $inventarioAdulto) {
                $subtotal = $reserva->total_adultos * $inventarioAdulto->precio_unitario;
                $iva      = $subtotal * ($tasa_iva / 100);
                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioAdulto->id,
                    'cantidad'        => $reserva->total_adultos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                    'aplica_iva'      => $tasa_iva > 0,
                ]);
            }

            if ($reserva->total_ninos > 0 && $inventarioNino) {
                $subtotal = $reserva->total_ninos * $inventarioNino->precio_unitario;
                $iva      = $subtotal * ($tasa_iva / 100);
                Consumo::create([
                    'reserva_id'      => $reserva->id,
                    'inventario_id'   => $inventarioNino->id,
                    'cantidad'        => $reserva->total_ninos,
                    'fecha_creacion'  => now(),
                    'subtotal'        => $subtotal,
                    'tasa_iva'        => $tasa_iva,
                    'iva'             => $iva,
                    'total'           => $subtotal + $iva,
                    'aplica_iva'      => $tasa_iva > 0,
                ]);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => 'Estadía actualizada con éxito',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage(),
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

        $pdf = Pdf::loadView('pdf.reportes.estadia.consumos_estadias_pdf', [
            'consumos'      => $consumos,
            'fecha_inicio'  => $fecha_inicio,
            'fecha_fin'     => $fecha_fin,
            'anio'          => $anio,
        ]);

        return $pdf->download('consumos_estadias.pdf');
    }
}
