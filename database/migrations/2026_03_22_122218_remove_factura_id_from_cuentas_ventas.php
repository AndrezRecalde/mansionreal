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
        Schema::table('cuentas_ventas', function (Blueprint $table) {
            $table->dropForeign(['factura_id']);
            $table->dropColumn('factura_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas_ventas', function (Blueprint $table) {
            $table->unsignedBigInteger('factura_id')->nullable()->after('saldo_pendiente');
            // Nota: Aquí se podría restaurar la FK si se conoce exactamente el nombre original
            // $table->foreign('factura_id')->references('id')->on('facturas')->onDelete('set null');
        });
    }
};
