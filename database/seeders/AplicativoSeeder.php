<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class AplicativoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('aplicativos')->delete();
        $aplicativos = [
            [
                'nombre_aplicativo'      =>  'Mansión Real',
                'descripcion_aplicativo' =>  'Hotel con 5 estrellas y servicios de lujo',
                'direccion_aplicativo'   =>  'Atacames, Ecuador Alado del Hotel Marimba',
                'telefono_aplicativo'    =>  '+1234567890',
                'logo_aplicativo'        =>  null,
                'created_at'             =>  now(),
                'updated_at'             =>  now(),
            ],
        ];
        DB::table('aplicativos')->insert($aplicativos);
    }
}
