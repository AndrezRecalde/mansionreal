<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NacionalidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('nacionalidades')->delete();

        $nacionalidades = [
            [
                'nombre_nacionalidad'  =>  'Ecuatoriano',
                'activo'               =>  1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_nacionalidad'  =>  'Extranjero',
                'activo'               =>  1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        DB::table('nacionalidades')->insert($nacionalidades);
    }
}
