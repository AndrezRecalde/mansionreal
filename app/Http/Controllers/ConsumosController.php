<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\ConsumoRequest;
use App\Http\Requests\RegistrarConsumosRequest;
use App\Models\Consumo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ConfiguracionIva;
use App\Models\Huesped;
use App\Models\Inventario;
use App\Models\Reserva;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Svg\Tag\Rect;

class ConsumosController extends Controller
{
    public function buscarConsumosPorReserva(Request $request)
    {
        $reserva_id = $request->reserva_id;

        if (!$reserva_id) {
            return response()->json(['error' => 'Debe proporcionar el reserva_id'], 400);
        }

        $consumos = Consumo::with('inventario')
            ->where('reserva_id', $reserva_id)
            ->get()
            ->map(function ($c) {
                return [
                    'id'              => $c->id,
                    'inventario_id'   => $c->inventario->id,
                    'nombre_producto' => $c->inventario ? $c->inventario->nombre_producto : null,
                    'reserva_id'      => $c->reserva ? $c->reserva->id : null,
                    'huespued'        => $c->reserva ? $c->reserva->huesped->nombres . ' ' . $c->reserva->huesped->apellidos : null,
                    'cantidad'        => $c->cantidad,
                    'subtotal'        => $c->subtotal,
                    'tasa_iva'        => $c->tasa_iva,
                    'iva'             => $c->iva,
                    'total'           => $c->total,
                    'fecha_creacion'  => $c->fecha_creacion,
                ];
            });

        return response()->json([
            'status' => HTTPStatus::Success,
            'consumos'   => $consumos
        ]);
    }

    //Funcion para registrar uno o varios consumos segun el precio_unitario que se encuentra en la tabla inventarios y calcular el iva segun la configuracion del sistema

