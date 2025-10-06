<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosPagosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('conceptos_pagos')->delete();

        $conceptos_pagos = [
            [
                'nombre_concepto' => 'PAGO HOSPEDAJE',
                'activo'          => true,
            ],
            [
                'nombre_concepto' => 'PAGO ESTADIA',
                'activo'          => true,
            ],
            [
                'nombre_concepto' => 'PAGO CONSUMOS',
                'activo'          => true,
            ],
            [
                'nombre_concepto' => 'PAGO DAÑOS',
                'activo'          => true,
            ]
        ];

        DB::table('conceptos_pagos')->insert($conceptos_pagos);
    }
}
