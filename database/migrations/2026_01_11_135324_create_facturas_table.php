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
        Schema::create('facturas', function (Blueprint $table) {
            $table->id();
            // Número de factura secuencial único (formato:  001-001-000001234)
            $table->string('numero_factura', 50)->unique();

            // Relaciones principales
            $table->unsignedBigInteger('reserva_id')->comment('Una factura por reserva');
            $table->unsignedBigInteger('cliente_facturacion_id')->comment('Referencia al cliente (puede ser id=1 CF)');

            // Fecha de emisión
            $table->date('fecha_emision');

            // ====================================================================
            // DATOS DEL CLIENTE "CONGELADOS" (inmutabilidad fiscal)
            // Se copian de clientes_facturacion al momento de generar la factura
            // ====================================================================
            $table->string('cliente_tipo_identificacion', 20);
            $table->string('cliente_identificacion', 20)->comment('DNI/RUC del cliente al momento de emisión');
            $table->string('cliente_nombres_completos', 300);
            $table->text('cliente_direccion')->nullable();
            $table->string('cliente_telefono', 15)->nullable();
            $table->string('cliente_email', 100)->nullable();

            // ====================================================================
            // TOTALES DE LA FACTURA (calculados desde consumos)
            // ====================================================================
            $table->decimal('subtotal_sin_iva', 10, 2)->default(0)->comment('Base 0% - Productos sin IVA');
            //$table->decimal('subtotal_con_iva', 10, 2)->default(0)->comment('Base gravada - Productos con IVA');
            $table->decimal('total_iva', 10, 2)->default(0)->comment('Total IVA calculado');
            $table->decimal('total_factura', 10, 2)->default(0)->comment('Total final a pagar');

            // Descuentos (opcional para futuras promociones)
            $table->decimal('descuento', 10, 2)->default(0);
            $table->decimal('total_con_descuento', 10, 2)->default(0)->comment('Total final con descuento aplicado');


            // ====================================================================
            // ESTADO Y CONTROL
            // ====================================================================
            $table->enum('estado', ['EMITIDA', 'ANULADA'])->default('EMITIDA');
            $table->text('observaciones')->nullable();

            // ====================================================================
            // ANULACIÓN DE FACTURA (auditoría)
            // ====================================================================
            $table->text('motivo_anulacion')->nullable();
            $table->timestamp('fecha_anulacion')->nullable();
            $table->unsignedBigInteger('usuario_anulo_id')->nullable();

            // Usuario que generó la factura
            $table->unsignedBigInteger('usuario_genero_id');

            $table->timestamps();

            // ====================================================================
            // RELACIONES Y CONSTRAINTS
            // ====================================================================
            $table->foreign('reserva_id')->references('id')->on('reservas')->onDelete('cascade');
            $table->foreign('cliente_facturacion_id')->references('id')->on('clientes_facturacion')->onDelete('restrict');
            $table->foreign('usuario_genero_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('usuario_anulo_id')->references('id')->on('users')->onDelete('set null');

            // ====================================================================
            // ÍNDICES PARA OPTIMIZACIÓN
            // ====================================================================
            $table->index('numero_factura');
            $table->index('reserva_id');
            $table->index('cliente_facturacion_id');
            $table->index('fecha_emision');
            $table->index('estado');
            $table->index('cliente_identificacion');
            $table->index(['fecha_emision', 'estado']); // Para reportes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
