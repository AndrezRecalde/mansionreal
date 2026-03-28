<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_resumen_consumos_estadia;");
        
        DB::unprepared("
            CREATE PROCEDURE sp_resumen_consumos_estadia(
                IN p_fecha_inicio DATE,
                IN p_fecha_fin DATE,
                IN p_anio INT
            )
            BEGIN
                SELECT
                    i.id as inventario_id,
                    i.nombre_producto,
                    SUM(c.cantidad) as total_cantidad,
                    SUM(c.subtotal) as total_subtotal,
                    SUM(c.descuento) as total_descuento,
                    SUM(c.total) as total_monto
                FROM consumos c
                INNER JOIN inventarios i ON c.inventario_id = i.id
                INNER JOIN categorias cat ON i.categoria_id = cat.id
                INNER JOIN facturas f ON c.factura_id = f.id
                WHERE cat.nombre_categoria = 'ESTADIA'
                  AND f.estado = 'EMITIDA'
                  AND (p_fecha_inicio IS NULL OR DATE(c.fecha_creacion) >= p_fecha_inicio)
                  AND (p_fecha_fin IS NULL OR DATE(c.fecha_creacion) <= p_fecha_fin)
                  AND (p_anio IS NULL OR YEAR(c.fecha_creacion) = p_anio)
                  AND c.deleted_at IS NULL
                GROUP BY i.id, i.nombre_producto
                ORDER BY total_monto DESC;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_resumen_consumos_estadia;");
    }
};