    public function registrarConsumos(RegistrarConsumosRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumos = $request->validated()['consumos'];
            $reserva_id = $request->reserva_id;

            // Obtener la reserva y la nacionalidad del huésped
            $reserva = Reserva::findOrFail($reserva_id);
            $huesped = Huesped::findOrFail($reserva->huesped_id);

            // Obtener la tasa de IVA activa
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();

            // Determinar tasa de IVA según nacionalidad
            $nacionalidad = $huesped->nacionalidad; // ECUATORIANO o EXTRANJERO
            if ($nacionalidad === 'ECUATORIANO') {
                $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;
            } else {
                $tasa_iva = 0;
            }

            $consumosProcesados = [];

            foreach ($consumos as $c) {
                $cantidadNueva = $c['cantidad'];

                // Buscar si ya existe un consumo con la misma reserva e inventario
                $consumo = Consumo::where('reserva_id', $reserva_id)
                    ->where('inventario_id', $c['inventario_id'])
                    ->first();

                $inventario = Inventario::findOrFail($c['inventario_id']);
                $precioUnitario = $inventario->precio_unitario;

                if ($consumo) {
                    // ========== ACTUALIZAR CONSUMO EXISTENTE ==========
                    $cantidadAnterior = $consumo->cantidad;
                    $cantidadFinal = $cantidadAnterior + $cantidadNueva;

                    if ($cantidadFinal <= 0) {
                        // Si la cantidad final es 0 o menos, devolver al inventario
                        if (!$inventario->sin_stock) {
                            $inventario->registrarEntrada(
                                cantidad: abs($cantidadAnterior),
                                motivo: 'Devolución de consumo eliminado',
                                observaciones: "Consumo ID: {$consumo->id} - Reserva: {$reserva->codigo_reserva}",
                                usuarioId: Auth::id()
                            );
                        }

                        $consumo->delete();
                        continue;
                    }

                    // Calcular diferencia para ajustar inventario
                    $diferenciaCantidad = $cantidadNueva; // Puede ser positiva o negativa

                    // Registrar movimiento de inventario según la diferencia
                    if ($diferenciaCantidad > 0 && !$inventario->sin_stock) {
                        // Aumentó el consumo = salida de inventario
                        $inventario->registrarSalida(
                            cantidad: $diferenciaCantidad,
                            motivo: 'Consumo adicional en reserva',
                            observaciones: "Consumo ID: {$consumo->id} - Reserva: {$reserva->codigo_reserva} - Huésped: {$huesped->nombres} {$huesped->apellidos}",
                            reservaId: $reserva_id,
                            consumoId: $consumo->id,
                            usuarioId: Auth::id()
                        );
                    } elseif ($diferenciaCantidad < 0 && !$inventario->sin_stock) {
                        // Disminuyó el consumo = devolución al inventario
                        $inventario->registrarEntrada(
                            cantidad: abs($diferenciaCantidad),
                            motivo: 'Corrección de consumo (devolución)',
                            observaciones: "Consumo ID: {$consumo->id} - Reserva: {$reserva->codigo_reserva}",
                            usuarioId: Auth::id()
                        );
                    }

                    // Actualizar el consumo
                    $consumo->cantidad = $cantidadFinal;
                    $consumo->subtotal = $cantidadFinal * $precioUnitario;
                    $consumo->tasa_iva = $tasa_iva;
                    $consumo->iva = $consumo->subtotal * ($tasa_iva / 100);
                    $consumo->total = $consumo->iva + $consumo->subtotal;
                    $consumo->aplica_iva = $tasa_iva > 0 ? true : false;
                    $consumo->save();

                    $consumosProcesados[] = $consumo;
                } else {
                    // ========== CREAR NUEVO CONSUMO ==========

                    // Verificar stock disponible (solo si maneja stock)
                    if (!$inventario->sin_stock && $inventario->stock < $cantidadNueva) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Solicitado: {$cantidadNueva}");
                    }

                    $subtotal = $cantidadNueva * $precioUnitario;
                    $iva = $subtotal * ($tasa_iva / 100);
                    $total = $iva + $subtotal;
                    $aplica_iva = $tasa_iva > 0 ? true : false;

                    $nuevoConsumo = Consumo::create([
                        'reserva_id'      => $reserva_id,
                        'inventario_id'   => $c['inventario_id'],
                        'cantidad'        => $cantidadNueva,
                        'fecha_creacion'  => now(),
                        'subtotal'        => $subtotal,
                        'tasa_iva'        => $tasa_iva,
                        'iva'             => $iva,
                        'total'           => $total,
                        'aplica_iva'      => $aplica_iva,
                    ]);

                    // Registrar salida de inventario (solo si maneja stock)
                    if (!$inventario->sin_stock) {
                        $inventario->registrarSalida(
                            cantidad: $cantidadNueva,
                            motivo: 'Consumo en reserva',
                            observaciones: "Consumo ID: {$nuevoConsumo->id} - Reserva: {$reserva->codigo_reserva} - Huésped: {$huesped->nombres} {$huesped->apellidos}",
                            reservaId: $reserva_id,
                            consumoId: $nuevoConsumo->id,
                            usuarioId: Auth::id()
                        );
                    }

                    $consumosProcesados[] = $nuevoConsumo;
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data'   => $consumosProcesados,
                'mensaje' => 'Consumos registrados correctamente'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function update(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumo = Consumo::find($id);

            if (!$consumo) {
                return response()->json([
                    'status' => 'error',
                    'msg'    => 'Consumo no encontrado'
                ], 404);
            }

            $cantidadAnterior = $consumo->cantidad;
            $cantidadNueva = $request->cantidad;
            $diferencia = $cantidadNueva - $cantidadAnterior;

            // Obtener inventario
            $inventario = Inventario::findOrFail($request->inventario_id);

            // Verificar si cambió el inventario_id
            $cambioInventario = $consumo->inventario_id !== $request->inventario_id;

            if ($cambioInventario) {
                // ========== CAMBIÓ EL PRODUCTO ==========

                // Devolver al inventario anterior (solo si maneja stock)
                $inventarioAnterior = Inventario::findOrFail($consumo->inventario_id);
                if (!$inventarioAnterior->sin_stock) {
                    $inventarioAnterior->registrarEntrada(
                        cantidad: $cantidadAnterior,
                        motivo: 'Corrección de consumo (cambio de producto)',
                        observaciones: "Consumo ID: {$consumo->id} - Se cambió a otro producto",
                        usuarioId: Auth::id()
                    );
                }

                // Descontar del nuevo inventario (solo si maneja stock)
                if (!$inventario->sin_stock) {
                    if ($inventario->stock < $cantidadNueva) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Solicitado: {$cantidadNueva}");
                    }

                    $inventario->registrarSalida(
                        cantidad: $cantidadNueva,
                        motivo: 'Corrección de consumo (nuevo producto)',
                        observaciones: "Consumo ID: {$consumo->id} - Cambio de producto",
                        reservaId: $consumo->reserva_id,
                        consumoId: $consumo->id,
                        usuarioId: Auth::id()
                    );
                }
            } else {
                // ========== MISMO PRODUCTO, CAMBIÓ LA CANTIDAD ==========

                if ($diferencia > 0 && !$inventario->sin_stock) {
                    // Aumentó la cantidad = salida adicional
                    if ($inventario->stock < $diferencia) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}, Solicitado: {$diferencia}");
                    }

                    $inventario->registrarSalida(
                        cantidad: $diferencia,
                        motivo: 'Ajuste de consumo (aumento)',
                        observaciones: "Consumo ID: {$consumo->id} - Cantidad anterior: {$cantidadAnterior}, Nueva: {$cantidadNueva}",
                        reservaId: $consumo->reserva_id,
                        consumoId: $consumo->id,
                        usuarioId: Auth::id()
                    );
                } elseif ($diferencia < 0 && !$inventario->sin_stock) {
                    // Disminuyó la cantidad = devolución
                    $inventario->registrarEntrada(
                        cantidad: abs($diferencia),
                        motivo: 'Ajuste de consumo (devolución)',
                        observaciones: "Consumo ID: {$consumo->id} - Cantidad anterior: {$cantidadAnterior}, Nueva: {$cantidadNueva}",
                        usuarioId: Auth::id()
                    );
                }
            }

