<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Enums\TIPOSRESERVA;
use App\Http\Requests\ReservaRequest;
use App\Models\ConfiguracionIva;
use App\Models\Consumo;
use App\Models\Estado;
use App\Models\Huesped;
//use App\Models\Inventario;
use App\Models\Reserva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservasController extends Controller
{

    public function store(ReservaRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            // 1. Validar traslape de reservas
            $estadoReservaIds = Estado::where('activo', 1)
                ->where('tipo_estado', 'RESERVA')
                ->whereIn('nombre_estado', ['RESERVADO', 'CONFIRMADO'])
                ->pluck('id')
                ->toArray();

            $fechaInicio = Carbon::parse($request->fecha_checkin)->startOfDay();
            $fechaFin = Carbon::parse($request->fecha_checkout)->endOfDay();

            $traslape = Reserva::where('departamento_id', $request->departamento_id)
                ->whereIn('estado_id', $estadoReservaIds)
                ->where(function ($query) use ($fechaInicio, $fechaFin) {
                    $query->where('fecha_checkin', '<=', $fechaFin)
                        ->where('fecha_checkout', '>=', $fechaInicio);
                })
                ->exists();

            if ($traslape) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'El departamento ya está reservado en ese rango de fechas.'
                ], 409);
            }

            // 2. Obtener o crear huésped
            if ($request->huesped['huesped_id'] == null) {
                $huesped = Huesped::create([
                    'nombres_completos'       => $request->huesped['nombres_completos'],
                    'dni'           => $request->huesped['dni'],
                    'telefono'      => $request->huesped['telefono'] ?? null,
                    'email'         => $request->huesped['email'] ?? null,
                ]);
            } else {
                $huesped = Huesped::findOrFail($request->huesped['huesped_id']);
            }

            // 3. Crear reserva
            $reserva = new Reserva();
            $reserva->fill($request->validated());
            $reserva->huesped_id = $huesped->id;
            $reserva->estado_id = Estado::where('activo', 1)
                ->where('tipo_estado', 'RESERVA')
                ->where('nombre_estado', 'RESERVADO')
                ->value('id');
            $reserva->fecha_creacion = now();
            $reserva->usuario_creador_id = Auth::id();
            $reserva->tipo_reserva = TIPOSRESERVA::HOSPEDAJE;
            $reserva->save();

            // 4. Obtener producto de hospedaje
            $inventario = $reserva->departamento
                ->tipoDepartamento
                ->inventario;

            // 5. Obtener tasa de IVA (para TODOS los productos)
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 15.00;

            // 6. Calcular consumo de hospedaje
            $cantidad = $reserva->total_noches;
            $precio_unitario = $inventario->precio_unitario; // Base sin IVA
            $subtotal = $cantidad * $precio_unitario;

            // ================================================================
            // SIMPLIFICADO: IVA siempre se aplica
            // ================================================================
            $iva = $subtotal * ($tasa_iva / 100);
            $total = $subtotal + $iva;

            // 7. Crear consumo
            Consumo::create([
                'reserva_id'      => $reserva->id,
                'inventario_id'   => $inventario->id,
                'cantidad'        => $cantidad,
                'fecha_creacion'  => now(),
                'subtotal'        => $subtotal,
                'tasa_iva'        => $tasa_iva,
                'iva'             => $iva,
                'total'           => $total,
            ]);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => "Reserva # {$reserva->codigo_reserva} registrada correctamente.",
                //'reserva' => $reserva->load(['huesped', 'departamento', 'estado']),
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
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
                'reserva'   => $reserva
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
                'msg'   => 'Estado de la reserva actualizado a ' . $estado->nombre_estado
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

    // ESTE ES PARA EL HISTORIAL DE CONSUMOS EN LAS RESERVAS
    public function buscarReservas(Request $request)
    {
        $fecha_inicio = $request->fecha_inicio;
        $fecha_fin = $request->fecha_fin;
        $codigo_reserva = $request->codigo_reserva;

        if (!$codigo_reserva && (! $fecha_inicio || !$fecha_fin)) {
            return response()->json(['error' => 'Debe proporcionar un código de reserva o el rango de fechas'], 400);
        }

        $reservas = Reserva::with([
            'huesped',
            'departamento.tipoDepartamento',
            'estado',
            'consumos.inventario',
            'ultimaFactura:id,facturas.reserva_id,numero_factura,estado,fecha_emision,total_factura,motivo_anulacion',
            'usuarioCreador:id,apellidos,nombres',
            'usuarioCancelador:id,apellidos,nombres'
        ])
            ->codigoReserva($codigo_reserva)
            ->fechaCheckin($fecha_inicio, $fecha_fin)
            ->orderBy('fecha_checkin', 'DESC')
            ->get()
            ->map(function ($r) {
                $reservaData = [
                    'reserva_id'      => $r->id,
                    'codigo_reserva'  => $r->codigo_reserva,
                    'huesped_id'      => $r->huesped_id,
                    'huesped'         => $r->huesped ?  $r->huesped->nombres_completos : null,
                    'departamento_id' => $r->departamento_id,
                    'numero_departamento'   => $r->departamento ?  $r->departamento->numero_departamento : null,
                    'tipo_departamento'     => $r->departamento && $r->departamento->tipoDepartamento
                        ? $r->departamento->tipoDepartamento->nombre_tipo
                        : null,
                    'fecha_checkin'   => $r->fecha_checkin,
                    'fecha_checkout'  => $r->fecha_checkout,
                    'total_noches'    => $r->total_noches,
                    'estado'          => [
                        'id' => $r->estado->id,
                        'nombre_estado' => $r->estado->nombre_estado,
                        'color' => $r->estado->color,
                    ],
                    'fecha_creacion'  => $r->fecha_creacion,
                    'usuario_creador' => $r->usuarioCreador ? $r->usuarioCreador->nombres . ' ' . $r->usuarioCreador->apellidos : null,
                    'total_adultos'    => $r->total_adultos,
                    'total_ninos'      => $r->total_ninos,
                    'total_mascotas'    => $r->total_mascotas,
                    'motivo_cancelacion' => $r->motivo_cancelacion ?? null,
                    'observacion_cancelacion' => $r->observacion_cancelacion ?? null,
                    'fecha_cancelacion' => $r->fecha_cancelacion ?? null,
                    'usuario_cancelador' => $r->usuarioCancelador ? $r->usuarioCancelador->nombres . ' ' . $r->usuarioCancelador->apellidos : null,
                    'total_consumos'  => $r->consumos->sum('total'),
                    'total_pagos'     => $r->pagos->sum('monto'),
                    'total_gastos'    => $r->gastos->sum('monto'),
                ];

                if ($r->ultimaFactura) {
                    $reservaData['factura'] = [
                        'id' => $r->ultimaFactura->id,
                        'numero_factura' => $r->ultimaFactura->numero_factura,
                        'estado' => $r->ultimaFactura->estado,
                        'fecha_emision' => $r->ultimaFactura->fecha_emision,
                        'total_factura' => $r->ultimaFactura->total_factura,
                        'motivo_anulacion' => $r->ultimaFactura->motivo_anulacion,
                    ];
                    $reservaData['tiene_factura'] = true;
                    $reservaData['factura_estado'] = $r->ultimaFactura->estado;
                    $reservaData['puede_refacturar'] = $r->ultimaFactura->estado === 'ANULADA';
                } else {
                    $reservaData['factura'] = null;
                    $reservaData['tiene_factura'] = false;
                    $reservaData['factura_estado'] = null;

                    // Puede generar factura si tiene consumos pendientes
                    $consumosPendientes = $r->consumos()->whereNull('factura_id')->count() > 0;
                    $reservaData['puede_refacturar'] = $consumosPendientes;
                }

                return $reservaData;
            });

        return response()->json([
            'status'     => HTTPStatus::Success,
            'reservas'   => $reservas
        ]);
    }

    /**
     * Cancela una reserva existente
     * Devuelve al inventario los productos consumidos que NO sean de categoría Hospedaje/Estadía
     *
     * @param Request $request
     * @param Reserva $reserva
     * @return JsonResponse
     */
    public function cancelar(Request $request, Reserva $reserva): JsonResponse
    {
        $request->validate([
            'motivo_cancelacion' => 'required|in:ERROR_TIPEO,CAMBIO_FECHAS,CAMBIO_HUESPED,SOLICITUD_CLIENTE,FUERZA_MAYOR,OTRO',
            'observacion' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // 1. Validar que la reserva pueda cancelarse
            $estadoActual = $reserva->estado->nombre_estado;

            if ($estadoActual === 'CANCELADO') {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'La reserva ya está cancelada'
                ], 400);
            }

            // 2. Obtener estado CANCELADO
            $estadoCancelado = Estado::where('activo', 1)
                ->where('tipo_estado', 'RESERVA')
                ->where('nombre_estado', 'CANCELADO')
                ->firstOrFail();

            // 3. Devolver productos al inventario (excepto Hospedaje/Estadía)
            $productosDevueltos = $this->devolverProductosAlInventario($reserva);

            // 4. Actualizar reserva a cancelado
            $reserva->update([
                'estado_id' => $estadoCancelado->id,
                'motivo_cancelacion' => $request->motivo_cancelacion,
                'observacion_cancelacion' => $request->observacion,
                'fecha_cancelacion' => now(),
                'usuario_cancelador_id' => Auth::id(),
            ]);

            Log::info("Reserva cancelada", [
                'codigo_reserva' => $reserva->codigo_reserva,
                'motivo' => $request->motivo_cancelacion,
                'productos_devueltos' => $productosDevueltos,
                'usuario' => Auth::user()->name ?? Auth::id(),
            ]);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Reserva #' . $reserva->codigo_reserva . ' cancelada correctamente',
                'data' => [
                    'reserva' => [
                        'id' => $reserva->id,
                        'codigo_reserva' => $reserva->codigo_reserva,
                        'motivo_cancelacion' => $reserva->motivo_cancelacion,
                        'observacion_cancelacion' => $reserva->observacion_cancelacion,
                        'fecha_cancelacion' => $reserva->fecha_cancelacion->format('Y-m-d H:i:s'),
                        'usuario_cancelador' => $reserva->usuarioCancelador->name ?? null,
                    ],
                    'productos_devueltos' => $productosDevueltos,
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error("Error al cancelar reserva", [
                'codigo_reserva' => $reserva->codigo_reserva ?? null,
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
            ]);

            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al cancelar la reserva: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Devuelve productos al inventario que NO sean de categorías Hospedaje o Estadía
     *
     * @param Reserva $reserva
     * @return array Lista de productos devueltos con sus cantidades
     */
    private function devolverProductosAlInventario(Reserva $reserva): array
    {
        $productosDevueltos = [];

        // Obtener consumos de la reserva con sus inventarios y categorías
        $consumos = Consumo::where('reserva_id', $reserva->id)
            ->with(['inventario.categoria'])
            ->get();

        foreach ($consumos as $consumo) {
            $inventario = $consumo->inventario;
            $categoria = $inventario->categoria;

            // Solo devolver stock si NO es de categoría Hospedaje o Estadía
            $categoriasExcluidas = ['HOSPEDAJE', 'ESTADIA', 'Hospedaje', 'Estadía'];

            if (!in_array(strtoupper($categoria->nombre_categoria ?? ''), array_map('strtoupper', $categoriasExcluidas))) {

                // Registrar devolución al inventario usando el método del modelo
                $movimiento = $inventario->registrarEntrada(
                    cantidad: $consumo->cantidad,
                    motivo: 'Devolución por cancelación de reserva',
                    observaciones: "Reserva cancelada: {$reserva->codigo_reserva}. Motivo: {$reserva->motivo_cancelacion}",
                    usuarioId: Auth::id()
                );

                $productosDevueltos[] = [
                    'producto' => $inventario->nombre_producto,
                    'cantidad' => $consumo->cantidad,
                    'stock_anterior' => $movimiento->stock_anterior,
                    'stock_nuevo' => $movimiento->stock_nuevo,
                ];

                Log::info("Producto devuelto al inventario", [
                    'reserva' => $reserva->codigo_reserva,
                    'producto' => $inventario->nombre_producto,
                    'cantidad' => $consumo->cantidad,
                    'stock_anterior' => $movimiento->stock_anterior,
                    'stock_nuevo' => $movimiento->stock_nuevo,
                ]);
            }
        }

        return $productosDevueltos;
    }


    /* Exportar PDF */

    public function exportarNotaVentaPDF(Request $request)
    {
        $reservaId = $request->reserva_id;
        if (!$reservaId) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => 'El ID de la reserva es obligatorio'
            ], 422);
        }
        // 2. Consulta la reserva específica con sus consumos y departamento relacionado
        $reserva = Reserva::with([
            'departamento',
            'huesped',
            'estado',
            'consumos.inventario'
        ])->find($reservaId);

        if (!$reserva) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Reserva no encontrada'
            ], 404);
        }
        // 3. Armar estructura igual a consultarDisponibilidadDepartamentosPorFecha
        $resultado = [
            'reserva'             => [
                'id'             => $reserva->id,
                'codigo_reserva' => $reserva->codigo_reserva,
                'huesped_id'     => $reserva->huesped_id,
                'huesped'        => $reserva->huesped?->nombres_completos,
                'huesped_dni'    => $reserva->huesped?->dni,
                'fecha_checkin'  => $reserva->fecha_checkin,
                'fecha_checkout' => $reserva->fecha_checkout,
                'total_noches'   => $reserva->total_noches,
                'estado'         => [
                    'id'      => $reserva->estado?->id,
                    'nombre'  => $reserva->estado?->nombre_estado,
                    'color'   => $reserva->estado?->color,
                ],
                'consumos'      => $reserva->consumos ? $reserva->consumos->map(function ($consumo) {
                    return [
                        'id'          => $consumo->id,
                        'producto'    => $consumo->inventario?->nombre_producto,
                        'cantidad'    => $consumo->cantidad,
                        'subtotal'    => $consumo->subtotal,
                        'iva'         => $consumo->iva,
                        'total'       => $consumo->total,
                    ];
                }) : [],
            ],
        ];

        // 4. Datos fijos
        $ruc = "0803188499001";
        $direccion = "Atacames, Via Principal a Súa";
        $logo = public_path('/assets/images/logo_hotel.jpeg'); // Ajusta nombre si es necesario

        // 5. Generar PDF
        $pdf = Pdf::loadView('pdf.nota_venta.nota_venta_pdf', [
            'ruc'           => $ruc,
            'direccion'     => $direccion,
            'logo'          => $logo,
            'departamento'  => $resultado,
            'reserva'       => $resultado['reserva'],
        ]);

        return $pdf->download("nota_de_venta_{$reserva->codigo_reserva}.pdf");
    }
}
