<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    protected $table = 'departamentos';

    protected $fillable = [
        'numero_departamento',
        'descripcion',
        'tipo_departamento_id',
        'capacidad',
        'estado_id',
        'activo'
    ];

    public function tipoDepartamento()
    {
        return $this->belongsTo(TipoDepartamento::class, 'tipo_departamento_id');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenesDepartamento::class, 'departamento_id');
    }

    // Relacion de muchos a muchos con Servicio
    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'departamento_servicio', 'departamento_id', 'servicio_id');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'departamento_id');
    }

    public function scopeDisponibleEnFechas($query, $fechaCheckin, $fechaCheckout)
    {
        return $query->whereDoesntHave('reservas', function ($q) use ($fechaCheckin, $fechaCheckout) {
            $q->where(function ($subQuery) use ($fechaCheckin, $fechaCheckout) {
                $subQuery->whereBetween('fecha_checkin', [$fechaCheckin, $fechaCheckout])
                         ->orWhereBetween('fecha_checkout', [$fechaCheckin, $fechaCheckout])
                         ->orWhere(function ($nestedQuery) use ($fechaCheckin, $fechaCheckout) {
                             $nestedQuery->where('fecha_checkin', '<=', $fechaCheckin)
                                         ->where('fecha_checkout', '>=', $fechaCheckout);
                         });
            })->whereIn('estado_id', [1, 2]); // Considerar solo reservas con estado 'Confirmada' o 'En Proceso'
        });
    }
}