            // Obtener la tasa de IVA activa
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;

            // Obtener Precio Unitario del producto
            $precioUnitario = $inventario->precio_unitario;

            // Actualizar el consumo
            $consumo->inventario_id = $request->inventario_id;
            $consumo->cantidad = $cantidadNueva;
            $consumo->subtotal = $cantidadNueva * $precioUnitario;
            $consumo->tasa_iva = $tasa_iva;
            $consumo->iva = $consumo->subtotal * ($tasa_iva / 100);
            $consumo->total = $consumo->iva + $consumo->subtotal;
            $consumo->aplica_iva = $tasa_iva > 0 ? true : false;
            $consumo->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'msg' => 'Consumo actualizado correctamente',
                'data' => $consumo
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    function delete(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $consumo = Consumo::find($id);

            if (!$consumo) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            // Buscar al usuario con ese DNI
            $user = User::where('dni', $request->dni)->where('activo', 1)->first();

            // Validar existencia y rol GERENTE
            if (!$user || !$user->hasRole('GERENTE')) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'El DNI no corresponde a un usuario con rol GERENTE o no existe.'
                ], 403);
            }

            // Obtener inventario relacionado
            $inventario = Inventario::find($consumo->inventario_id);

            // Devolver stock al inventario si corresponde
            if ($inventario && !$inventario->sin_stock && $consumo->cantidad > 0) {
                $inventario->registrarEntrada(
                    cantidad: $consumo->cantidad,
                    motivo: 'Devolución por eliminación de consumo',
                    observaciones: "Consumo ID: {$consumo->id} eliminado por el usuario {$user->name} (GERENTE)",
                    usuarioId: $user->id
                );
            }

            // Eliminar el consumo
            $consumo->delete();

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Eliminado,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
