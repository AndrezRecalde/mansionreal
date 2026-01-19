<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ClienteFacturacion extends Model
{
    protected $table = 'clientes_facturacion';

    protected $fillable = [
        'tipo_cliente',
        'tipo_identificacion',
        'identificacion',
        'nombres_completos',
        'direccion',
        'telefono',
        'email',
        'activo',
        'observaciones',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ====================================================================
    // CONSTANTES
    // ====================================================================
    const CONSUMIDOR_FINAL_ID = 1;
    const CONSUMIDOR_FINAL_IDENTIFICACION = '9999999999999';

    const TIPO_CLIENTE_CONSUMIDOR_FINAL = 'CONSUMIDOR_FINAL';
    const TIPO_CLIENTE_REGISTRADO = 'CLIENTE_REGISTRADO';

    const TIPO_IDENTIFICACION_CEDULA = 'CEDULA';
    const TIPO_IDENTIFICACION_RUC = 'RUC';
    const TIPO_IDENTIFICACION_PASAPORTE = 'PASAPORTE';
    const TIPO_IDENTIFICACION_CF = 'CF';

    // ====================================================================
    // RELACIONES
    // ====================================================================

    /**
     * Facturas del cliente
     */
    public function facturas(): HasMany
    {
        return $this->hasMany(Factura::class, 'cliente_facturacion_id');
    }

    /**
     * Reservas asociadas (relación muchos a muchos)
     */
    public function reservas(): BelongsToMany
    {
        return $this->belongsToMany(Reserva::class, 'reserva_cliente_facturacion', 'cliente_facturacion_id', 'reserva_id')
            ->withPivot('solicita_factura_detallada', 'usuario_asigno_id')
            ->withTimestamps();
    }

    /**
     * Tabla pivote directa
     */
    public function reservasCliente(): HasMany
    {
        return $this->hasMany(ReservaClienteFacturacion::class, 'cliente_facturacion_id');
    }

     // ====================================================================
    // ACCESSORS
    // ====================================================================

    /**
     * Obtener nombre completo del cliente
     */
    public function getNombreCompletoAttribute(): string
    {
        return trim($this->nombres_completos);
    }

    /**
     * Verificar si es consumidor final
     */
    public function getEsConsumidorFinalAttribute(): bool
    {
        return $this->id === self::CONSUMIDOR_FINAL_ID
            || $this->tipo_cliente === self::TIPO_CLIENTE_CONSUMIDOR_FINAL;
    }

    /**
     * Obtener identificación formateada
     */
    public function getIdentificacionFormateadaAttribute(): string
    {
        if ($this->es_consumidor_final) {
            return 'CONSUMIDOR FINAL';
        }

        return $this->tipo_identificacion . ':  ' . $this->identificacion;
    }

     // ====================================================================
    // SCOPES
    // ====================================================================

    /**
     * Scope:  Solo clientes activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope: Solo clientes registrados (excluye consumidor final)
     */
    public function scopeRegistrados($query)
    {
        return $query->where('tipo_cliente', self::TIPO_CLIENTE_REGISTRADO);
    }

    /**
     * Scope:  Obtener consumidor final
     */
    public function scopeConsumidorFinal($query)
    {
        return $query->where('id', self::CONSUMIDOR_FINAL_ID);
    }

    /**
     * Scope:  Buscar por identificación
     */
    public function scopeBuscar($query, string $termino)
    {
        return $query->where(function ($q) use ($termino) {
            $q->where('identificacion', 'like', "%{$termino}%")
                ->orWhere('nombres_completos', 'like', "%{$termino}%");
        });
    }

    /**
     * Scope: Buscar por nombre (nombres completos)
     */
    public function scopeBuscarPorNombre($query, string $nombre)
    {
        return $query->where(function ($q) use ($nombre) {
            $q->where('nombres_completos', 'like', "%{$nombre}%");
        });
    }

     // ====================================================================
    // MÉTODOS ESTÁTICOS
    // ====================================================================

    /**
     * Obtener instancia del CONSUMIDOR FINAL
     */
    public static function consumidorFinal(): ?ClienteFacturacion
    {
        return static::find(self::CONSUMIDOR_FINAL_ID);
    }

    /**
     * Buscar o crear cliente por identificación
     */
    public static function buscarOCrear(array $datos): ClienteFacturacion
    {
        return static::firstOrCreate(
            ['identificacion' => $datos['identificacion']],
            $datos
        );
    }

     // ====================================================================
    // MÉTODOS DE INSTANCIA
    // ====================================================================

    /**
     * Verificar si el cliente tiene facturas emitidas
     */
    public function tieneFacturas(): bool
    {
        return $this->facturas()->where('estado', Factura::ESTADO_EMITIDA)->exists();
    }

    /**
     * Obtener total facturado del cliente
     */
    public function totalFacturado(): float
    {
        return $this->facturas()
            ->where('estado', Factura::ESTADO_EMITIDA)
            ->sum('total_factura');
    }

    /**
     * Contar reservas del cliente
     */
    public function contarReservas(): int
    {
        return $this->reservas()->count();
    }

    public function puedeEliminar(): bool
    {
        if ($this->id === self::CONSUMIDOR_FINAL_ID) {
            return false;
        }

        return ! $this->tieneFacturas() && $this->contarReservas() === 0;
    }
}
