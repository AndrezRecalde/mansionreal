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
                'nombre_tipo' => 'CABAÑA',
                'descripcion' => 'Departamento tipo estudio, ideal para una o dos personas.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => 'DEPARTAMENTO',
                'descripcion' => 'Departamento con un dormitorio separado, adecuado para parejas o pequeñas familias.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => 'LA MANSION REAL',
                'descripcion' => 'Departamento con dos dormitorios, perfecto para familias o grupos pequeños.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tipos_departamentos')->insert($tipos_departamentos);
    }
}
