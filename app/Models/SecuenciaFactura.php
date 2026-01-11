<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SecuenciaFactura extends Model
{
    protected $table = 'secuencia_facturas';

    protected $fillable = [
        'establecimiento',
        'punto_emision',
        'secuencial_actual',
        'secuencial_inicio',
        'secuencial_fin',
        'activo',
        'descripcion',
        'longitud_secuencial',
    ];

    protected $casts = [
        'secuencial_actual' => 'integer',
        'secuencial_inicio' => 'integer',
        'secuencial_fin' => 'integer',
        'longitud_secuencial' => 'integer',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ====================================================================
    // CONSTANTES
    // ====================================================================
    const ESTABLECIMIENTO_DEFAULT = '001';
    const PUNTO_EMISION_DEFAULT = '001';

    // ====================================================================
    // SCOPES
    // ====================================================================

    /**
     * Scope:  Solo secuencias activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope:  Obtener por establecimiento y punto
     */
    public function scopePorPuntoEmision($query, string $establecimiento, string $punto)
    {
        return $query->where('establecimiento', $establecimiento)
            ->where('punto_emision', $punto);
    }

    // ====================================================================
    // MÉTODOS ESTÁTICOS
    // ====================================================================

    /**
     * Obtener secuencia por defecto
     */
    public static function obtenerDefault(): ?SecuenciaFactura
    {
        return static::activas()
            ->porPuntoEmision(self::ESTABLECIMIENTO_DEFAULT, self::PUNTO_EMISION_DEFAULT)
            ->first();
    }

    /**
     * Generar siguiente número de factura (con lock para concurrencia)
     */
    public static function generarSiguienteNumero(int $secuenciaId = 1): string
    {
        return DB::transaction(function () use ($secuenciaId) {
            // Lock para evitar números duplicados en concurrencia
            $secuencia = static::lockForUpdate()->findOrFail($secuenciaId);

            if (! $secuencia->activo) {
                throw new \Exception('La secuencia de facturas está inactiva');
            }

            // Incrementar secuencial
            $secuencia->secuencial_actual++;

            // Verificar límite (si existe)
            if ($secuencia->secuencial_fin && $secuencia->secuencial_actual > $secuencia->secuencial_fin) {
                throw new \Exception('Se alcanzó el límite de la secuencia de facturas');
            }

            $secuencia->save();

            // Generar número formateado:  001-001-000001234
            return $secuencia->formatearNumero($secuencia->secuencial_actual);
        });
    }

    // ====================================================================
    // MÉTODOS DE INSTANCIA
    // ====================================================================

    /**
     * Formatear número de factura
     */
    public function formatearNumero(int $secuencial): string
    {
        $secuencialFormateado = str_pad(
            $secuencial,
            $this->longitud_secuencial,
            '0',
            STR_PAD_LEFT
        );

        return sprintf(
            '%s-%s-%s',
            $this->establecimiento,
            $this->punto_emision,
            $secuencialFormateado
        );
    }

    /**
     * Obtener siguiente número (sin incrementar)
     */
    public function siguienteNumero(): string
    {
        return $this->formatearNumero($this->secuencial_actual + 1);
    }

    /**
     * Verificar si se puede generar más números
     */
    public function puedeGenerarMas(): bool
    {
        if (! $this->activo) {
            return false;
        }

        if ($this->secuencial_fin === null) {
            return true; // Sin límite
        }

        return $this->secuencial_actual < $this->secuencial_fin;
    }

    /**
     * Obtener números disponibles restantes
     */
    public function numerosDisponibles(): ?int
    {
        if ($this->secuencial_fin === null) {
            return null; // Ilimitado
        }

        return max(0, $this->secuencial_fin - $this->secuencial_actual);
    }

    /**
     * Reiniciar secuencia (cuidado:  solo para testing/desarrollo)
     */
    public function reiniciar(): bool
    {
        $this->secuencial_actual = 0;
        return $this->save();
    }
}
