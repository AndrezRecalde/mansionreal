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
        Schema::create('secuencia_facturas', function (Blueprint $table) {
            $table->id();
            // Configuración del punto de emisión (simulación formato SRI Ecuador)
            $table->string('establecimiento', 3)->default('001')->comment('Código de establecimiento (3 dígitos)');
            $table->string('punto_emision', 3)->default('001')->comment('Código de punto de emisión (3 dígitos)');

            // Control del secuencial
            $table->unsignedBigInteger('secuencial_actual')->default(0)->comment('Último número usado');
            $table->unsignedBigInteger('secuencial_inicio')->default(1)->comment('Número inicial');
            $table->unsignedBigInteger('secuencial_fin')->nullable()->comment('Número final (NULL = sin límite)');

            // Configuración
            $table->boolean('activo')->default(true);
            $table->text('descripcion')->nullable()->comment('Descripción del punto de emisión');

            // Formato del número
            $table->integer('longitud_secuencial')->default(9)->comment('Cantidad de dígitos del secuencial (ej: 9 = 000000001)');

            $table->timestamps();

            // Constraint único por establecimiento + punto de emisión
            $table->unique(['establecimiento', 'punto_emision'], 'unique_punto_emision');

            // Índices
            $table->index('activo');
        });

        // Insertar configuración inicial para Hotel Mansión Real
        /* DB::table('secuencia_facturas')->insert([
            'id' => 1,
            'establecimiento' => '001',
            'punto_emision' => '001',
            'secuencial_actual' => 0,
            'secuencial_inicio' => 1,
            'secuencial_fin' => null, // Sin límite
            'activo' => true,
            'descripcion' => 'Hotel Mansión Real - Punto de Emisión Principal',
            'longitud_secuencial' => 9,
            'created_at' => now(),
            'updated_at' => now(),
        ]); */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secuencia_facturas');
    }
};
