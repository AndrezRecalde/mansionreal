<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConceptoPago extends Model
{
    protected $table = 'conceptos_pagos';

    protected $fillable = [
        'nombre_concepto',
        'activo'
    ];

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'concepto_pago_id');
    }
}
