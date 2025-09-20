<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiposDano extends Model
{
    protected $table = 'tipos_danos';

    protected $fillable = [
        'nombre_tipo_dano',
        'activo',
    ];
}
