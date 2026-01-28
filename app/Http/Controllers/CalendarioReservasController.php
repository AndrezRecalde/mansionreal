<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CalendarioReservasController extends Controller
{
    public function getReservasCalendario(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start' => 'nullable|date',
            'end' => 'nullable|date',
            'departamento_id' => 'nullable|exists:departamentos,id'
        ]);

        try {
            $query = Reserva::query()
                ->with([
                    'huesped:id,nombres_completos,dni,telefono,email',
                    'departamento:id,numero_departamento,tipo_departamento_id',
                    'departamento.tipoDepartamento:id,nombre_tipo',
                    'estado:id,nombre_estado,color'
                ])
                ->where('tipo_reserva', 'HOSPEDAJE')
                ->whereNotNull('departamento_id');

            if (isset($validated['start']) && isset($validated['end'])) {
                $query->where(function ($q) use ($validated) {
                    $q->whereBetween('fecha_checkin', [$validated['start'], $validated['end']])
                        ->orWhereBetween('fecha_checkout', [$validated['start'], $validated['end']])
                        ->orWhere(function ($q2) use ($validated) {
                            $q2->where('fecha_checkin', '<=', $validated['start'])
                                ->where('fecha_checkout', '>=', $validated['end']);
                        });
                });
            }

            if (isset($validated['departamento_id'])) {
                $query->where('departamento_id', $validated['departamento_id']);
            }

            $reservas = $query->get();

            $eventos = $reservas->map(function ($reserva) {
                $huesped = $reserva->huesped;
                $departamento = $reserva->departamento;
                $tipoDepartamento = $departamento?->tipoDepartamento;
                $estado = $reserva->estado;

                return [
                    'id' => $reserva->id,
                    'resourceId' => $reserva->departamento_id,
                    'title' => $this->generarTituloEvento($reserva),
                    'start' => $this->formatearFecha($reserva->fecha_checkin),
                    'end' => $this->formatearFecha($reserva->fecha_checkout),
                    'allDay' => false,
                    'backgroundColor' => $this->getColorEvento($estado),
                    'borderColor' => $this->getColorEvento($estado),
                    'textColor' => '#ffffff',
                    'extendedProps' => [
                        'codigo_reserva' => $reserva->codigo_reserva,
                        'huesped' => [
                            'id' => $huesped?->id,
                            'nombres_completos' => $huesped ?  $huesped->nombres_completos : null,
                            'dni' => $huesped?->dni,
                            'telefono' => $huesped?->telefono,
                            'email' => $huesped?->email,
                        ],
                        'departamento' => [
                            'id' => $departamento?->id,
                            'tipo_departamento' => $tipoDepartamento?->nombre_tipo,
                            'numero' => $departamento?->numero_departamento,
                            'tipo' => $departamento?->tipoDepartamento?->nombre_tipo,
                        ],
                        'estado' => [
                            'nombre_estado' => $estado?->nombre_estado,
                            'color' => $estado?->color,
                        ],
                        'total_noches' => $reserva->total_noches,
                        'total_adultos' => $reserva->total_adultos,
                        'total_ninos' => $reserva->total_ninos,
                        'total_mascotas' => $reserva->total_mascotas,
                    ],
                ];
            });

            return response()->json([
                'status' => HTTPStatus::Success,
                'eventos' => $eventos,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en getReservasCalendario: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'status' => HTTPStatus::Error,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getDepartamentosRecursos(): JsonResponse
    {
        try {
            $departamentos = DB::table('departamentos as d')
                ->join('tipos_departamentos as td', 'd.tipo_departamento_id', '=', 'td.id')
                ->select(
                    'd.id',
                    'd.numero_departamento',
                    'td.nombre_tipo',
                    'd.capacidad',
                    'd.activo'
                )
                ->where('d.activo', 1)
                ->orderBy('d.numero_departamento')
                ->get();

            $recursos = $departamentos->map(function ($depto) {
                return [
                    'id' => $depto->id,
                    'title' => "Depto.  {$depto->numero_departamento} - {$depto->nombre_tipo}",
                    'extendedProps' => [
                        'numero' => $depto->numero_departamento,
                        'tipo' => $depto->nombre_tipo,
                        'capacidad' => $depto->capacidad,
                    ],
                ];
            });

            return response()->json([
                'status' => HTTPStatus::Success,
                'recursos' => $recursos,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en getDepartamentosRecursos: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'status' => HTTPStatus::Error,
                'message' => 'Error al obtener los departamentos',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function getEstadisticasOcupacion(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        try {
            $totalDepartamentos = DB::table('departamentos')
                ->where('activo', 1)
                ->count();

            $fechaInicio = Carbon::parse($validated['fecha_inicio']);
            $fechaFin = Carbon::parse($validated['fecha_fin']);
            $diasPeriodo = $fechaInicio->diffInDays($fechaFin) + 1;

            $nochesTotalesPosibles = $totalDepartamentos * $diasPeriodo;

            $fechaInicio = Carbon::parse($validated['fecha_inicio'])->startOfDay();
            $fechaFin = Carbon::parse($validated['fecha_fin'])->endOfDay();

            $nochesOcupadas = Reserva::where('tipo_reserva', 'HOSPEDAJE')
                ->whereNotNull('departamento_id')
                ->where(function ($q) use ($fechaInicio, $fechaFin) {
                    $q->whereBetween('fecha_checkin', [$fechaInicio, $fechaFin])
                        ->orWhereBetween('fecha_checkout', [$fechaInicio, $fechaFin])
                        ->orWhere(function ($q2) use ($fechaInicio, $fechaFin) {
                            $q2->where('fecha_checkin', '<=', $fechaInicio)
                                ->where('fecha_checkout', '>=', $fechaFin);
                        });
                })
                ->sum('total_noches');

            $porcentajeOcupacion = $nochesTotalesPosibles > 0
                ?  round(($nochesOcupadas / $nochesTotalesPosibles) * 100, 2)
                : 0;

            return response()->json([
                'status' => HTTPStatus::Success,
                'total_departamentos' => $totalDepartamentos,
                'dias_periodo' => $diasPeriodo,
                'noches_posibles' => $nochesTotalesPosibles,
                'noches_ocupadas' => $nochesOcupadas,
                'porcentaje_ocupacion' => $porcentajeOcupacion,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en getEstadisticasOcupacion: ' .  $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'status' => HTTPStatus::Error,
                'message' => 'Error al obtener las estadisticas de ocupacion',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    private function generarTituloEvento(Reserva $reserva): string
    {
        //$huesped = $reserva->huesped;
        $departamento = $reserva->departamento;
        $codigo = $reserva->codigo_reserva;
        $tipoDepartamento = $departamento?->tipoDepartamento;

        //$nombreHuesped = $huesped ? trim("{$huesped->apellidos} {$huesped->nombres}") : 'Sin huesped';
        $numeroDepartamento = $departamento?->numero_departamento ??  'S/N';
        $codigoReserva = $codigo ? " {$codigo}" : '';
        $tipoDepartamentoNombre = Str::of($tipoDepartamento?->nombre_tipo)->title() ?? 'Tipo Desconocido';

        return "{$tipoDepartamentoNombre} {$numeroDepartamento} - {$codigoReserva}";
    }

    private function getColorEvento(?object $estado): string
    {
        if (!$estado || !isset($estado->color)) {
            return '#64748B';
        }

        return match ($estado->color) {
            // Colores base premium
            'indigo' => '#4338CA',
            'blue' => '#1E40AF',
            'red' => '#B91C1C',
            'teal' => '#0F766E',
            'gray' => '#475569',
            'orange' => '#C2410C',
            'green' => '#15803D',
            'yellow' => '#CA8A04',
            'purple' => '#7C3AED',
            'pink' => '#BE185D',

            // Estados específicos de hotel (opcionales)
            'confirmed' => '#0F766E',    // Confirmado
            'pending' => '#CA8A04',      // Pendiente
            'checked-in' => '#15803D',   // En hotel
            'checked-out' => '#64748B',  // Check-out
            'cancelled' => '#B91C1C',    // Cancelado
            'vip' => '#7C3AED',          // VIP
            'blocked' => '#1E293B',      // Bloqueado

            default => '#64748B',
        };
    }

    private function formatearFecha($fecha): string
    {
        if ($fecha instanceof Carbon) {
            return $fecha->format('Y-m-d\TH:i:s');
        }

        if (is_string($fecha)) {
            try {
                return Carbon::parse($fecha)->format('Y-m-d\TH:i:s');
            } catch (\Exception $e) {
                Log::error('Error al parsear fecha: ' . $e->getMessage());
                return $fecha;
            }
        }

        return (string) $fecha;
    }
}
