<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aplicativo extends Model
{

    protected $fillable = [
        'nombre_aplicativo',
        'descripcion_aplicativo',
        'direccion_aplicativo',
        'telefono_aplicativo',
        'logo_aplicativo',
    ];
}
