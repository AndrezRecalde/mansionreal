<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
            $table->boolean('solicita_factura_detallada')
                ->default(false)
                ->after('observaciones')
                ->comment('Aplica a ventas de mostrador; para reservas se lee del pivot.');
        });
    }

    public function down(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
            $table->dropColumn('solicita_factura_detallada');
        });
    }
};
