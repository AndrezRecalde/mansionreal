<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $fillable = [
        'nombre_servicio',
        'tipo_servicio',
    ];

    // Relacion de muchos a muchos con Departamento
    public function departamentos()
    {
        return $this->belongsToMany(Departamento::class, 'departamento_servicio', 'servicio_id', 'departamento_id');
    }
}
