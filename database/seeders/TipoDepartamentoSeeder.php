<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TipoDepartamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tipos_departamentos')->delete();

        $tipos_departamentos = [
            [
                'nombre_tipo' => 'ESTUDIO',
                'descripcion' => 'Departamento tipo estudio, ideal para una o dos personas.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => '1 DORMITORIO',
                'descripcion' => 'Departamento con un dormitorio separado, adecuado para parejas o pequeñas familias.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => '2 DORMITORIOS',
                'descripcion' => 'Departamento con dos dormitorios, perfecto para familias o grupos pequeños.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => '3 DORMITORIOS',
                'descripcion' => 'Departamento espacioso con tres dormitorios, ideal para familias grandes o grupos.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => 'PENTHOUSE',
                'descripcion' => 'Departamento de lujo en el último piso, con vistas panorámicas y comodidades exclusivas.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tipos_departamentos')->insert($tipos_departamentos);
    }
}
