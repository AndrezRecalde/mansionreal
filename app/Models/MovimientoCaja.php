<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoCaja extends Model
{
    protected $table = 'movimiento_cajas';

    protected $fillable = [
        'turno_caja_id',
        'tipo',
        'monto',
        'concepto',
        'usuario_id',
    ];

    public function turno_caja()
    {
        return $this->belongsTo(TurnoCaja::class, 'turno_caja_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
