<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('inventarios')->delete();

        $inventarios = [
            [
                'nombre_producto' => 'Habitación Estándar',
                'descripcion' => 'Habitación estándar equipada con las comodidades básicas para una estancia agradable.',
                'precio_unitario' => 100.00,
                'sin_stock' => true,
                'stock' => 0,
                'categoria_id' => 1,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_producto' => 'Cabaña Acogedora',
                'descripcion' => 'Cabaña acogedora con todas las comodidades necesarias para una estancia confortable.',
                'precio_unitario' => 200.00,
                'sin_stock' => true,
                'stock' => 0,
                'categoria_id' => 1,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_producto' => 'La Mansión Real',
                'descripcion' => 'Amplio departamento de lujo con múltiples habitaciones y servicios exclusivos.',
                'precio_unitario' => 800.00,
                'sin_stock' => true,
                'stock' => 0,
                'categoria_id' => 1,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_producto' => 'Salón de Eventos Elegante',
                'descripcion' => 'Espacio amplio y elegante para la celebración de eventos y reuniones.',
                'precio_unitario' => 2000.00,
                'sin_stock' => true,
                'stock' => 0,
                'categoria_id' => 2,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_producto' => 'Estadía Adultos',
                'descripcion' => 'Estadía para adultos en nuestras instalaciones con todas las comodidades.',
                'precio_unitario' => 10.00,
                'sin_stock' => true,
                'stock' => 0,
                'categoria_id' => 2,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_producto' => 'Estadía Niños',
                'descripcion' => 'Estadía para niños en nuestras instalaciones con todas las comodidades.',
                'precio_unitario' => 5.00,
                'sin_stock' => true,
                'stock' => 0,
                'categoria_id' => 2,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];


        DB::table('inventarios')->insert($inventarios);
    }
}
