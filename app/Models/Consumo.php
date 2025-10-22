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

    /* protected static function booted()
    {
        // Al crear un consumo, registrar el movimiento de inventario
        static::created(function ($consumo) {
            $inventario = $consumo->inventario;

            if ($inventario && !$inventario->sin_stock) {
                $inventario->registrarSalida(
                    cantidad: $consumo->cantidad,
                    motivo: 'Consumo en reserva',
                    observaciones: "Consumo ID: {$consumo->id}",
                    reservaId: $consumo->reserva_id,
                    consumoId: $consumo->id
                );
            }
        });
    } */
}
