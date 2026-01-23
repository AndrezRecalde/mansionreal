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
        'descuento',
        'tipo_descuento',
        'porcentaje_descuento',
        'motivo_descuento',
        'usuario_registro_descuento_id',
        // Auditoría
        'creado_por_usuario_id',
        'actualizado_por_usuario_id',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'fecha_creacion' => 'date',
        'subtotal' => 'decimal:2',
        'tasa_iva' => 'decimal:2',
        'iva' => 'decimal:2',
        'total' => 'decimal:2',
        'descuento' => 'decimal:2',
        'porcentaje_descuento' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ====================================================================
    // CONSTANTES
    // ====================================================================
    const TIPO_DESCUENTO_SIN_DESCUENTO = 'SIN_DESCUENTO';
    const TIPO_DESCUENTO_MONTO_FIJO = 'MONTO_FIJO';
    const TIPO_DESCUENTO_PORCENTAJE = 'PORCENTAJE';

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
     * Producto del inventario
     */
    public function inventario(): BelongsTo
    {
        return $this->belongsTo(Inventario::class);
    }

    /**
     * Factura asociada (si ya está facturado)
     */
    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'factura_id');
    }

    /**
     * Usuario que creó el consumo
     */
    public function usuarioCreador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por_usuario_id');
    }

    /**
     * Usuario que actualizó el consumo
     */
    public function usuarioActualizador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actualizado_por_usuario_id');
    }

    /**
     * Usuario que aplicó el descuento
     */
    public function usuarioRegistroDescuento(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_registro_descuento_id');
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

    /**
     * ✅ NUEVO: Verificar si tiene descuento aplicado
     */
    public function getTieneDescuentoAttribute(): bool
    {
        return $this->descuento > 0 && $this->tipo_descuento !== self::TIPO_DESCUENTO_SIN_DESCUENTO;
    }

    /**
     * ✅ NUEVO: Obtener subtotal sin descuento (para cálculos)
     */
    public function getSubtotalSinDescuentoAttribute(): float
    {
        // El subtotal ya está sin descuento, pero por si se necesita el total sin descuento
        return $this->subtotal;
    }

    /**
     * ✅ NUEVO: Obtener subtotal después de aplicar descuento (pero antes de IVA)
     */
    public function getSubtotalConDescuentoAttribute(): float
    {
        return max(0, $this->subtotal - $this->descuento);
    }

    /**
     * ✅ NUEVO: Calcular porcentaje real del descuento aplicado
     */
    public function getPorcentajeDescuentoRealAttribute(): float
    {
        if ($this->subtotal == 0 || $this->descuento == 0) {
            return 0;
        }

        return round(($this->descuento / $this->subtotal) * 100, 2);
    }

    /**
     * ✅ NUEVO: Verificar si el descuento es significativo (>30%)
     */
    public function getEsDescuentoSignificativoAttribute(): bool
    {
        return $this->porcentaje_descuento_real > 30;
    }

    /**
     * Obtener nombre del usuario creador
     */
    public function getUsuarioCreadorNombreAttribute(): string
    {
        return $this->usuarioCreador?->nombres_completos ?? 'Desconocido';
    }

    /**
     * Obtener nombre del usuario actualizador
     */
    public function getUsuarioActualizadorNombreAttribute(): string
    {
        return $this->usuarioActualizador?->nombres_completos ?? 'Desconocido';
    }

    /**
     * ✅ NUEVO: Obtener nombre del usuario que aplicó descuento
     */
    public function getUsuarioDescuentoNombreAttribute(): string
    {
        return $this->usuarioRegistroDescuento?->nombres_completos ?? 'No aplica';
    }

    // ====================================================================
    // SCOPES
    // ====================================================================

    /**
     * Scope: Consumos facturados
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

    /**
     * ✅ NUEVO: Scope - Consumos con descuento
     */
    public function scopeConDescuento($query)
    {
        return $query->where('descuento', '>', 0)
            ->where('tipo_descuento', '!=', self::TIPO_DESCUENTO_SIN_DESCUENTO);
    }

    /**
     * ✅ NUEVO: Scope - Consumos sin descuento
     */
    public function scopeSinDescuento($query)
    {
        return $query->where(function ($q) {
            $q->where('descuento', 0)
                ->orWhere('tipo_descuento', self::TIPO_DESCUENTO_SIN_DESCUENTO);
        });
    }

    /**
     * ✅ NUEVO: Scope - Consumos con descuento significativo
     */
    public function scopeConDescuentoSignificativo($query, float $porcentaje = 30)
    {
        return $query->whereRaw('(descuento / NULLIF(subtotal, 0)) * 100 > ?', [$porcentaje]);
    }

    /**
     * ✅ NUEVO: Scope - Por tipo de descuento
     */
    public function scopePorTipoDescuento($query, string $tipo)
    {
        return $query->where('tipo_descuento', $tipo);
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
        if ($this->factura && $this->factura->estado !== Factura::ESTADO_ANULADA) {
            return false;
        }

        $this->factura_id = null;
        return $this->save();
    }

    /**
     * ✅ NUEVO: Aplicar descuento al consumo
     *
     * @param float $descuento Monto o porcentaje del descuento
     * @param string $tipo MONTO_FIJO o PORCENTAJE
     * @param string|null $motivo Justificación del descuento
     * @param int|null $usuarioId Usuario que aplica el descuento
     * @return bool
     */
    public function aplicarDescuento(
        float $descuento,
        string $tipo,
        ?string $motivo = null, // ✅ Nullable
        ?int $usuarioId = null
    ): bool {
        if ($this->esta_facturado) {
            return false; // No se puede aplicar descuento a consumos ya facturados
        }

        // Calcular monto del descuento
        if ($tipo === self::TIPO_DESCUENTO_PORCENTAJE) {
            $montoDescuento = $this->subtotal * ($descuento / 100);
            $this->porcentaje_descuento = $descuento;
        } else {
            $montoDescuento = $descuento;
            $this->porcentaje_descuento = null;
        }

        // Validar que el descuento no exceda el subtotal
        if ($montoDescuento > $this->subtotal) {
            return false;
        }

        // ✅ VALIDACIÓN: Si el descuento es > 50%, el motivo es obligatorio
        $porcentajeReal = ($montoDescuento / $this->subtotal) * 100;
        if ($porcentajeReal > 50 && empty($motivo)) {
            throw new \Exception('El motivo es obligatorio para descuentos mayores al 50%');
        }

        // Aplicar descuento
        $this->descuento = round($montoDescuento, 2);
        $this->tipo_descuento = $tipo;
        $this->motivo_descuento = $motivo; // Puede ser null
        $this->usuario_registro_descuento_id = $usuarioId;

        // Recalcular total: (subtotal - descuento) + IVA
        $subtotalConDescuento = $this->subtotal - $this->descuento;
        $this->iva = round($subtotalConDescuento * ($this->tasa_iva / 100), 2);
        $this->total = round($subtotalConDescuento + $this->iva, 2);

        return $this->save();
    }

    /**
     * ✅ NUEVO: Remover descuento del consumo
     */
    public function removerDescuento(): bool
    {
        if ($this->esta_facturado) {
            return false;
        }

        $this->descuento = 0;
        $this->tipo_descuento = self::TIPO_DESCUENTO_SIN_DESCUENTO;
        $this->porcentaje_descuento = null;
        $this->motivo_descuento = null;
        $this->usuario_registro_descuento_id = null;

        // Recalcular total sin descuento
        $this->iva = round($this->subtotal * ($this->tasa_iva / 100), 2);
        $this->total = round($this->subtotal + $this->iva, 2);

        return $this->save();
    }

    /**
     * ✅ NUEVO: Recalcular totales (útil después de cambios)
     */
    public function recalcularTotales(): bool
    {
        $subtotalConDescuento = max(0, $this->subtotal - $this->descuento);
        $this->iva = round($subtotalConDescuento * ($this->tasa_iva / 100), 2);
        $this->total = round($subtotalConDescuento + $this->iva, 2);

        return $this->save();
    }
}
