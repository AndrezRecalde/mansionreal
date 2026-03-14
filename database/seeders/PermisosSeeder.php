<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermisosSeeder extends Seeder
{
    /**
     * Permisos especiales para el rol ASISTENTE.
     * Estos permisos permiten acceder a secciones de facturación y venta de mostrador.
     */
    public function run(): void
    {
        $permisos = [
            'ver_clientes_facturacion',
            'ver_facturas',
            'ver_secuencias_facturas',
            'ver_consumos_externos',
            'ver_pagos_externos',
            'ver_totales_externos',
        ];

        foreach ($permisos as $nombre) {
            Permission::firstOrCreate(
                ['name' => $nombre, 'guard_name' => 'sanctum']
            );
        }

        $this->command->info('Permisos creados/verificados correctamente.');
    }
}
