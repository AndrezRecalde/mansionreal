<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    protected $table = 'provincias';

    protected $fillable = [
        'nombre_provincia',
        'activo',
    ];

    public function huespedes()
    {
        return $this->hasMany(Huesped::class);
    }
}
