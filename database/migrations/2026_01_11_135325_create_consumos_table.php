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
            $table->unsignedBigInteger('factura_id')->nullable();
            $table->unsignedBigInteger('inventario_id');

            $table->integer('cantidad');
            $table->date('fecha_creacion');

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tasa_iva', 5, 2)->default(15.00);
            $table->decimal('iva', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            // ====================================================================
            // DESCUENTOS A NIVEL DE CONSUMO
            // ====================================================================
            $table->decimal('descuento', 10, 2)->default(0)->comment('Monto de descuento aplicado');
            $table->enum('tipo_descuento', ['MONTO_FIJO', 'PORCENTAJE', 'SIN_DESCUENTO'])->default('SIN_DESCUENTO')->comment('Tipo de descuento aplicado');
            $table->decimal('porcentaje_descuento', 5, 2)->nullable()->comment('Porcentaje si tipo_descuento es PORCENTAJE');
            $table->text('motivo_descuento')->nullable()->comment('Justificación del descuento aplicado');
            $table->unsignedBigInteger('usuario_registro_descuento_id')->nullable()->comment('Usuario que autorizó el descuento');

            $table->unsignedBigInteger('creado_por_usuario_id')->nullable();
            $table->unsignedBigInteger('actualizado_por_usuario_id')->nullable();
            $table->timestamps();


            $table->foreign('reserva_id')->references('id')->on('reservas')->onDelete('cascade');
            $table->foreign('factura_id')->references('id')->on('facturas')->onDelete('set null');
            $table->foreign('inventario_id')->references('id')->on('inventarios')->onDelete('restrict');
            $table->foreign('creado_por_usuario_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('actualizado_por_usuario_id')->references('id')->on('users')->onDelete('set null');


            $table->index('reserva_id');
            $table->index('factura_id');
            $table->index(['reserva_id', 'factura_id']);
            $table->index('inventario_id');
            $table->index('creado_por_usuario_id');
            $table->index('actualizado_por_usuario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /*  Schema::table('consumos', function (Blueprint $table) {
            // Eliminar foreign key primero
            $table->dropForeign(['factura_id']);

            // Eliminar índice compuesto
            $table->dropIndex(['reserva_id', 'factura_id']);

            // Eliminar columna
            $table->dropColumn('factura_id');
        }); */
        Schema::dropIfExists('consumos');
    }
};
