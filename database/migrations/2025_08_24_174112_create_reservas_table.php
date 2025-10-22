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

            $table->enum('tipo_reserva', ['HOSPEDAJE', 'ESTADIA'])->default('HOSPEDAJE');

            $table->unsignedBigInteger('huesped_id');
            $table->unsignedBigInteger('departamento_id')->nullable();
            $table->date('fecha_checkin');
            $table->date('fecha_checkout');
            $table->integer('total_noches')->default(1);
            $table->unsignedBigInteger('estado_id');
            $table->timestamp('fecha_creacion');
            $table->integer('total_adultos')->default(1);
            $table->integer('total_ninos')->default(0);
            $table->integer('total_mascotas')->default(0);
            $table->unsignedBigInteger('usuario_creador_id');
            $table->unsignedBigInteger('usuario_modificador_id')->nullable();
            $table->enum('motivo_cancelacion', [
                'ERROR_TIPEO',
                'CAMBIO_FECHAS',
                'CAMBIO_HUESPED',
                'SOLICITUD_CLIENTE',
                'FUERZA_MAYOR',
                'OTRO'
            ])->nullable();
            $table->text('observacion_cancelacion')->nullable();
            $table->timestamp('fecha_cancelacion')->nullable();
            $table->unsignedBigInteger('usuario_cancelador_id')->nullable();
            $table->timestamps();

            $table->foreign('huesped_id')->references('id')->on('huespedes')->onDelete('cascade');
            $table->foreign('departamento_id')->references('id')->on('departamentos')->onDelete('cascade');
            $table->foreign('usuario_creador_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('estado_id')->references('id')->on('estados')->onDelete('cascade');
            $table->foreign('usuario_cancelador_id')->references('id')->on('users')->onDelete('cascade');

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
