<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table = 'pagos';

    protected $fillable = [
        'reserva_id',
        'codigo_voucher',
        'concepto_pago_id',
        'monto',
        'metodo_pago',
        'fecha_pago',
        'observaciones',
        'usuario_creador_id',
        'usuario_modificador_id',
    ];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    public function conceptoPago()
    {
        return $this->belongsTo(ConceptoPago::class, 'concepto_pago_id');
    }

    public function usuarioCreador()
    {
        return $this->belongsTo(User::class, 'usuario_creador_id');
    }

    public function usuarioModificador()
    {
        return $this->belongsTo(User::class, 'usuario_modificador_id');
    }

    public function scopeBuscarPorCodigoVoucher(Builder $query, $codigoVoucher)
    {
        if (!empty($codigoVoucher)) {
            return $query->where('codigo_voucher', 'like', '%' . $codigoVoucher . '%');
        }
        return $query;
    }

    //scope de filtro por fechas
    public function scopeBuscarPorFechas(Builder $query, $fechaInicio, $fechaFin)
    {
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            return $query->whereBetween('fecha_pago', [$fechaInicio, $fechaFin]);
        }
        return $query;
    }
}
