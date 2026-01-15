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
                'nombre_tipo' => 'HABITACIÓN',
                'descripcion' => 'Habitación estándar equipada con las comodidades básicas para una estancia agradable.',
                'inventario_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => 'CABAÑA',
                'descripcion' => 'Cabaña acogedora con todas las comodidades necesarias para una estancia confortable.',
                'inventario_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => 'LA MANSIÓN REAL',
                'descripcion' => 'Amplio departamento de lujo con múltiples habitaciones y servicios exclusivos.',
                'inventario_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_tipo' => 'SALÓN DE EVENTOS',
                'descripcion' => 'Espacio amplio y elegante para la celebración de eventos y reuniones.',
                'inventario_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tipos_departamentos')->insert($tipos_departamentos);
    }
}
