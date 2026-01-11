<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes_facturacion', function (Blueprint $table) {
            $table->id();
            // Tipo de cliente
            $table->enum('tipo_cliente', ['CONSUMIDOR_FINAL', 'CLIENTE_REGISTRADO'])->default('CLIENTE_REGISTRADO');

            // Tipo de identificación
            $table->enum('tipo_identificacion', ['CEDULA', 'RUC', 'PASAPORTE', 'CF'])->default('CEDULA');

            // Datos del cliente
            $table->string('identificacion', 20)->unique()->comment('DNI/RUC o 9999999999999 para CF');
            $table->string('nombres', 150);
            $table->string('apellidos', 150);
            $table->text('direccion')->nullable();
            $table->string('telefono', 15)->nullable();
            $table->string('email', 100)->nullable();

            // Control
            $table->boolean('activo')->default(true);
            $table->text('observaciones')->nullable();

            $table->timestamps();

            // Índices
            $table->index('identificacion');
            $table->index('tipo_cliente');
            $table->index('tipo_identificacion');
            $table->index('activo');
        });

        // Insertar CONSUMIDOR FINAL por defecto (ID fijo = 1)
        DB::table('clientes_facturacion')->insert([
            'id' => 1,
            'tipo_cliente' => 'CONSUMIDOR_FINAL',
            'tipo_identificacion' => 'CF',
            'identificacion' => '9999999999999',
            'nombres' => 'CONSUMIDOR',
            'apellidos' => 'FINAL',
            'direccion' => 'S/N',
            'telefono' => null,
            'email' => null,
            'activo' => true,
            'observaciones' => 'Cliente por defecto para facturas sin identificación',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes_facturacion');
    }
};
