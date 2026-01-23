<?php

namespace App\Models;

use App\Services\Facturacion\Exceptions\FacturacionException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Factura extends Model
{
    protected $table = 'facturas';

    protected $fillable = [
        'numero_factura',
        'reserva_id',
        'cliente_facturacion_id',
        'fecha_emision',
        'cliente_tipo_identificacion',
        'cliente_identificacion',
        'cliente_nombres_completos',
        'cliente_direccion',
        'cliente_telefono',
        'cliente_email',
        'subtotal_sin_iva',
        'total_descuento',
        'total_iva',
        'total_factura', // ✅ Total final (suma de consumos.total)
        // ❌ REMOVIDOS: Campos de descuento (ahora están en consumos)
        'estado',
        'observaciones',
        'motivo_anulacion',
        'fecha_anulacion',
        'usuario_anulo_id',
        'usuario_genero_id',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_anulacion' => 'datetime',
        'subtotal_sin_iva' => 'decimal:2',
        'total_descuento' => 'decimal:2',
        'total_iva' => 'decimal:2',
        'total_factura' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ====================================================================
    // CONSTANTES
    // ====================================================================
    const ESTADO_EMITIDA = 'EMITIDA';
    const ESTADO_ANULADA = 'ANULADA';

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
     * Consumos incluidos en la factura
     */
    public function consumos(): HasMany
    {
        return $this->hasMany(Consumo::class, 'factura_id');
    }

    /**
     * Usuario que generó la factura
     */
    public function usuarioGenero(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_genero_id');
    }

    /**
     * Usuario que anuló la factura
     */
    public function usuarioAnulo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_anulo_id');
    }

    // ====================================================================
    // ACCESSORS
    // ====================================================================

    /**
     * Obtener nombre completo del cliente
     */
    public function getClienteNombreCompletoAttribute(): string
    {
        if ($this->cliente_identificacion === ClienteFacturacion::CONSUMIDOR_FINAL_IDENTIFICACION) {
            return 'CONSUMIDOR FINAL';
        }

        return trim($this->cliente_nombres_completos);
    }

    /**
     * Verificar si es consumidor final
     */
    public function getEsConsumidorFinalAttribute(): bool
    {
        return $this->cliente_identificacion === ClienteFacturacion::CONSUMIDOR_FINAL_IDENTIFICACION
            || $this->cliente_tipo_identificacion === 'CF';
    }

    /**
     * Verificar si está emitida
     */
    public function getEstaEmitidaAttribute(): bool
    {
        return $this->estado === self::ESTADO_EMITIDA;
    }

    /**
     * Verificar si está anulada
     */
    public function getEstaAnuladaAttribute(): bool
    {
        return $this->estado === self::ESTADO_ANULADA;
    }

    /**
     * Obtener cantidad de consumos
     */
    public function getCantidadConsumosAttribute(): int
    {
        return $this->consumos()->count();
    }

    /**
     * ✅ NUEVO: Calcular total de descuentos aplicados (suma de descuentos de consumos)
     */
    public function getTotalDescuentosAttribute(): float
    {
        return $this->consumos()->sum('descuento');
    }

    /**
     * ✅ NUEVO: Calcular subtotal antes de descuentos
     */
    public function getSubtotalAntesDescuentosAttribute(): float
    {
        return $this->consumos()->sum('subtotal');
    }

    /**
     * ✅ NUEVO: Calcular subtotal después de descuentos (base imponible)
     */
    public function getBaseImponibleAttribute(): float
    {
        return $this->subtotal_antes_descuentos - $this->total_descuentos;
    }

    /**
     * ✅ NUEVO: Obtener porcentaje promedio de descuento
     */
    public function getPorcentajeDescuentoPromedioAttribute(): float
    {
        if ($this->subtotal_antes_descuentos == 0) {
            return 0;
        }

        return round(($this->total_descuentos / $this->subtotal_antes_descuentos) * 100, 2);
    }

    /**
     * ✅ NUEVO: Obtener cantidad de consumos con descuento
     */
    public function getConsumosConDescuentoAttribute(): int
    {
        return $this->consumos()->where('descuento', '>', 0)->count();
    }

    /**
     * Obtener número de factura formateado
     */
    public function getNumeroFacturaFormateadoAttribute(): string
    {
        return $this->numero_factura;
    }

    /**
     * Obtener información del cliente formateada
     */
    public function getClienteInfoAttribute(): string
    {
        return "{$this->cliente_nombres_completos} - {$this->cliente_tipo_identificacion}: {$this->cliente_identificacion}";
    }

    public function getTieneDescuentosAttribute(): bool
    {
        return $this->total_descuento > 0;
    }

    /**
     * ✅ NUEVO: Obtener porcentaje de descuento sobre el subtotal
     */
    public function getPorcentajeDescuentoAttribute(): float
    {
        if ($this->subtotal_sin_iva <= 0) {
            return 0;
        }

        return ($this->total_descuento / $this->subtotal_sin_iva) * 100;
    }

    /**
     * ✅ NUEVO: Obtener subtotal antes de descuentos
     */
    public function getSubtotalAntesDescuentoAttribute(): float
    {
        return $this->subtotal_sin_iva + $this->total_descuento;
    }

    // ====================================================================
    // SCOPES
    // ====================================================================

    /**
     * Scope: Solo facturas emitidas
     */
    public function scopeEmitidas($query)
    {
        return $query->where('estado', self::ESTADO_EMITIDA);
    }

    /**
     * Scope: Solo facturas anuladas
     */
    public function scopeAnuladas($query)
    {
        return $query->where('estado', self::ESTADO_ANULADA);
    }

    /**
     * Scope: Facturas de un cliente específico
     */
    public function scopeDeCliente($query, int $clienteId)
    {
        return $query->where('cliente_facturacion_id', $clienteId);
    }

    /**
     * Scope: Facturas en un rango de fechas
     */
    public function scopeEntreFechas($query, Carbon $inicio, Carbon $fin)
    {
        return $query->whereBetween('fecha_emision', [$inicio, $fin]);
    }

    public function scopePorAnio($query, int $anio)
    {
        return $query->whereYear('fecha_emision', $anio);
    }

    /**
     * Scope: Facturas del mes actual
     */
    public function scopeDelMesActual($query)
    {
        return $query->whereMonth('fecha_emision', Carbon::now()->month)
            ->whereYear('fecha_emision', Carbon::now()->year);
    }

    /**
     * ✅ NUEVO: Scope - Facturas con descuentos
     */
    public function scopeConDescuentos($query)
    {
        return $query->whereHas('consumos', function ($q) {
            $q->where('descuento', '>', 0);
        });
    }

    /**
     * ✅ NUEVO: Scope - Facturas con descuento significativo (>30% en promedio)
     */
    public function scopeConDescuentoSignificativo($query, float $porcentaje = 30)
    {
        return $query->whereHas('consumos', function ($q) use ($porcentaje) {
            $q->whereRaw('(descuento / NULLIF(subtotal, 0)) * 100 > ?', [$porcentaje]);
        });
    }

    // ====================================================================
    // MÉTODOS DE INSTANCIA
    // ====================================================================

    /**
     * Anular factura
     */
    public function anular(string $motivo, int $usuarioId): bool
    {
        if ($this->esta_anulada) {
            return false;
        }

        $this->estado = self::ESTADO_ANULADA;
        $this->motivo_anulacion = $motivo;
        $this->fecha_anulacion = now();
        $this->usuario_anulo_id = $usuarioId;

        $saved = $this->save();

        // Desasignar factura de los consumos
        if ($saved) {
            $this->consumos()->update(['factura_id' => null]);
        }

        return $saved;
    }

    /**
     * Verificar si se puede anular
     */
    public function puedeAnularse(): bool
    {
        return $this->esta_emitida;
    }

    /**
     * ✅ NUEVO: Recalcular totales desde consumos
     *
     * Útil después de modificar consumos o aplicar descuentos
     */
    public function recalcularTotales(): bool
    {
        if ($this->esta_anulada) {
            return false;
        }

        // Obtener totales desde consumos
        $consumos = $this->consumos;

        $subtotalSinIva = $consumos->sum('subtotal');
        $totalIva = $consumos->sum('iva');
        $totalFactura = $consumos->sum('total');

        $this->subtotal_sin_iva = round($subtotalSinIva, 2);
        $this->total_iva = round($totalIva, 2);
        $this->total_factura = round($totalFactura, 2);

        return $this->save();
    }

    /**
     * ✅ NUEVO: Obtener resumen de descuentos
     */
    public function getResumenDescuentos(): array
    {
        return [
            'tiene_descuentos' => $this->tiene_descuentos,
            'total_descuentos' => $this->total_descuentos,
            'subtotal_antes_descuentos' => $this->subtotal_antes_descuentos,
            'base_imponible' => $this->base_imponible,
            'porcentaje_descuento_promedio' => $this->porcentaje_descuento_promedio,
            'consumos_con_descuento' => $this->consumos_con_descuento,
            'consumos_totales' => $this->cantidad_consumos,
        ];
    }

    public function copiarDatosCliente(ClienteFacturacion $cliente): void
    {
        $this->cliente_tipo_identificacion = $cliente->tipo_identificacion;
        $this->cliente_identificacion = $cliente->identificacion;
        $this->cliente_nombres_completos = $cliente->nombres_completos;
        $this->cliente_direccion = $cliente->direccion;
        $this->cliente_telefono = $cliente->telefono;
        $this->cliente_email = $cliente->email;
    }
}
