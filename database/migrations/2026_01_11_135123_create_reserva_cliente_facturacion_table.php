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
        Schema::create('reserva_cliente_facturacion', function (Blueprint $table) {
            $table->id();
            // Relación reserva - cliente facturación
            $table->unsignedBigInteger('reserva_id')->comment('Una reserva tiene un solo cliente'); // YA NO ES UNIQUE porque puede cambiarse
            $table->unsignedBigInteger('cliente_facturacion_id')->comment('Puede ser id=1 para CONSUMIDOR FINAL');

            // Indica si se solicitó factura con datos o es consumidor final
            $table->boolean('solicita_factura_detallada')->default(false)->comment('false = Consumidor Final, true = Con datos');

            // Auditoria
            $table->unsignedBigInteger('usuario_asigno_id')->nullable()->comment('Usuario que asignó el cliente');

            $table->timestamps();

            // Relaciones
            $table->foreign('reserva_id')->references('id')->on('reservas')->onDelete('cascade');
            $table->foreign('cliente_facturacion_id')->references('id')->on('clientes_facturacion')->onDelete('cascade');
            $table->foreign('usuario_asigno_id')->references('id')->on('users')->onDelete('set null');

            // Índices
            $table->index('reserva_id');
            $table->index('cliente_facturacion_id');
            $table->index('solicita_factura_detallada');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reserva_cliente_facturacion');
    }
};
