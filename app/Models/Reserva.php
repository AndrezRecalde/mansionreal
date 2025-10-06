<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $fillable = [
        'huesped_id',
        'tipo_reserva',
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

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'reserva_id');
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

    protected static function boot()
    {
        parent::boot();

        static::created(function ($reserva) {
            $reserva->codigo_reserva = now()->year
                . str_pad($reserva->id, 5, '0', STR_PAD_LEFT)
                . str_pad(rand(0, 99), 2, '0', STR_PAD_LEFT);

            $reserva->save();
        });
    }
}
