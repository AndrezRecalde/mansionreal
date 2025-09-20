<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consumo extends Model
{
    protected $fillable = [
        'reserva_id',
        'inventario_id',
        'cantidad',
        'fecha_creacion',
        'subtotal',
        'tasa_iva',
        'iva',
        'total',
        'aplica_iva',
    ];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }

    public function inventario()
    {
        return $this->belongsTo(Inventario::class);
    }

}
