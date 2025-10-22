<?php

namespace App\Observers;

use App\Models\Inventario;
use App\Models\MovimientoInventario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class InventarioObserver
{
    // Variables temporales fuera del modelo
    private static $movimientosTemporales = [];

    /**
     * Handle the Inventario "updating" event.
     * Se ejecuta ANTES de guardar los cambios
     */
    public function updating(Inventario $inventario): void
    {
        // Verificar si el stock está cambiando
        if ($inventario->isDirty('stock')) {
            $stockAnterior = $inventario->getOriginal('stock');
            $stockNuevo = $inventario->stock;
            $diferencia = $stockNuevo - $stockAnterior;

            // Guardar en array estático temporal (NO en el modelo)
            self::$movimientosTemporales[$inventario->id] = [
                'stock_anterior' => $stockAnterior,
                'diferencia' => $diferencia,
            ];

            // Actualizar estado activo según stock (solo si no es sin_stock)
            if (!$inventario->sin_stock) {
                $estadoAnterior = $inventario->getOriginal('activo');

                if ($stockNuevo <= 0) {
                    $inventario->activo = false;
                } else if ($stockNuevo > 0 && $stockAnterior <= 0) {
                    // Solo activar si venía de stock 0 y ahora tiene stock
                    $inventario->activo = true;
                }

                // Log del cambio de estado
                if ($estadoAnterior !== $inventario->activo) {
                    Log::info("Inventario ID {$inventario->id} - Estado cambiado automáticamente", [
                        'producto' => $inventario->nombre_producto,
                        'stock_anterior' => $stockAnterior,
                        'stock_nuevo' => $stockNuevo,
                        'estado_anterior' => $estadoAnterior ? 'activo' : 'inactivo',
                        'estado_nuevo' => $inventario->activo ? 'activo' : 'inactivo',
                    ]);
                }
            }
        }
    }

    /**
     * Handle the Inventario "saved" event.
     * Se ejecuta DESPUÉS de guardar los cambios exitosamente
     */
    public function saved(Inventario $inventario): void
    {
        // Verificar si existen datos temporales para este inventario
        if (isset(self::$movimientosTemporales[$inventario->id])) {
            $datos = self::$movimientosTemporales[$inventario->id];
            $diferencia = $datos['diferencia'];
            $stockAnterior = $datos['stock_anterior'];

            // Solo registrar si no es sin_stock
            if (!$inventario->sin_stock) {
                // Determinar tipo de movimiento
                $tipoMovimiento = $diferencia > 0 ? 'entrada' : 'salida';

                // Generar observaciones según el cambio de estado
                $observaciones = null;
                if ($inventario->activo && $stockAnterior <= 0) {
                    $observaciones = 'Producto activado automáticamente por tener stock';
                } else if (!$inventario->activo && $inventario->stock <= 0) {
                    $observaciones = 'Producto desactivado automáticamente por falta de stock';
                }

                MovimientoInventario::create([
                    'inventario_id' => $inventario->id,
                    'tipo_movimiento' => $tipoMovimiento,
                    'cantidad' => $diferencia,
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $inventario->stock,
                    'motivo' => 'Actualización automática de stock',
                    'observaciones' => $observaciones,
                    'usuario_id' => Auth::id(),
                    'fecha_movimiento' => now()
                ]);
            }

            // Limpiar los datos temporales
            unset(self::$movimientosTemporales[$inventario->id]);
        }
    }
}
