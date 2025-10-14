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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reserva_id');
            $table->string('codigo_voucher', 100);
            $table->unsignedBigInteger('concepto_pago_id');
            $table->decimal('monto', 10, 2);
            $table->enum('metodo_pago', ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO'])->default('EFECTIVO');
            $table->timestamp('fecha_pago')->useCurrent();
            $table->text('observaciones')->nullable();
            $table->unsignedBigInteger('usuario_creador_id');
            $table->unsignedBigInteger('usuario_modificador_id')->nullable();
            $table->timestamps();

            $table->foreign('reserva_id')->references('id')->on('reservas')->onDelete('cascade');
            $table->foreign('concepto_pago_id')->references('id')->on('conceptos_pagos ')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
