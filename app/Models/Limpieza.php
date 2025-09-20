<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Limpieza extends Model
{
    protected $fillable = ['departamento_id', 'fecha'];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }
}
