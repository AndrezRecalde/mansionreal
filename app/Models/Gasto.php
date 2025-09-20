<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gasto extends Model
{
    protected $table = 'gastos';

    protected $fillable = [
        'reserva_id',
        'descripcion',
        'monto',
        'tipo_dano_id',
        'fecha_creacion',
    ];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    public function tipoDano()
    {
        return $this->belongsTo(TiposDano::class, 'tipo_dano_id');
    }

}
