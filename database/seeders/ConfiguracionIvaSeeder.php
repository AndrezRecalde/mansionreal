<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ConfiguracionIvaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('configuracion_ivas')->delete();

        $configuracionIvas = [
            [
                'descripcion' => 'Tasa estándar',
                'tasa_iva' => 15.00,
                'fecha_inicio' => null,
                'fecha_fin' => null,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'descripcion' => 'Tasa reducida',
                'tasa_iva' => 8.00,
                'fecha_inicio' => '2024-01-01',
                'fecha_fin' => '2024-12-31',
                'activo' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'descripcion' => 'Exento de IVA',
                'tasa_iva' => 0.00,
                'fecha_inicio' => null,
                'fecha_fin' => null,
                'activo' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('configuracion_ivas')->insert($configuracionIvas);
    }
}
