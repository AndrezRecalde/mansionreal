<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\ReservaRequest;
use App\Models\ConfiguracionIva;
use App\Models\Consumo;
use App\Models\Estado;
use App\Models\Huesped;
use App\Models\Reserva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class ReservasController extends Controller
{

    public function store(ReservaRequest $request): JsonResponse
    {
        try {
            // 1. Obtener IDs de estados activos tipo RESERVA una sola vez
            $estadoReservaIds = Estado::where('activo', 1)
                ->where('tipo_estado', 'RESERVA')
                ->whereIn('nombre_estado', ['RESERVADO', 'CONFIRMADO'])
                ->pluck('id')
                ->toArray();

            // 2. Validar traslape de reservas (consulta optimizada)
            $traslape = Reserva::where('departamento_id', $request->departamento_id)
                ->whereIn('estado_id', $estadoReservaIds)
                ->where(function ($query) use ($request) {
                    $query->where('fecha_checkin', '<=', $request->fecha_checkout)
                        ->where('fecha_checkout', '>=', $request->fecha_checkin);
                })
                ->exists();

            if ($traslape) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'El departamento ya está reservado en ese rango de fechas.'
                ], 409);
            }

            // 3. Crear huésped si no existe
            if ($request->huesped['huesped_id'] == null) {
                $huesped = Huesped::create([
                    'nombres'       => $request->huesped['nombres'],
                    'apellidos'     => $request->huesped['apellidos'],
                    'dni'           => $request->huesped['dni'],
                    'telefono'      => $request->huesped['telefono'],
                    'email'         => $request->huesped['email'],
                    'provincia_id'  => $request->huesped['provincia_id'],
                ]);
            }

            // 4. Guardar la reserva
            $reserva = new Reserva();
            $reserva->fill($request->validated());
            $reserva->huesped_id = $request->huesped['huesped_id'] ?? $huesped->id;
            $reserva->estado_id = Estado::where('activo', 1)
                ->where('tipo_estado', 'RESERVA')
                ->where('nombre_estado', 'RESERVADO')
                ->value('id');
            $reserva->fecha_creacion = now();
            $reserva->usuario_creador_id = Auth::id();
            //$reserva->save();

            // 5. Generar código de reserva
            $codigo = now()->year
                . str_pad($reserva->id, 5, '0', STR_PAD_LEFT)
                . str_pad(rand(0, 99), 2, '0', STR_PAD_LEFT);
            $reserva->codigo_reserva = $codigo;
            $reserva->save();

            // 6. Obtener inventario usando relaciones Eloquent
            $inventario = $reserva->departamento
                ->tipoDepartamento
                ->inventario;

            // 7. Obtener la tasa de IVA activa
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();

            // 8. Calcular valores para consumo
            $cantidad = $reserva->total_noches;
            $precioUnitario = $inventario->precio_unitario;
            $subtotal = $cantidad * $precioUnitario;
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;
            $iva = $subtotal * ($tasa_iva / 100);
            $total_iva = $subtotal + $iva;
            $aplica_iva = $tasa_iva > 0 ? true : false;

            // 9. Guardar registro en consumos
            Consumo::create([
                'reserva_id'      => $reserva->id,
                'inventario_id'   => $inventario->id,
                'cantidad'        => $cantidad,
                'fecha_creacion'  => now(),
                'subtotal'        => $subtotal,
                'tasa_iva'        => $tasa_iva,
                'iva'             => $iva,
                'total'          => $total_iva,
                'aplica_iva'      => $aplica_iva,
            ]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'reserva'   => $reserva
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function update(ReservaRequest $request, int $id): JsonResponse
    {
        try {
            $reserva = Reserva::find($id);
            if (!$reserva) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $reserva->update($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'data'   => $reserva
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function cambiarEstadoReserva(Request $request, int $id): JsonResponse
    {
        try {
            $reserva = Reserva::find($id);
            if (!$reserva) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'Reserva no encontrada'
                ], 404);
            }

            $estado = Estado::where('nombre_estado', $request->nombre_estado)
                ->first();

            if (!$estado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'Estado no válido para reserva'
                ], 400);
            }

            $reserva->estado_id = $estado->id;
            $reserva->save();

            return response()->json([
                'status' => HTTPStatus::Success,
                'data'   => $reserva
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function eliminarReserva(int $id): JsonResponse
    {
        try {
            $reserva = Reserva::find($id);
            if (!$reserva) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            $reserva->delete();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => 'Reserva eliminada correctamente'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    //ESTE ES PARA MOSTRAR EL REPORTE DE DEPARTAMENTOS CON SU TOTAL DE RESERVAS Y PAGOS EN UN RANGO DE FECHAS
    // PARA LA VISTA DE REPORTES DE RESERVAS
    function reporteDepartamentosPorFechas(Request $request): JsonResponse
    {
        try {
            $fecha_inicio = $request->fecha_inicio;
            $fecha_fin = $request->fecha_fin;
            $anio = $request->anio;
            $result = DB::select('CALL reporte_departamentos_por_fechas(?, ?, ?)', [
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


    // ESTE ES PARA EL HISTORIAL DE CONSUMOS EN LAS RESERVAS
    public function buscarReservas(Request $request)
    {
        $fecha_inicio = $request->fecha_inicio;
        $fecha_fin = $request->fecha_fin;
        $codigo_reserva = $request->codigo_reserva;

        if (!$codigo_reserva && (!$fecha_inicio || !$fecha_fin)) {
            return response()->json(['error' => 'Debe proporcionar un código de reserva o el rango de fechas'], 400);
        }
        $reservas = Reserva::with([
            'huesped',
            'departamento',
            'estado',
            'consumos.inventario'
        ])
            ->codigoReserva($codigo_reserva)
            ->fechaCheckin($fecha_inicio, $fecha_fin)
            ->get()
            ->map(function ($r) {
                return [
                    'id'             => $r->id,
                    'codigo_reserva' => $r->codigo_reserva,
                    'huesped'        => $r->huesped ? $r->huesped->nombres . ' ' . $r->huesped->apellidos : null,
                    'departamento'   => $r->departamento ? $r->departamento->numero_departamento : null,
                    'fecha_checkin'  => $r->fecha_checkin,
                    'fecha_checkout' => $r->fecha_checkout,
                    'total_noches'   => $r->total_noches,
                    'estado'         => $r->estado ? $r->estado->nombre_estado : null,
                    'color_estado'   => $r->estado ? $r->estado->color : null,
                    'consumos'       => $r->consumos->map(function ($c) {
                        return [
                            'nombre_producto' => $c->inventario ? $c->inventario->nombre_producto : null,
                            'cantidad'        => $c->cantidad,
                            'subtotal'        => $c->subtotal,
                            'tasa_iva'        => $c->tasa_iva,
                            'iva'             => $c->iva,
                            'total'           => $c->total,
                        ];
                    }),
                ];
            });
        return response()->json([
            'status'     => HTTPStatus::Success,
            'reservas'   => $reservas
        ]);
    }
}
