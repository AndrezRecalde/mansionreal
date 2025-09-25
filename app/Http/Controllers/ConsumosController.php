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
use App\Models\Inventario;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
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
            // Obtener la tasa de IVA activa
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;

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
                    // Actualizar consumo existente
                    $cantidadFinal = $consumo->cantidad + $cantidadNueva;

                    if ($cantidadFinal <= 0) {
                        // Opcional: eliminar el consumo si la cantidad llega a 0 o menos
                        $consumo->delete();
                        continue;
                    }

                    $consumo->cantidad = $cantidadFinal;
                    $consumo->subtotal = $cantidadFinal * $precioUnitario;
                    $consumo->tasa_iva = $tasa_iva;
                    $consumo->iva = $consumo->subtotal * ($tasa_iva / 100);
                    $consumo->total = $consumo->iva + $consumo->subtotal;
                    $consumo->aplica_iva = $tasa_iva > 0 ? true : false;
                    $consumo->save();

                    $consumosProcesados[] = $consumo;
                } else {
                    // Crear nuevo consumo
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

                    $consumosProcesados[] = $nuevoConsumo;
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data'   => $consumosProcesados
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
        try {
            $consumo = Consumo::find($id);

            if (!$consumo) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }

            //$consumo->fill($request->validated());
            // Obtener la tasa de IVA activa
            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 0;

            /* Obtener Precio Unitario del producto */
            $inventario = Inventario::findOrFail($request->inventario_id);
            $precioUnitario = $inventario->precio_unitario;

            $consumo->cantidad = $request->cantidad;
            $consumo->subtotal = $request->cantidad * $precioUnitario;
            $consumo->tasa_iva = $tasa_iva;
            $consumo->iva      = $consumo->subtotal * ($tasa_iva / 100);
            $consumo->total = $consumo->iva + $consumo->subtotal;
            $consumo->aplica_iva = $tasa_iva > 0 ? true : false;
            $consumo->save();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Actualizado
            ]);
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

            // Eliminar el consumo
            $consumo->delete();

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
}
