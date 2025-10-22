<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Limpieza extends Model
{
    protected $fillable = [
        'departamento_id',
        'fecha_limpieza',
        'personal_limpieza',
        'usuario_registra',
    ];

    protected $casts = [
        'fecha_limpieza' => 'datetime',
    ];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_registra');
    }
}
