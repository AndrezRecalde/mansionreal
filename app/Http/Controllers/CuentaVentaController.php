<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Models\CuentaVenta;
use App\Models\Consumo;
use App\Models\Pago;
use App\Models\Estado;
use App\Models\Inventario;
use App\Models\ConfiguracionIva;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CuentaVentaController extends Controller
{
    /**
     * Listar cuentas de venta según rol y filtros
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $isRestricted = $user && !$user->hasRole(['ADMINISTRADOR', 'GERENTE']);

            // Si filtran por un estado específico, aplicamos la consulta normal
            if ($request->has('estado_id')) {
                $query = CuentaVenta::with(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']);
                if ($isRestricted) {
                    $query->where('usuario_id', $user->id);
                }
                $query->where('estado_id', $request->estado_id);
                $cuentas = $query->orderBy('created_at', 'desc')->get();
            }
            else {
                // Si no hay filtro, traemos TODAS las pendientes y sólo las ULTIMAS 20 pagadas
                $pendientesQuery = CuentaVenta::with(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura'])
                    ->whereHas('estado', function ($q) {
                    $q->where('nombre_estado', 'PENDIENTE');
                });

                $pagadasQuery = CuentaVenta::with(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura'])
                    ->whereHas('estado', function ($q) {
                    $q->where('nombre_estado', 'PAGADO');
                });

                if ($isRestricted) {
                    $pendientesQuery->where('usuario_id', $user->id);
                    $pagadasQuery->where('usuario_id', $user->id);
                }

                $pendientes = $pendientesQuery->orderBy('created_at', 'desc')->get();
                $pagadas = $pagadasQuery->orderBy('updated_at', 'desc')->limit(40)->get();

                $cuentas = $pendientes->merge($pagadas);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuentas' => $cuentas,
            ], 200);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear nueva cuenta de venta
     */
    public function store(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Generar código único: e.g. VM-A3F2
            $codigo = 'VM-' . strtoupper(Str::random(4));
            while (CuentaVenta::where('codigo', $codigo)->exists()) {
                $codigo = 'VM-' . strtoupper(Str::random(4));
            }

            $estadoPendiente = Estado::where('tipo_estado', 'PAGO')
                ->where('nombre_estado', 'PENDIENTE')
                ->firstOrFail();

            $cuenta = CuentaVenta::create([
                'codigo' => $codigo,
                'estado_id' => $estadoPendiente->id,
                'usuario_id' => Auth::id(),
                'subtotal' => 0,
                'total_descuentos' => 0,
                'total_iva' => 0,
                'total' => 0,
                'total_pagos' => 0,
                'saldo_pendiente' => 0,
            ]);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos', 'pagos']),
            ], 201);
        }
        catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener una cuenta específica
     */
    public function show($id): JsonResponse
    {
        try {
            $cuenta = CuentaVenta::with(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura'])
                ->findOrFail($id);
            return response()->json([
                'status' => HTTPStatus::Success,
                'cuenta' => $cuenta,
            ], 200);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Recalcular totales de la cuenta (Helper function)
     */
    private function recalcularTotales(CuentaVenta $cuenta)
    {
        $consumos = $cuenta->consumos()->get();
        $pagos = $cuenta->pagos()->get();

        $subtotal = $consumos->sum('subtotal');
        $iva = $consumos->sum('iva');
        $total = $consumos->sum('total');
        $totalPagos = $pagos->sum('monto');

        $cuenta->update([
            'subtotal' => $subtotal,
            'total_iva' => $iva,
            'total' => $total,
            'total_pagos' => $totalPagos,
            'saldo_pendiente' => round($total - $totalPagos, 2),
        ]);

        return $cuenta;
    }

    /**
     * Agregar consumos a la cuenta
     */
    public function agregarConsumos(Request $request, $id): JsonResponse
    {
        $request->validate([
            'consumos' => 'required|array',
            'consumos.*.inventario_id' => 'required|integer|exists:inventarios,id',
            'consumos.*.cantidad' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $cuenta = CuentaVenta::findOrFail($id);

            // Verificar estado
            if ($cuenta->estado->nombre_estado !== 'PENDIENTE') {
                throw new \Exception("La cuenta ya está pagada o cerrada.");
            }

            $ivaConfig = ConfiguracionIva::where('activo', true)->first();
            $tasa_iva = $ivaConfig ? $ivaConfig->tasa_iva : 15.00;

            foreach ($request->consumos as $c) {
                $inventario = Inventario::findOrFail($c['inventario_id']);
                $cantidad_agregar = $c['cantidad'];
                $precio_unitario = $inventario->precio_unitario;

                // Buscar si ya existe este producto en la cuenta
                $consumoExistente = Consumo::where('cuenta_venta_id', $cuenta->id)
                    ->where('inventario_id', $inventario->id)
                    ->first();

                if ($consumoExistente) {
                    $nueva_cantidad = $consumoExistente->cantidad + $cantidad_agregar;
                    $subtotal = $nueva_cantidad * $precio_unitario;
                    $iva = $subtotal * ($tasa_iva / 100);
                    $total = $subtotal + $iva;

                    $consumoExistente->update([
                        'cantidad' => $nueva_cantidad,
                        'subtotal' => $subtotal,
                        'tasa_iva' => $tasa_iva,
                        'iva' => $iva,
                        'total' => $total,
                        'actualizado_por_usuario_id' => Auth::id(),
                    ]);
                }
                else {
                    $subtotal = $cantidad_agregar * $precio_unitario;
                    $iva = $subtotal * ($tasa_iva / 100);
                    $total = $subtotal + $iva;

                    $consumoExistente = Consumo::create([
                        'cuenta_venta_id' => $cuenta->id,
                        'reserva_id' => null,
                        'inventario_id' => $inventario->id,
                        'cantidad' => $cantidad_agregar,
                        'fecha_creacion' => now(),
                        'subtotal' => $subtotal,
                        'tasa_iva' => $tasa_iva,
                        'iva' => $iva,
                        'total' => $total,
                        'descuento' => 0,
                        'tipo_descuento' => Consumo::TIPO_DESCUENTO_SIN_DESCUENTO,
                        'creado_por_usuario_id' => Auth::id(),
                    ]);
                }

                // Descontar stock
                if (!$inventario->sin_stock) {
                    if ($inventario->stock < $cantidad_agregar) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}");
                    }
                    $inventario->registrarSalida(
                        $cantidad_agregar,
                        'Venta de mostrador cuenta ' . $cuenta->codigo,
                        null,
                        null,
                        $consumoExistente->id,
                        Auth::id()
                    );
                }
            }

            $this->recalcularTotales($cuenta);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']),
            ], 200);

        }
        catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar cantidad de un consumo
     */
    public function actualizarConsumo(Request $request, $id, $consumoId): JsonResponse
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $cuenta = CuentaVenta::findOrFail($id);
            if ($cuenta->estado->nombre_estado !== 'PENDIENTE') {
                throw new \Exception("La cuenta ya está pagada o cerrada.");
            }

            $consumo = Consumo::where('cuenta_venta_id', $cuenta->id)->findOrFail($consumoId);
            $inventario = $consumo->inventario;

            $cantidadAnterior = $consumo->cantidad;
            $cantidadNueva = $request->cantidad;
            $diferencia = $cantidadNueva - $cantidadAnterior;

            // Manejo de stock
            if (!$inventario->sin_stock) {
                if ($diferencia > 0) {
                    if ($inventario->stock < $diferencia) {
                        throw new \Exception("Stock insuficiente para {$inventario->nombre_producto}. Disponible: {$inventario->stock}");
                    }
                    $inventario->registrarSalida($diferencia, 'Actualización consumo cuenta ' . $cuenta->codigo, null, null, $consumo->id, Auth::id());
                }
                elseif ($diferencia < 0) {
                    $inventario->registrarEntrada(abs($diferencia), 'Actualización consumo (reducción) cuenta ' . $cuenta->codigo, "Consumo ID: " . $consumo->id, Auth::id());
                }
            }

            $precio_unitario = $inventario->precio_unitario;
            $subtotal = $cantidadNueva * $precio_unitario;
            $iva = $subtotal * ($consumo->tasa_iva / 100);

            $consumo->update([
                'cantidad' => $cantidadNueva,
                'subtotal' => $subtotal,
                'iva' => $iva,
                'total' => $subtotal + $iva,
                'actualizado_por_usuario_id' => Auth::id(),
            ]);

            $this->recalcularTotales($cuenta);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']),
            ], 200);
        }
        catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Aplicar descuento a un consumo específico
     */
    public function aplicarDescuentoConsumo(Request $request, $id, $consumoId): JsonResponse
    {
        try {
            DB::beginTransaction();

            $cuenta = CuentaVenta::findOrFail($id);

            // Verificar que no esté pagada o facturada
            if ($cuenta->estado->nombre_estado !== 'PENDIENTE') {
                throw new \Exception("Solo se pueden aplicar descuentos a cuentas PENDIENTES.");
            }

            $consumo = Consumo::where('cuenta_venta_id', $cuenta->id)->findOrFail($consumoId);

            // Obtenemos los valores
            $descuento = $request->descuento;
            $tipo_descuento = $request->tipo_descuento;
            $motivo_descuento = $request->motivo_descuento;
            $usuarioId = Auth::id();

            // Evitar problemas si falta el tipo
            if (!in_array($tipo_descuento, [Consumo::TIPO_DESCUENTO_MONTO_FIJO, Consumo::TIPO_DESCUENTO_PORCENTAJE])) {
                throw new \Exception("El tipo de descuento es inválido.");
            }

            // Aplicar el método del modelo Consumo
            $success = $consumo->aplicarDescuento(
                descuento: $descuento,
                tipo: $tipo_descuento,
                motivo: $motivo_descuento,
                usuarioId: $usuarioId
            );

            if (!$success) {
                throw new \Exception("No se pudo aplicar el descuento al consumo. Revise el monto total.");
            }

            // Recalculamos totales de la cuenta global
            $this->recalcularTotales($cuenta);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento aplicado correctamente',
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']),
            ], 200);

        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Remover descuento de un consumo específico
     */
    public function removerDescuentoConsumo(Request $request, $id, $consumoId): JsonResponse
    {
        try {
            DB::beginTransaction();

            $cuenta = CuentaVenta::findOrFail($id);

            // Verificar que no esté pagada
            if ($cuenta->estado->nombre_estado !== 'PENDIENTE') {
                throw new \Exception("No se puede remover el descuento porque la cuenta ya no está PENDIENTE.");
            }

            $consumo = Consumo::where('cuenta_venta_id', $cuenta->id)->findOrFail($consumoId);

            $success = $consumo->removerDescuento();

            if (!$success) {
                throw new \Exception("No se pudo remover el descuento (quizá el consumo ya está facturado).");
            }

            $this->recalcularTotales($cuenta);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Descuento removido correctamente',
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']),
            ], 200);

        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un consumo
     */
    public function eliminarConsumo($id, $consumoId): JsonResponse
    {
        try {
            DB::beginTransaction();

            $cuenta = CuentaVenta::findOrFail($id);
            if ($cuenta->estado->nombre_estado !== 'PENDIENTE') {
                throw new \Exception("La cuenta ya está pagada o cerrada.");
            }

            $consumo = Consumo::where('cuenta_venta_id', $cuenta->id)->findOrFail($consumoId);
            $inventario = $consumo->inventario;

            if (!$inventario->sin_stock) {
                $inventario->registrarEntrada($consumo->cantidad, 'Devolución de consumo cancelado cuenta ' . $cuenta->codigo, null, Auth::id());
            }

            $consumo->delete();

            $this->recalcularTotales($cuenta);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']),
            ], 200);
        }
        catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Registrar Pago
     */
    public function registrarPago(Request $request, $id): JsonResponse
    {
        $request->validate([
            'concepto_pago_id' => 'required|integer|exists:conceptos_pagos,id',
            'monto' => 'required|numeric|min:0.01',
            'metodo_pago' => 'required|in:EFECTIVO,TRANSFERENCIA,TARJETA,OTRO',
            'codigo_voucher' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $cuenta = CuentaVenta::findOrFail($id);
            if ($cuenta->estado->nombre_estado !== 'PENDIENTE') {
                throw new \Exception("La cuenta ya está pagada.");
            }

            // Validar no sobrepasar el saldo pendiente
            if ($request->monto > $cuenta->saldo_pendiente + 0.01) { // margen de error float
                throw new \Exception("El monto a pagar {$request->monto} no puede superar el saldo pendiente {$cuenta->saldo_pendiente}.");
            }

            Pago::create([
                'cuenta_venta_id' => $cuenta->id,
                'concepto_pago_id' => $request->concepto_pago_id,
                'monto' => $request->monto,
                'metodo_pago' => $request->metodo_pago,
                'codigo_voucher' => $request->codigo_voucher,
                'observaciones' => $request->observaciones,
                'fecha_pago' => now(),
                'usuario_creador_id' => Auth::id(),
            ]);

            $this->recalcularTotales($cuenta);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']),
            ], 201);
        }
        catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Cerrar cuenta (marcar pagada y enlazar factura si viene el ID)
     */
    public function cerrarCuenta(Request $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $cuenta = CuentaVenta::findOrFail($id);

            // Verificar si el saldo es 0
            if ($cuenta->saldo_pendiente > 0.01) {
                throw new \Exception("No se puede cerrar la cuenta. Hay un saldo pendiente de " . $cuenta->saldo_pendiente);
            }

            // Cambiar estado a PAGADO
            $estadoPagado = Estado::where('tipo_estado', 'PAGO')
                ->where('nombre_estado', 'PAGADO')
                ->firstOrFail();

            $cuenta->estado_id = $estadoPagado->id;

            if ($request->has('factura_id') && $request->factura_id) {
                $cuenta->factura_id = $request->input('factura_id');
            }

            $cuenta->save();

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuenta' => $cuenta->load(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']),
            ], 200);

        }
        catch (\Throwable $th) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Excepción en cerrarCuenta: ' . $th->getMessage() . ' ' . $th->getTraceAsString());
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Historial de cuentas de venta con filtros. Exclusivo para ADMINISTRADOR y GERENTE.
     */
    public function historial(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user || !$user->hasRole(['ADMINISTRADOR', 'GERENTE'])) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No autorizado para ver el historial',
                ], 403);
            }

            $p_fecha_inicio = $request->p_fecha_inicio;
            $p_fecha_fin = $request->p_fecha_fin;
            $p_anio = $request->p_anio;

            $query = CuentaVenta::with(['estado', 'usuario', 'consumos.inventario', 'pagos', 'factura']);

            if ($p_fecha_inicio && $p_fecha_fin) {
                $query->whereBetween('updated_at', [$p_fecha_inicio . ' 00:00:00', $p_fecha_fin . ' 23:59:59']);
            }
            elseif ($p_fecha_inicio) {
                $query->whereDate('updated_at', '>=', $p_fecha_inicio);
            }
            elseif ($p_fecha_fin) {
                $query->whereDate('updated_at', '<=', $p_fecha_fin);
            }
            elseif ($p_anio) {
                $query->whereYear('updated_at', $p_anio);
            }
            else {
                $query->whereYear('updated_at', date('Y'));
            }

            $cuentas = $query->orderBy('updated_at', 'desc')->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'cuentas' => $cuentas,
            ], 200);

        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }
}
