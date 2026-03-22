<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Traspasar los IDs de facturas asociados a cuentas de venta
        DB::statement("
            UPDATE facturas f
            JOIN cuentas_ventas cv ON cv.factura_id = f.id
            SET f.cuenta_venta_id = cv.id
            WHERE cv.factura_id IS NOT NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // En reversa, restauramos los IDs en cuentas_ventas desde facturas
        DB::statement("
            UPDATE cuentas_ventas cv
            JOIN facturas f ON f.cuenta_venta_id = cv.id
            SET cv.factura_id = f.id
            WHERE f.cuenta_venta_id IS NOT NULL
        ");
    }
};
