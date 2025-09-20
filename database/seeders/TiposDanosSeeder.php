<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TiposDanosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tipos_danos')->delete();

        $tipos_danos = [
            [
                'nombre_tipo_dano' => 'DAÑOS EN LA HABITACIÓN',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo_dano' => 'DAÑOS EN EL BAÑO',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo_dano' => 'DAÑOS EN LA COCINA',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo_dano' => 'DAÑOS EN AREAS COMUNES O ESTRUCTURA',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo_dano' => 'OTROS CARGOS POR MAL USO O NEGLIGENCIA',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tipos_danos')->insert($tipos_danos);
    }
}
