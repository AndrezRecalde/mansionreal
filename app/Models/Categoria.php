<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $fillable = [
        'nombre_categoria',
        'activo'
    ];

    public function scopeBuscarActivos($query, $activo)
    {
        if ($activo) {
            return $query->where('activo', $activo);
        }
        return $query;
    }
}
