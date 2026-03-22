<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caja extends Model
{
    protected $table = 'cajas';

    protected $fillable = [
        'nombre',
        'descripcion',
        'activa'
    ];

    public function turnos()
    {
        return $this->hasMany(TurnoCaja::class, 'caja_id');
    }
}
