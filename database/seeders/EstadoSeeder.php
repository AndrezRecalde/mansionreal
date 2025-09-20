<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('estados')->delete();

         $estados = [
            [
                'nombre_estado' => 'RESERVADO',
                'tipo_estado' => 'RESERVA',
                'color' => 'blue',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'CONFIRMADO',
                'tipo_estado' => 'RESERVA',
                'color' => 'green',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'CANCELADO',
                'tipo_estado' => 'RESERVA',
                'color' => 'red',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'DISPONIBLE',
                'tipo_estado' => 'DEPARTAMENTO',
                'color' => 'green',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'OCUPADO',
                'tipo_estado' => 'DEPARTAMENTO',
                'color' => 'red',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'MANTENIMIENTO',
                'tipo_estado' => 'DEPARTAMENTO',
                'color' => 'yellow',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'LIMPIEZA',
                'tipo_estado' => 'DEPARTAMENTO',
                'color' => 'orange',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'PAGADO',
                'tipo_estado' => 'PAGO',
                'color' => 'green',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'PENDIENTE',
                'tipo_estado' => 'PAGO',
                'color' => 'yellow',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_estado' => 'VENCIDO',
                'tipo_estado' => 'PAGO',
                'color' => 'red',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
         ];

        DB::table('estados')->insert($estados);

    }
}
