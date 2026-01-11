<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class ReservaClienteFacturacion extends Model
{
    protected $table = 'reserva_cliente_facturacion';

    protected $fillable = [
        'reserva_id',
        'cliente_facturacion_id',
        'solicita_factura_detallada',
        'usuario_asigno_id',
    ];

    protected $casts = [
        'solicita_factura_detallada' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ====================================================================
    // RELACIONES
    // ====================================================================

    /**
     * Reserva asociada
     */
    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class);
    }

    /**
     * Cliente de facturación
     */
    public function clienteFacturacion(): BelongsTo
    {
        return $this->belongsTo(ClienteFacturacion::class, 'cliente_facturacion_id');
    }

    /**
     * Usuario que asignó el cliente
     */
    public function usuarioAsigno(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_asigno_id');
    }

    // ====================================================================
    // ACCESSORS
    // ====================================================================

    /**
     * Verificar si es consumidor final
     */
    public function getEsConsumidorFinalAttribute(): bool
    {
        return $this->cliente_facturacion_id === ClienteFacturacion::CONSUMIDOR_FINAL_ID
            || ! $this->solicita_factura_detallada;
    }

    // ====================================================================
    // SCOPES
    // ====================================================================

    /**
     * Scope:  Solo facturas detalladas
     */
    public function scopeConFacturaDetallada($query)
    {
        return $query->where('solicita_factura_detallada', true);
    }

    /**
     * Scope: Solo consumidores finales
     */
    public function scopeConsumidoresFinales($query)
    {
        return $query->where('solicita_factura_detallada', false);
    }
}
