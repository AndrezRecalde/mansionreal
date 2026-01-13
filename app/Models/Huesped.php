<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Huesped extends Model
{
    protected $table = 'huespedes';

    protected $fillable = [
        'apellidos',
        'nombres',
        'dni',
        'telefono',
        'email',
    ];


    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}
