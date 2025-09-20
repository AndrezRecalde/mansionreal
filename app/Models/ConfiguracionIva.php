<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfiguracionIva extends Model
{
    protected $table = 'configuracion_ivas';
    protected $fillable = [
        'descripcion',
        'tasa_iva',
        'fecha_inicio',
        'fecha_fin',
        'activo',
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
}
