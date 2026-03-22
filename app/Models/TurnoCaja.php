<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TurnoCaja extends Model
{
    protected $table = 'turno_cajas';

    protected $fillable = [
        'caja_id',
        'usuario_id',
        'fecha_apertura',
        'monto_apertura_efectivo',
        'fecha_cierre',
        'monto_cierre_efectivo_declarado',
        'monto_ventas_sistema',
        'diferencia',
        'estado',
    ];

    protected $casts = [
        'fecha_apertura' => 'datetime',
        'fecha_cierre' => 'datetime',
    ];

    public function caja()
    {
        return $this->belongsTo(Caja::class, 'caja_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoCaja::class, 'turno_caja_id');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'turno_caja_id');
    }
}
