<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Huesped extends Model
{
    protected $table = 'huespedes';

    protected $fillable = [
        'nombres_completos',
        'dni',
        'telefono',
        'email',
    ];


    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}
