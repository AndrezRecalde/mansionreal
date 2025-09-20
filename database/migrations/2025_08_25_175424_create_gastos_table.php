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
        // Se refiere a los gastos adicionales que puede tener una reserva, como son los daños de la propiedad, limpieza extra, etc.
        Schema::create('gastos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reserva_id');
            $table->text('descripcion');
            $table->decimal('monto', 10, 2);
            $table->unsignedBigInteger('tipo_dano_id');
            $table->date('fecha_creacion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
};
