<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('turno_cajas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_id')->constrained('cajas')->onDelete('restrict');
            $table->foreignId('usuario_id')->constrained('users')->onDelete('restrict');
            $table->dateTime('fecha_apertura');
            $table->decimal('monto_apertura_efectivo', 10, 2)->default(0);
            $table->dateTime('fecha_cierre')->nullable();
            $table->decimal('monto_cierre_efectivo_declarado', 10, 2)->nullable();
            $table->decimal('monto_ventas_sistema', 10, 2)->nullable();
            $table->decimal('diferencia', 10, 2)->nullable()->comment('Sobrante/Faltante');
            $table->enum('estado', ['ABIERTO', 'CERRADO'])->default('ABIERTO');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turno_cajas');
    }
};
