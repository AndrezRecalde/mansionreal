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
        'direccion',
        'provincia_id',
    ];

    public function provincia()
    {
        return $this->belongsTo(Provincia::class);
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}
