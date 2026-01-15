<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClienteFacturacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = [
            // CONSUMIDOR FINAL (ID fijo = 1)
            [
                'id' => 1,
                'tipo_cliente' => 'CONSUMIDOR_FINAL',
                'tipo_identificacion' => 'CF',
                'identificacion' => '9999999999999',
                'nombres' => 'CONSUMIDOR',
                'apellidos' => 'FINAL',
                'direccion' => null,
                'telefono' => null,
                'email' => null,
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Clientes Registrados - Ecuador
            [
                'id' => 2,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'CEDULA',
                'identificacion' => '1712345678',
                'nombres' => 'Juan Carlos',
                'apellidos' => 'Pérez González',
                'direccion' => 'Av. 10 de Agosto N45-234 y Jipijapa, Quito',
                'telefono' => '0998765432',
                'email' => 'juan.perez@gmail.com',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'RUC',
                'identificacion' => '1791234567001',
                'nombres' => 'María Fernanda',
                'apellidos' => 'López Martínez',
                'direccion' => 'Calle Guayaquil 123 y Malecón, Guayaquil',
                'telefono' => '0987654321',
                'email' => 'maria. lopez@empresa.com',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 4,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'RUC',
                'identificacion' => '0190123456001',
                'nombres' => 'CORPORACIÓN',
                'apellidos' => 'TURÍSTICA DEL ECUADOR S.A.',
                'direccion' => 'Av. República del Salvador N34-183, Quito',
                'telefono' => '022345678',
                'email' => 'facturacion@corpturistica.com. ec',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Cliente Argentina
            [
                'id' => 5,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'RUC',
                'identificacion' => '20123456789',
                'nombres' => 'Carlos Alberto',
                'apellidos' => 'Rodríguez',
                'direccion' => 'Av. Corrientes 1234, Buenos Aires, Argentina',
                'telefono' => '+5491134567890',
                'email' => 'carlos.rodriguez@gmail.com',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Cliente Perú
            [
                'id' => 6,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'CEDULA',
                'identificacion' => '12345678',
                'nombres' => 'Ana María',
                'apellidos' => 'García Sánchez',
                'direccion' => 'Av. Arequipa 456, Lima, Perú',
                'telefono' => '+51987654321',
                'email' => 'ana.garcia@hotmail.com',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Cliente Colombia
            [
                'id' => 7,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'CEDULA',
                'identificacion' => '1234567890',
                'nombres' => 'Luis Fernando',
                'apellidos' => 'Ramírez Torres',
                'direccion' => 'Carrera 7 No. 71-21, Bogotá, Colombia',
                'telefono' => '+573001234567',
                'email' => 'luis.ramirez@empresa.co',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Cliente USA (Pasaporte)
            [
                'id' => 8,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'PASAPORTE',
                'identificacion' => 'AB1234567',
                'nombres' => 'John',
                'apellidos' => 'Smith Anderson',
                'direccion' => '123 Main Street, New York, NY 10001, USA',
                'telefono' => '+12125551234',
                'email' => 'john.smith@gmail.com',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Cliente Europa (Pasaporte)
            [
                'id' => 9,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'PASAPORTE',
                'identificacion' => 'ES123456',
                'nombres' => 'María del Carmen',
                'apellidos' => 'González Fernández',
                'direccion' => 'Calle Mayor 45, Madrid, España',
                'telefono' => '+34612345678',
                'email' => 'maria.gonzalez@gmail.com',
                'activo' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Cliente Inactivo (para probar filtros)
            [
                'id' => 10,
                'tipo_cliente' => 'CLIENTE_REGISTRADO',
                'tipo_identificacion' => 'CEDULA',
                'identificacion' => '0912345678',
                'nombres' => 'Pedro',
                'apellidos' => 'Morales Inactive',
                'direccion' => 'Av. Test 123',
                'telefono' => '0999999999',
                'email' => 'pedro.inactive@test.com',
                'activo' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('clientes_facturacion')->insert($clientes);
    }
}
