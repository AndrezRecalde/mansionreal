<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDepartamento extends Model
{
    protected $table = 'tipos_departamentos';
    protected $fillable = ['nombre_tipo', 'descripcion', 'inventario_id'];

    // Relacion uno a muchos con Departamento
    public function departamentos()
    {
        return $this->hasMany(Departamento::class, 'tipo_departamento_id');
    }

    public function inventario()
    {
        return $this->belongsTo(Inventario::class, 'inventario_id');
    }
}
