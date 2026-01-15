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
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inventario_id');
            $table->enum('tipo_movimiento', ['ENTRADA', 'SALIDA', 'AJUSTE', 'CONSUMO', 'DEVOLUCION']);
            $table->integer('cantidad'); // Positivo para entradas, negativo para salidas
            $table->integer('stock_anterior');
            $table->integer('stock_nuevo');
            $table->boolean('estado_anterior')->nullable();
            $table->boolean('estado_nuevo')->nullable();
            $table->string('motivo');
            $table->text('observaciones')->nullable();
            $table->unsignedBigInteger('reserva_id')->nullable();
            $table->unsignedBigInteger('consumo_id')->nullable();
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->timestamp('fecha_movimiento')->useCurrent();
            $table->timestamps();

            $table->foreign('inventario_id')->references('id')->on('inventarios')->onDelete('cascade');
            $table->foreign('reserva_id')->references('id')->on('reservas')->onDelete('set null');
            $table->foreign('consumo_id')->references('id')->on('consumos')->onDelete('set null');
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('set null');

            // Índices para mejorar el rendimiento
            $table->index('inventario_id');
            $table->index('tipo_movimiento');
            $table->index('fecha_movimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventario');
    }
};
