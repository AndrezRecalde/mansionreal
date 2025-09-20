<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $fillable = [
        'huesped_id',
        'departamento_id',
        'usuario_creador_id',
        'fecha_checkin',
        'fecha_checkout',
        'total_noches',
        'estado_id',
        'fecha_creacion',
        'total_adultos',
        'total_ninos',
        'total_mascotas',
        //'subtotal',
        //'aplica_iva',
        //'tasa_iva',
        //'iva',
        //'total',
    ];

    public function huesped()
    {
        return $this->belongsTo(Huesped::class);
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class);
    }

    public function consumos()
    {
        return $this->hasMany(Consumo::class);
    }

    public function gastos()
    {
        return $this->hasMany(Gasto::class);
    }

    public function scopeBuscarPorHuesped(Builder $query, $huespedId)
    {
        return $query->where('huesped_id', $huespedId);
    }

    public function scopeBuscarPorNumeroDepartamento(Builder $query, $numeroDepartamento)
    {
        return $query->whereHas('departamento', function (Builder $q) use ($numeroDepartamento) {
            $q->where('numero_departamento', 'like', '%' . $numeroDepartamento . '%');
        });
    }

    /** Scope para filtrar por rango de fechas */
    public function scopeFechaCheckin($query, $inicio, $fin)
    {
        if ($inicio && $fin) {
            return $query->whereBetween('fecha_checkin', [$inicio, $fin]);
        }
        return $query;
    }

    /** Scope para filtrar por código de reserva */
    public function scopeCodigoReserva($query, $codigo)
    {
        if ($codigo) {
            return $query->where('codigo_reserva', $codigo);
        }
        return $query;
    }
}
