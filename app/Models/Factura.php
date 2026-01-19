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
     * Obtener subtotal total (con IVA + sin IVA)
     */
    public function getSubtotalTotalAttribute(): float
    {
        return $this->subtotal_sin_iva + $this->subtotal_con_iva;
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

        // Base imponible (suma de subtotales de consumos)
        $this->subtotal_sin_iva = $consumos->sum('subtotal');

        // IVA (suma del iva de consumos)
        $this->total_iva = $consumos->sum('iva');

        // Total bruto de la factura (sin descuento)
        $this->total_factura = $this->subtotal_sin_iva + $this->total_iva;

        // Validar descuento
        if ($this->descuento > $this->total_factura) {
            throw FacturacionException::descuentoInvalido($this->descuento, $this->total_factura);
        }

        // Total neto con descuento
        $this->total_con_descuento = $this->total_factura - $this->descuento;
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
