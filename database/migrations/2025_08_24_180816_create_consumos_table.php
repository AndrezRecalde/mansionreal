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
            $table->timestamps();

            $table->foreign('reserva_id')->references('id')->on('reservas')->onDelete('cascade');
            $table->foreign('factura_id')->references('id')->on('facturas')->onDelete('set null');
            $table->foreign('inventario_id')->references('id')->on('inventarios')->onDelete('restrict');

            $table->index('reserva_id');
            $table->index('factura_id');
            $table->index(['reserva_id', 'factura_id']);
            $table->index('inventario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            // Eliminar foreign key primero
            $table->dropForeign(['factura_id']);

            // Eliminar índice compuesto
            $table->dropIndex(['reserva_id', 'factura_id']);

            // Eliminar columna
            $table->dropColumn('factura_id');
        });
    }
};
