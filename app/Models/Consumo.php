<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consumo extends Model
{
    protected $fillable = [
        'reserva_id',
        'factura_id',
        'inventario_id',
        'cantidad',
        'fecha_creacion',
        'subtotal',
        'tasa_iva',
        'iva',
        'total',
        'creado_por_usuario_id',
        'actualizado_por_usuario_id',
    ];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }

    public function inventario()
    {
        return $this->belongsTo(Inventario::class);
    }

    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'factura_id');
    }

    // ====================================================================
    // ACCESSORS
    // ====================================================================

    /**
     * Verificar si el consumo ya fue facturado
     */
    public function getEstaFacturadoAttribute(): bool
    {
        return $this->factura_id !== null;
    }

    /**
     * Verificar si está pendiente de facturar
     */
    public function getPendienteFacturarAttribute(): bool
    {
        return $this->factura_id === null;
    }

    public function getUsuarioCreadorAttribute(): string
    {
        $usuario = User::find($this->creado_por_usuario_id);
        return $usuario ? $usuario->nombres_completos : 'Desconocido';
    }

    public function getUsuarioActualizadorAttribute(): string
    {
        $usuario = User::find($this->actualizado_por_usuario_id);
        return $usuario ? $usuario->nombres_completos : 'Desconocido';
    }

    // ====================================================================
    // SCOPES
    // ====================================================================

    /**
     * Scope:  Consumos facturados
     */
    public function scopeFacturados($query)
    {
        return $query->whereNotNull('factura_id');
    }

    /**
     * Scope: Consumos pendientes de facturar
     */
    public function scopePendientesFacturar($query)
    {
        return $query->whereNull('factura_id');
    }

    /**
     * Scope: Consumos de una factura específica
     */
    public function scopeDeFactura($query, int $facturaId)
    {
        return $query->where('factura_id', $facturaId);
    }

    /**
     * Scope: Consumos de una reserva específica
     */
    public function scopeDeReserva($query, int $reservaId)
    {
        return $query->where('reserva_id', $reservaId);
    }

    // ====================================================================
    // MÉTODOS DE INSTANCIA
    // ====================================================================

    /**
     * Asignar a una factura
     */
    public function asignarFactura(int $facturaId): bool
    {
        if ($this->esta_facturado) {
            return false; // Ya está facturado
        }

        $this->factura_id = $facturaId;
        return $this->save();
    }

    /**
     * Desasignar de factura (solo si la factura está anulada)
     */
    public function desasignarFactura(): bool
    {
        if (!$this->esta_facturado) {
            return false;
        }

        // Verificar que la factura esté anulada
        if ($this->factura && $this->factura->esta_emitida) {
            return false; // No se puede desasignar de factura emitida
        }

        $this->factura_id = null;
        return $this->save();
    }

    /* protected static function booted()
    {
        // Al crear un consumo, registrar el movimiento de inventario
        static::created(function ($consumo) {
            $inventario = $consumo->inventario;

            if ($inventario && !$inventario->sin_stock) {
                $inventario->registrarSalida(
                    cantidad: $consumo->cantidad,
                    motivo: 'Consumo en reserva',
                    observaciones: "Consumo ID: {$consumo->id}",
                    reservaId: $consumo->reserva_id,
                    consumoId: $consumo->id
                );
            }
        });
    } */
}
