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
        'total_iva',
        'total_factura',
        'descuento',
        'tipo_descuento',
        'porcentaje_descuento',
        'motivo_descuento',
        'usuario_registro_descuento_id',
        'total_con_descuento',
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
        'total_iva' => 'decimal:2',
        'total_factura' => 'decimal:2',
        'porcentaje_descuento' => 'decimal:2',
        'total_con_descuento' => 'decimal:2',
        'descuento' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ====================================================================
    // CONSTANTES
    // ====================================================================
    const ESTADO_EMITIDA = 'EMITIDA';
    const ESTADO_ANULADA = 'ANULADA';

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
     * Verificar si tiene descuento
     */
    public function getTieneDescuentoAttribute(): bool
    {
        return $this->descuento > 0;
    }

    /**
     * Obtener porcentaje real de descuento (calculado)
     */
    public function getPorcentajeDescuentoRealAttribute(): float
    {
        if ($this->total_factura == 0) {
            return 0;
        }
        return round(($this->descuento / $this->total_factura) * 100, 2);
    }

    /**
     * Verificar si el descuento es significativo (>50%)
     */
    public function getEsDescuentoSignificativoAttribute(): bool
    {
        return $this->porcentaje_descuento_real > 50;
    }

    /**
     * Obtener subtotal total (con IVA + sin IVA)
     */
    public function getSubtotalTotalAttribute(): float
    {
        return $this->subtotal_sin_iva;
    }

    /**
     * Obtener número de factura formateado
     */
    public function getNumeroFacturaFormateadoAttribute(): string
    {
        return $this->numero_factura;
    }

    // ====================================================================
    // SCOPES
    // ====================================================================

    /**
     * Scope:   Solo facturas emitidas
     */
    public function scopeEmitidas($query)
    {
        return $query->where('estado', self::ESTADO_EMITIDA);
    }

    /**
     * Scope:  Solo facturas anuladas
     */
    public function scopeAnuladas($query)
    {
        return $query->where('estado', self::ESTADO_ANULADA);
    }

    /**
     * Scope: Facturas con descuento
     */
    public function scopeConDescuento($query)
    {
        return $query->where('descuento', '>', 0);
    }

    /**
     * Scope:  Facturas sin descuento
     */
    public function scopeSinDescuento($query)
    {
        return $query->where('descuento', 0);
    }

    /**
     * Scope:  Facturas por rango de fechas
     */
    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_emision', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope:  Facturas de un cliente específico
     */
    public function scopeDelCliente($query, int $clienteId)
    {
        return $query->where('cliente_facturacion_id', $clienteId);
    }

    public function scopePorAnio($query, $anio)
    {
        return $query->whereYear('fecha_emision', $anio);
    }

    /**
     * Scope: Facturas del año actual
     */
    public function scopeDelAnioActual($query)
    {
        return $query->whereYear('fecha_emision', Carbon::now()->year);
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
     * Scope: Ordenar por número de factura
     */
    public function scopeOrdenarPorNumero($query, string $direccion = 'asc')
    {
        return $query->orderBy('numero_factura', $direccion);
    }

    // ====================================================================
    // MÉTODOS DE INSTANCIA
    // ====================================================================

    /**
     * Calcular totales desde los consumos (ACTUALIZADO SIN aplica_iva)
     */
    public function calcularTotales(): void
    {
        $consumos = $this->consumos;

        // PASO 1: Sumar subtotales de consumos (SIN descuento)
        $subtotal_sin_iva = $consumos->sum('subtotal');

        // PASO 2: Obtener tasa de IVA aplicable
        $tasa_iva = $consumos->first()->tasa_iva ?? 15.00;

        // PASO 3: Aplicar descuento
        $base_imponible = $subtotal_sin_iva - $this->descuento;

        // PASO 4: Calcular IVA sobre la base imponible (DESPUÉS del descuento)
        $this->total_iva = $base_imponible * ($tasa_iva / 100);

        // PASO 5: Total bruto (SIN descuento, para registro contable)
        $this->total_factura = $subtotal_sin_iva + ($subtotal_sin_iva * ($tasa_iva / 100));

        // Validar descuento
        if ($this->descuento > $subtotal_sin_iva) {
            throw FacturacionException::descuentoInvalido($this->descuento, $subtotal_sin_iva);
        }

        // PASO 6: Total neto CON descuento (lo que paga el cliente)
        $this->total_con_descuento = $base_imponible + $this->total_iva;

        // Actualizar subtotal_sin_iva
        $this->subtotal_sin_iva = $subtotal_sin_iva;
    }

    /**
     * Aplicar descuento a la factura
     *
     * @param float $descuento Monto del descuento
     * @param string $tipoDescuento 'MONTO_FIJO' o 'PORCENTAJE'
     * @param float|null $porcentaje Porcentaje si tipo es PORCENTAJE
     * @param string|null $motivo Justificación del descuento
     * @param int|null $usuarioId Usuario que aplica el descuento
     * @return bool
     * @throws FacturacionException
     */
    public function aplicarDescuento(
        float $descuento,
        string $tipoDescuento = self::TIPO_DESCUENTO_MONTO_FIJO,
        ?float $porcentaje = null,
        ?string $motivo = null,
        ?int $usuarioId = null
    ): bool {
        if ($this->esta_anulada) {
            throw new FacturacionException('No se puede aplicar descuento a una factura anulada');
        }

        if ($descuento < 0) {
            throw new FacturacionException('El descuento no puede ser negativo');
        }

        // Calcular monto si es porcentaje
        if ($tipoDescuento === self::TIPO_DESCUENTO_PORCENTAJE && $porcentaje > 0) {
            $descuento = $this->subtotal_sin_iva * ($porcentaje / 100);
        }

        if ($descuento > $this->subtotal_sin_iva) {
            throw new FacturacionException(
                'El descuento ($' . number_format($descuento, 2) .
                    ') no puede ser mayor al subtotal ($' . number_format($this->subtotal_sin_iva, 2) . ')'
            );
        }

        $porcentajeReal = $this->subtotal_sin_iva > 0 ? ($descuento / $this->subtotal_sin_iva) * 100 : 0;

        if ($porcentajeReal >= 100) {
            throw new FacturacionException('No se puede aplicar descuento del 100% en facturas');
        }

        if ($porcentajeReal > 50 && empty($motivo)) {
            throw new FacturacionException('Los descuentos mayores al 50% requieren justificación obligatoria');
        }

        // Aplicar descuento
        $this->descuento = $descuento;
        $this->tipo_descuento = $tipoDescuento;
        $this->porcentaje_descuento = $tipoDescuento === self::TIPO_DESCUENTO_PORCENTAJE ? $porcentaje : null;
        $this->motivo_descuento = $motivo;
        $this->usuario_registro_descuento_id = $usuarioId;

        // ✅ RECALCULAR IVA Y TOTALES
        $this->calcularTotales();

        return $this->save();
    }

    /**
     * Eliminar descuento
     *
     * @return bool
     * @throws FacturacionException
     */
    public function eliminarDescuento(): bool
    {
        // Validar que no esté anulada
        if ($this->esta_anulada) {
            throw new FacturacionException('No se puede modificar una factura anulada');
        }

        $this->descuento = 0;
        $this->tipo_descuento = null;
        $this->porcentaje_descuento = null;
        $this->motivo_descuento = null;
        $this->usuario_registro_descuento_id = null;
        $this->total_con_descuento = $this->total_factura;

        return $this->save();
    }

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

        return $this->save();
    }

    /**
     * Obtener total final (considera descuento si existe)
     */
    public function getTotalFinalAttribute(): float
    {
        return $this->tiene_descuento ? $this->total_con_descuento :  $this->total_factura;
    }


    /**
     * Verificar si se puede anular
     */
    public function puedeAnularse(): bool
    {
        return $this->esta_emitida;
    }

    /**
     * Copiar datos del cliente (inmutabilidad)
     */
    public function copiarDatosCliente(ClienteFacturacion $cliente): void
    {
        $this->cliente_tipo_identificacion = $cliente->tipo_identificacion;
        $this->cliente_identificacion = $cliente->identificacion;
        $this->cliente_nombres_completos = $cliente->nombres_completos;
        $this->cliente_direccion = $cliente->direccion;
        $this->cliente_telefono = $cliente->telefono;
        $this->cliente_email = $cliente->email;
    }

    /**
     * Obtener cantidad de consumos
     */
    public function cantidadConsumos(): int
    {
        return $this->consumos()->count();
    }

    /**
     * Verificar si tiene consumos
     */
    public function tieneConsumos(): bool
    {
        return $this->consumos()->exists();
    }

    /**
     * Obtener consumos con IVA
     */
    public function consumosConIva()
    {
        return $this->consumos()->where('tasa_iva', '>', 0)->get();
    }

    /**
     * Obtener consumos sin IVA
     */
    public function consumosSinIva()
    {
        return $this->consumos()->where('tasa_iva', 0)->get();
    }
}
