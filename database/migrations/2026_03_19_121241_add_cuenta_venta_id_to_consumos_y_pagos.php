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
        Schema::table('consumos', function (Blueprint $table) {
            $table->foreignId('cuenta_venta_id')->nullable()->constrained('cuentas_ventas')->nullOnDelete();
        });

        Schema::table('pagos', function (Blueprint $table) {
            $table->foreignId('cuenta_venta_id')->nullable()->constrained('cuentas_ventas')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            $table->dropForeign(['cuenta_venta_id']);
            $table->dropColumn('cuenta_venta_id');
        });

        Schema::table('pagos', function (Blueprint $table) {
            $table->dropForeign(['cuenta_venta_id']);
            $table->dropColumn('cuenta_venta_id');
        });
    }
};
