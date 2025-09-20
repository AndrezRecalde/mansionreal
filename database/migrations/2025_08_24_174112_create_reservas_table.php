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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_reserva', 100)->unique();
            $table->unsignedBigInteger('huesped_id');
            $table->unsignedBigInteger('departamento_id');
            $table->date('fecha_checkin');
            $table->date('fecha_checkout');
            $table->integer('total_noches')->default(1);
            $table->unsignedBigInteger('estado_id');
            $table->date('fecha_creacion');
            $table->integer('total_adultos')->default(1);
            $table->integer('total_ninos')->default(0);
            $table->integer('total_mascotas')->default(0);
            $table->unsignedBigInteger('usuario_creador_id');
            $table->unsignedBigInteger('usuario_modificador_id')->nullable();
            /* $table->decimal('subtotal', 10, 2)->default(0);
            $table->boolean('aplica_iva')->default(true);
            $table->decimal('tasa_iva', 5, 2)->default(15.00);
            $table->decimal('iva', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0); */
            $table->timestamps();

            $table->foreign('huesped_id')->references('id')->on('huespedes')->onDelete('cascade');
            $table->foreign('departamento_id')->references('id')->on('departamentos')->onDelete('cascade');
            $table->foreign('usuario_creador_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('estado_id')->references('id')->on('estados')->onDelete('cascade');

            $table->index('huesped_id');
            $table->index('departamento_id');
            $table->index('usuario_creador_id');
            $table->index('estado_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
