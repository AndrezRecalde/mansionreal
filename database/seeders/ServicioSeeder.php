<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ServicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('servicios')->delete();
        $servicios = [
            [
                'nombre_servicio'   => 'Baño',
                'tipo_servicio'     => 'Productos de limpieza',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Baño',
                'tipo_servicio'     => 'Ducha',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Baño',
                'tipo_servicio'     => 'Productos de limpieza',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Dormitorio y lavadero',
                'tipo_servicio'     => 'Servicios imprescindibles (Toallas, sábanas, jabón y papel higiénico)',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Dormitorio y lavadero',
                'tipo_servicio'     => 'Ganchos para ropa',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Dormitorio y lavadero',
                'tipo_servicio'     => 'Sabanas',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Dormitorio y lavadero',
                'tipo_servicio'     => 'Almohadas y mantas adicionales',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Dormitorio y lavadero',
                'tipo_servicio'     => 'Persianas o cortinas opacas',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Dormitorio y lavadero',
                'tipo_servicio'     => 'Espacio para guardar la ropa: armario o ropero',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Entretenimiento',
                'tipo_servicio'     => 'Televisión',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Entretenimiento',
                'tipo_servicio'     => 'TV con servicio de cable o satélite',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Entretenimiento',
                'tipo_servicio'     => 'Servicio de streaming (Netflix, Disney+, etc.)',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Seguridad en el hogar',
                'tipo_servicio'     => 'Detector de humo',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Seguridad en el hogar',
                'tipo_servicio'     => 'Detector de monóxido de carbono',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Seguridad en el hogar',
                'tipo_servicio'     => 'Extintor de incendios',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Seguridad en el hogar',
                'tipo_servicio'     => 'Botiquín de primeros auxilios',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Internet y oficina',
                'tipo_servicio'     => 'Wifi',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Internet y oficina',
                'tipo_servicio'     => 'Espacio de trabajo apto para un portátil',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Cafetera',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Hervidor eléctrico',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Microondas',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Licuadora',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Refrigerador',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Estufa o cocina',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Utensilios de cocina, platos, vasos y cubiertos',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Cocina y comedor',
                'tipo_servicio'     => 'Mesa de comedor y sillas',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Características de la ubicación',
                'tipo_servicio'     => 'Costa',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Características de la ubicación',
                'tipo_servicio'     => 'Acceso a la playa',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Características de la ubicación',
                'tipo_servicio'     => 'Entrada independiente',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Exteriores y vistas',
                'tipo_servicio'     => 'Vista a la playa',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Exteriores y vistas',
                'tipo_servicio'     => 'Patio o balcón privado',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Exteriores y vistas',
                'tipo_servicio'     => 'Parasoles',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Exteriores y vistas',
                'tipo_servicio'     => 'Estacionamiento gratuito en las instalaciones',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'nombre_servicio'   => 'Exteriores y vistas',
                'tipo_servicio'     => 'Piscina al aire libre compartida',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ];
        DB::table('servicios')->insert($servicios);
    }
}
