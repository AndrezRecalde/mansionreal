<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenesDepartamento extends Model
{
    protected $table = 'imagenes_departamentos';

    protected $fillable = [
        'imagen_url',
        'departamento_id',
    ];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }
}
