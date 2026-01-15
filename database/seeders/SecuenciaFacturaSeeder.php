<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SecuenciaFacturaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $secuencias = [
            // Secuencia principal ACTIVA
            [
                'establecimiento' => '001',
                'punto_emision' => '001',
                'secuencial_inicio' => 1,
                'secuencial_actual' => 0,
                'secuencial_fin' => 999999999,
                'longitud_secuencial' => 9,
                'descripcion' => 'Secuencia principal - Matriz Quito',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Secuencia secundaria (Sucursal Guayaquil) - INACTIVA
            [
                'establecimiento' => '002',
                'punto_emision' => '001',
                'secuencial_inicio' => 1,
                'secuencial_actual' => 0,
                'secuencial_fin' => 999999999,
                'longitud_secuencial' => 9,
                'descripcion' => 'Sucursal Guayaquil',
                'activo' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Secuencia de respaldo (por si la principal se agota)
            [
                'establecimiento' => '001',
                'punto_emision' => '002',
                'secuencial_inicio' => 1,
                'secuencial_actual' => 0,
                'secuencial_fin' => 999999999,
                'longitud_secuencial' => 9,
                'descripcion' => 'Punto de emisión secundario - Matriz',
                'activo' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Secuencia de prueba con límite bajo (para testear agotamiento)
            [
                'establecimiento' => '999',
                'punto_emision' => '999',
                'secuencial_inicio' => 1,
                'secuencial_actual' => 95,
                'secuencial_fin' => 100,
                'longitud_secuencial' => 9,
                'descripcion' => 'Secuencia de prueba (límite bajo para testing)',
                'activo' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('secuencia_facturas')->insert($secuencias);
    }
}
