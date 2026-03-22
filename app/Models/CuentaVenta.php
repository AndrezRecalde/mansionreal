<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CuentaVenta extends Model
{
    protected $table = 'cuentas_ventas';

    protected $fillable = [
        'codigo',
        'estado_id',
        'usuario_id',
        'subtotal',
        'total_descuentos',
        'total_iva',
        'total',
        'total_pagos',
        'saldo_pendiente',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class , 'estado_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class , 'usuario_id');
    }

    public function consumos()
    {
        return $this->hasMany(Consumo::class , 'cuenta_venta_id');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class , 'cuenta_venta_id');
    }

    public function factura()
    {
        return $this->hasOne(Factura::class, 'cuenta_venta_id')->latestOfMany();
    }

}
