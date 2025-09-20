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
        Schema::create('consumos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reserva_id');
            $table->unsignedBigInteger('inventario_id');
            $table->integer('cantidad');
            $table->date('fecha_creacion');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tasa_iva', 5, 2)->default(15.00);
            $table->decimal('iva', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->boolean('aplica_iva')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consumos');
    }
};
