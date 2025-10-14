<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nacionalidad extends Model
{
    protected $table = 'nacionalidades';

    protected $fillable = [
        'nombre_nacionalidad',
        'activo',
    ];

    public function huespedes()
    {
        return $this->hasMany(Huesped::class);
    }
}
