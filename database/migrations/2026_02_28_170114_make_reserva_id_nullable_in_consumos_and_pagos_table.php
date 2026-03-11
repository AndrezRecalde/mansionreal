<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Hacer reserva_id nullable en consumos y pagos para soportar
     * ventas de mostrador (clientes externos sin reserva activa).
     */
    public function up(): void
    {
        // ─── CONSUMOS ────────────────────────────────────────────────
        // 1. Drop FK y los índices que la usan
        Schema::table('consumos', function (Blueprint $table) {
            $table->dropForeign(['reserva_id']);
            $table->dropIndex(['reserva_id']);
            $table->dropIndex(['reserva_id', 'factura_id']);
        });

        // 2. Modificar columna a nullable (raw SQL para compatibilidad)
        DB::statement('ALTER TABLE consumos MODIFY reserva_id BIGINT UNSIGNED NULL');

        // 3. Re-crear FK y los índices
        Schema::table('consumos', function (Blueprint $table) {
            $table->foreign('reserva_id')
                ->references('id')->on('reservas')
                ->onDelete('cascade');

            $table->index('reserva_id');
            $table->index(['reserva_id', 'factura_id']);
        });

        // ─── PAGOS ────────────────────────────────────────────────────
        Schema::table('pagos', function (Blueprint $table) {
            $table->dropForeign(['reserva_id']);
        });

        DB::statement('ALTER TABLE pagos MODIFY reserva_id BIGINT UNSIGNED NULL');

        Schema::table('pagos', function (Blueprint $table) {
            $table->foreign('reserva_id')
                ->references('id')->on('reservas')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse: volver a NOT NULL.
     * ⚠️ Solo funciona si no hay filas con reserva_id = NULL.
     */
    public function down(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            $table->dropForeign(['reserva_id']);
            $table->dropIndex(['reserva_id']);
            $table->dropIndex(['reserva_id', 'factura_id']);
        });

        DB::statement('ALTER TABLE consumos MODIFY reserva_id BIGINT UNSIGNED NOT NULL');

        Schema::table('consumos', function (Blueprint $table) {
            $table->foreign('reserva_id')
                ->references('id')->on('reservas')
                ->onDelete('cascade');
            $table->index('reserva_id');
            $table->index(['reserva_id', 'factura_id']);
        });

        Schema::table('pagos', function (Blueprint $table) {
            $table->dropForeign(['reserva_id']);
        });

        DB::statement('ALTER TABLE pagos MODIFY reserva_id BIGINT UNSIGNED NOT NULL');

        Schema::table('pagos', function (Blueprint $table) {
            $table->foreign('reserva_id')
                ->references('id')->on('reservas')
                ->onDelete('cascade');
        });
    }
};
