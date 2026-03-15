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
        // 1. Definición de todos los permisos del sistema
        $permisos = [
            // Facturación y Ventas (Existentes)
            'ver_clientes_facturacion',
            'ver_facturas',
            'ver_secuencias_facturas',
            'ver_consumos_externos',
            'ver_pagos_externos',
            'ver_totales_externos',

            // Configuración
            'gestionar_usuarios',
            'gestionar_departamentos',
            'gestionar_servicios',
            'gestionar_limpiezas',
            'configurar_iva',

            // Reservas
            'gestionar_calendario_reservas',
            'gestionar_disponibilidad',
            'gestionar_huespedes',

            // Reportes e Historiales
            'ver_reporte_reservas',
            'ver_reporte_consumos',
            'ver_historial_reservas',
            'ver_historial_pagos',

            // Inventario
            'gestionar_categorias_inventario',
            'gestionar_inventario',

            // Gastos y Daños
            'gestionar_gastos_danos',
        ];

        // 2. Crear permisos en la base de datos
        foreach ($permisos as $nombre) {
            Permission::firstOrCreate(
            ['name' => $nombre, 'guard_name' => 'web']
            );
        }

        // 3. Asignación a roles principales
        $admin = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'ADMINISTRADOR', 'guard_name' => 'web']);
        $gerente = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'GERENCIA', 'guard_name' => 'web']);
        $asistente = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'ASISTENTE', 'guard_name' => 'web']);

        // El Administrador tiene acceso a TODO
        $admin->syncPermissions(Permission::where('guard_name', 'web')->get());

        // El Gerente tiene acceso a operaciones, pero no configuración de usuarios/iva
        $gerente->syncPermissions(Permission::where('guard_name', 'web')->whereIn('name', [
            'gestionar_departamentos',
            'gestionar_servicios',
            'gestionar_limpiezas',
            'gestionar_calendario_reservas',
            'gestionar_disponibilidad',
            'gestionar_huespedes',
            'ver_reporte_reservas',
            'ver_reporte_consumos',
            'ver_historial_reservas',
            'ver_historial_pagos',
            'gestionar_categorias_inventario',
            'gestionar_inventario',
            'gestionar_gastos_danos',
        ])->get());

        $asistente->syncPermissions(Permission::where('guard_name', 'web')->whereIn('name', [
            'ver_clientes_facturacion',
            'ver_facturas',
            'ver_secuencias_facturas',
            'ver_consumos_externos',
            'ver_pagos_externos',
            'ver_totales_externos',
        ])->get());


        $this->command->info('Nuevos permisos PBAC creados y sincronizados correctamente.');
    }
}
