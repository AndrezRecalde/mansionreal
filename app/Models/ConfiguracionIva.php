<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ConfiguracionIva extends Model
{
    protected $table = 'configuracion_ivas';
    protected $fillable = [
        'descripcion',
        'tasa_iva',
        'fecha_inicio',
        'fecha_fin',
        'activo',
        'es_estandar'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function scopeBuscarActivos($query, $activo)
    {
        if ($activo) {
            return $query->where('activo', $activo);
        }
        return $query;
    }

    /**
     * Actualiza las tasas de IVA:
     * - Desactiva tasas temporales vencidas y limpia fechas.
     * - Activa la tasa estándar si no hay especial activa.
     */
    public static function actualizarTasas()
    {
        $hoy = Carbon::today();

        // 1. Desactivar tasas temporales vencidas y limpiar fechas
        self::where('activo', true)
            ->whereNotNull('fecha_fin')
            ->where('fecha_fin', '<', $hoy)
            ->update([
                'activo' => false,
                'fecha_inicio' => null,
                'fecha_fin' => null,
            ]);

        // 2. Verificar si hay alguna tasa especial activa en este momento
        $hayEspecialActiva = self::where('activo', true)
            ->whereNotNull('fecha_inicio')
            ->whereNotNull('fecha_fin')
            ->where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->exists();

        // 3. Si no hay tasa especial activa, activar la estándar
        if (!$hayEspecialActiva) {
            self::where('es_estandar', true)->update(['activo' => true]);
        }
    }
}
