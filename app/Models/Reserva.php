<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Reserva extends Model
{
    protected $fillable = [
        'codigo_reserva',
        'tipo_reserva',
        'huesped_id',
        'departamento_id',
        'fecha_checkin',
        'fecha_checkout',
        'total_noches',
        'estado_id',
        'fecha_creacion',
        'total_adultos',
        'total_ninos',
        'total_mascotas',
        'usuario_creador_id',
        'motivo_cancelacion',
        'observacion_cancelacion',
        'fecha_cancelacion',
        'usuario_cancelador_id',
    ];

    protected $casts = [
        'fecha_checkin' => 'datetime',      // Convierte a Carbon
        'fecha_checkout' => 'datetime',     // Convierte a Carbon
        'fecha_creacion' => 'datetime', // Convierte a Carbon con hora
    ];

    public function huesped()
    {
        return $this->belongsTo(Huesped::class);
    }

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class);
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class);
    }

    public function consumos(): HasMany
    {
        return $this->hasMany(Consumo::class);
    }

    public function gastos(): HasMany
    {
        return $this->hasMany(Gasto::class);
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(Pago::class, 'reserva_id');
    }

    public function usuarioCreador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_creador_id');
    }

    public function usuarioCancelador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_cancelador_id');
    }

    /**
     * Cliente de facturación asignado (uno solo)
     */
    public function clienteFacturacion(): HasOne
    {
        return $this->hasOne(ReservaClienteFacturacion::class);
    }

    /**
     * Factura generada
     */
    public function factura(): HasOne
    {
        return $this->hasOne(Factura::class);
    }

    public function scopeActivas(Builder $query)
    {
        return $query->whereHas('estado', function ($q) {
            $q->where('nombre_estado', '!=', 'CANCELADO');
        });
    }

    public function scopeCanceladas(Builder $query)
    {
        return $query->whereHas('estado', function ($q) {
            $q->where('nombre_estado', 'CANCELADO');
        });
    }


    public function scopeBuscarPorHuesped(Builder $query, $huespedId)
    {
        return $query->where('huesped_id', $huespedId);
    }

    public function scopeBuscarPorNumeroDepartamento(Builder $query, $numeroDepartamento)
    {
        return $query->whereHas('departamento', function (Builder $q) use ($numeroDepartamento) {
            $q->where('numero_departamento', 'like', '%' . $numeroDepartamento . '%');
        });
    }

    public function scopeEntreFechas(Builder $query, $inicio, $fin)
    {
        return $query->whereBetween('fecha_checkin', [$inicio, $fin]);
    }

    // Accessor para verificar si está cancelada
    public function getEstaCanceladaAttribute(): bool
    {
        return $this->estado?->nombre_estado === 'CANCELADO';
    }

    /** Scope para filtrar por rango de fechas */
    public function scopeFechaCheckin($query, $inicio, $fin)
    {
        if ($inicio && $fin) {
            return $query->whereBetween('fecha_checkin', [$inicio, $fin]);
        }
        return $query;
    }

    /** Scope para filtrar por código de reserva */
    public function scopeCodigoReserva($query, $codigo)
    {
        if ($codigo) {
            return $query->where('codigo_reserva', $codigo);
        }
        return $query;
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($reserva) {
            $reserva->codigo_reserva = now()->year
                . str_pad($reserva->id, 5, '0', STR_PAD_LEFT)
                . str_pad(rand(0, 99), 2, '0', STR_PAD_LEFT);

            $reserva->save();
        });
    }

    // ====================================================================
    // NUEVAS RELACIONES PARA FACTURACIÓN
    // ====================================================================

    /**
     * Cliente de facturación (relación muchos a muchos)
     */
    public function clientesFacturacion(): BelongsToMany
    {
        return $this->belongsToMany(
            ClienteFacturacion::class,
            'reserva_cliente_facturacion',
            'reserva_id',
            'cliente_facturacion_id'
        )->withPivot('solicita_factura_detallada', 'usuario_asigno_id')
            ->withTimestamps();
    }

    /**
     * Verificar si tiene factura generada
     */
    public function getTieneFacturaAttribute(): bool
    {
        return $this->factura()->exists();
    }

    /**
     * Verificar si tiene cliente de facturación asignado
     */
    public function getTieneClienteFacturacionAttribute(): bool
    {
        return $this->clienteFacturacion()->exists();
    }

    /**
     * Verificar si solicita factura detallada
     */
    public function getSolicitaFacturaDetalladaAttribute(): bool
    {
        $cliente = $this->clienteFacturacion;
        return $cliente && $cliente->solicita_factura_detallada;
    }

    /**
     * Verificar si es consumidor final
     */
    public function getEsConsumidorFinalAttribute(): bool
    {
        $cliente = $this->clienteFacturacion;
        return ! $cliente || ! $cliente->solicita_factura_detallada;
    }

    /**
     * Obtener total de consumos
     */
    public function getTotalConsumosAttribute(): float
    {
        return $this->consumos()->sum('total');
    }

    /**
     * Obtener consumos pendientes de facturar
     */
    public function getConsumosPendientesFacturarAttribute()
    {
        return $this->consumos()->pendientesFacturar()->get();
    }

    // ====================================================================
    // NUEVOS MÉTODOS DE INSTANCIA
    // ====================================================================

    /**
     * Asignar cliente de facturación
     */
    public function asignarClienteFacturacion(
        int $clienteFacturacionId,
        bool $solicitaFacturaDetallada = false,
        ?int $usuarioId = null
    ): ReservaClienteFacturacion {
        return $this->clienteFacturacion()->updateOrCreate(
            ['reserva_id' => $this->id],
            [
                'cliente_facturacion_id' => $clienteFacturacionId,
                'solicita_factura_detallada' => $solicitaFacturaDetallada,
                'usuario_asigno_id' => $usuarioId,
            ]
        );
    }

    /**
     * Asignar consumidor final
     */
    public function asignarConsumidorFinal(?int $usuarioId = null): ReservaClienteFacturacion
    {
        return $this->asignarClienteFacturacion(
            ClienteFacturacion::CONSUMIDOR_FINAL_ID,
            false,
            $usuarioId
        );
    }

    /**
     * Verificar si puede generar factura
     */
    public function puedeGenerarFactura(): bool
    {
        // Ya tiene factura
        if ($this->tiene_factura) {
            return false;
        }

        // No tiene consumos
        if ($this->consumos()->count() === 0) {
            return false;
        }

        // No tiene cliente asignado
        if (! $this->tiene_cliente_facturacion) {
            return false;
        }

        // Puedes agregar más validaciones (ej: estado de reserva)
        return true;
    }

    /**
     * Obtener total pendiente de facturar
     */
    public function totalPendienteFacturar(): float
    {
        return $this->consumos()->pendientesFacturar()->sum('total');
    }
}
