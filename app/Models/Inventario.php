<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $fillable = [
        'nombre_producto',
        'descripcion',
        'precio_unitario',
        'stock',
        'categoria_id',
        'activo',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function consumos()
    {
        return $this->hasMany(Consumo::class, 'inventario_id');
    }

    public function scopePorCategoria(Builder $query, $categoriaId)
    {
        if ($categoriaId) {
            return $query->where('i.categoria_id', $categoriaId);
        }
        return $query;
    }

    public function scopePorNombreProducto(Builder $query, $nombre_producto)
    {
        if ($nombre_producto) {
            return $query->where('i.nombre_producto', 'like', '%' . $nombre_producto . '%');
        }
        return $query;
    }

    public function scopeBuscarActivos(Builder $query, $activo)
    {
        if ($activo) {
            return $query->where('i.activo', $activo);
        }
        return $query;
    }
}
