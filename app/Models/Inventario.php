<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class Inventario extends Model
{
    protected $fillable = [
        'nombre_producto',
        'descripcion',
        'precio_unitario',
        'sin_stock',
        'stock',
        'categoria_id',
        'activo',
    ];

    // Atributos que NO deben guardarse en la base de datos
    protected $guarded = [
        '_stock_anterior',
        '_diferencia_stock'
    ];

    protected $casts = [
        'sin_stock' => 'boolean',
        //'activo' => 'boolean',
    ];

    // Relación con movimientos
    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class, 'inventario_id');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function consumos()
    {
        return $this->hasMany(Consumo::class, 'inventario_id');
    }

    /**
     * Actualiza el estado activo según el stock
     */
    protected function actualizarEstadoSegunStock(): void
    {
        // Solo aplica para productos que manejan stock (sin_stock = false)
        if (!$this->sin_stock) {
            $estadoAnterior = $this->activo;

            if ($this->stock <= 0) {
                $this->activo = false;
            } else {
                $this->activo = true;
            }

            // Registrar en log si cambió el estado
            if ($estadoAnterior !== $this->activo) {
                Log::info("Inventario ID {$this->id} - Estado cambiado automáticamente", [
                    'producto' => $this->nombre_producto,
                    'stock' => $this->stock,
                    'estado_anterior' => $estadoAnterior ? 'activo' : 'inactivo',
                    'estado_nuevo' => $this->activo ? 'activo' : 'inactivo',
                ]);
            }
        }
    }

    /**
     * Override getDirty para excluir atributos temporales
     */
    public function getDirty()
    {
        $dirty = parent::getDirty();

        // Remover atributos temporales del dirty array
        unset($dirty['_stock_anterior']);
        unset($dirty['_diferencia_stock']);

        return $dirty;
    }

    /**
     * Registra una entrada de stock
     */
    public function registrarEntrada(
        int $cantidad,
        ?string $motivo = null,
        ?string $observaciones = null,
        ?int $usuarioId = null
    ) {
        return DB::transaction(function () use ($cantidad, $motivo, $observaciones, $usuarioId) {
            $stockAnterior = $this->stock;
            $this->stock += $cantidad;

            // Actualizar estado según stock
            $this->actualizarEstadoSegunStock();

            $this->save();

            return MovimientoInventario::create([
                'inventario_id' => $this->id,
                'tipo_movimiento' => 'entrada',
                'cantidad' => $cantidad,
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $this->stock,
                'motivo' => $motivo ?? 'Entrada de stock',
                'observaciones' => $observaciones,
                'usuario_id' => $usuarioId ?? Auth::id(),
                'fecha_movimiento' => now()
            ]);
        });
    }

    /**
     * Registra una salida de stock
     */
    public function registrarSalida(
        int $cantidad,
        ?string $motivo = null,
        ?string $observaciones = null,
        ?int $reservaId = null,
        ?int $consumoId = null,
        ?int $usuarioId = null
    ) {
        return DB::transaction(function () use ($cantidad, $motivo, $observaciones, $reservaId, $consumoId, $usuarioId) {
            if ($this->stock < $cantidad && !$this->sin_stock) {
                throw new \Exception('Stock insuficiente');
            }

            $stockAnterior = $this->stock;
            $this->stock -= $cantidad;

            // Actualizar estado según stock
            $this->actualizarEstadoSegunStock();

            $this->save();

            return MovimientoInventario::create([
                'inventario_id' => $this->id,
                'tipo_movimiento' => 'salida',
                'cantidad' => -$cantidad, // Negativo para salidas
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $this->stock,
                'motivo' => $motivo ?? 'Salida de stock',
                'observaciones' => $observaciones,
                'reserva_id' => $reservaId,
                'consumo_id' => $consumoId,
                'usuario_id' => $usuarioId ?? Auth::id(),
                'fecha_movimiento' => now()
            ]);
        });
    }

    /**
     * Registra un ajuste de stock (corrección manual)
     */
    public function registrarAjuste(
        int $nuevoStock,
        string $motivo,
        ?string $observaciones = null,
        ?int $usuarioId = null
    ) {
        return DB::transaction(function () use ($nuevoStock, $motivo, $observaciones, $usuarioId) {
            $stockAnterior = $this->stock;
            $diferencia = $nuevoStock - $stockAnterior;
            $this->stock = $nuevoStock;

            // Actualizar estado según stock
            $this->actualizarEstadoSegunStock();

            $this->save();

            return MovimientoInventario::create([
                'inventario_id' => $this->id,
                'tipo_movimiento' => 'ajuste',
                'cantidad' => $diferencia,
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $this->stock,
                'motivo' => $motivo,
                'observaciones' => $observaciones,
                'usuario_id' => $usuarioId ?? Auth::id(),
                'fecha_movimiento' => now()
            ]);
        });
    }

    public function scopePorCategoria(Builder $query, $categoriaId)
    {
        if ($categoriaId) {
            return $query->where('i.categoria_id', $categoriaId);
        }
        return $query;
    }

    public function scopePorNombreProducto(Builder $query, $nombre_producto)
    {
        if ($nombre_producto) {
            return $query->where('i.nombre_producto', 'like', '%' . $nombre_producto . '%');
        }
        return $query;
    }

    public function scopeBuscarActivos(Builder $query, $activo)
    {
        if ($activo) {
            return $query->where('i.activo', $activo);
        }
        return $query;
    }
}
