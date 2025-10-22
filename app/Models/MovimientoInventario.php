<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    use HasFactory;

    protected $table = 'movimientos_inventario';

    protected $fillable = [
        'inventario_id',
        'tipo_movimiento',
        'cantidad',
        'stock_anterior',
        'stock_nuevo',
        'estado_anterior',  // Nuevo
        'estado_nuevo',     // Nuevo
        'motivo',
        'observaciones',
        'reserva_id',
        'consumo_id',
        'usuario_id',
        'fecha_movimiento'
    ];

    protected $casts = [
        'fecha_movimiento' => 'datetime',
        'cantidad' => 'integer',
        'stock_anterior' => 'integer',
        'stock_nuevo' => 'integer',
        'estado_anterior' => 'boolean',  // Nuevo
        'estado_nuevo' => 'boolean',     // Nuevo
    ];

    // Relaciones
    public function inventario()
    {
        return $this->belongsTo(Inventario::class, 'inventario_id');
    }

    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    public function consumo()
    {
        return $this->belongsTo(Consumo::class, 'consumo_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Scopes útiles
    public function scopeEntradas($query)
    {
        return $query->where('tipo_movimiento', 'entrada');
    }

    public function scopeSalidas($query)
    {
        return $query->where('tipo_movimiento', 'salida');
    }

    public function scopePorInventario($query, $inventarioId)
    {
        return $query->where('inventario_id', $inventarioId);
    }

    public function scopePorFecha($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_movimiento', [$fechaInicio, $fechaFin]);
    }
}
