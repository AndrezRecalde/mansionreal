<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Reserva;
use App\Models\ClienteFacturacion;
use App\Models\Consumo;

class FacturaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🔄 Generando facturas de prueba...');

        // Obtener reservas con consumos
        $reservas = Reserva::with('consumos')
            ->has('consumos')
            ->whereDoesntHave('factura')
            ->take(5)
            ->get();

        if ($reservas->isEmpty()) {
            $this->command->warn('⚠️  No hay reservas disponibles para facturar');
            return;
        }

        $facturas = [];
        $facturaId = 1;

        foreach ($reservas as $index => $reserva) {
            // Alternar entre consumidor final y clientes registrados
            $cliente = ($index % 2 === 0)
                ? ClienteFacturacion::consumidorFinal()
                : ClienteFacturacion::registrados()->inRandomOrder()->first();

            if (!$cliente) {
                continue;
            }

            // ✅ ACTUALIZADO: Calcular totales según SRI
            $subtotalSinIva = 0;
            $tasa_iva = 15.00;

            foreach ($reserva->consumos as $consumo) {
                $subtotalSinIva += $consumo->subtotal;
            }

            // Aplicar descuento solo a algunas facturas
            $descuento = ($index === 1) ? 20.00 : 0.00;
            $tipoDescuento = ($index === 1) ? 'MONTO_FIJO' : null;
            $motivoDescuento = ($index === 1) ? 'Descuento por cliente frecuente' : null;

            // ✅ Calcular según normativa SRI
            $baseImponible = $subtotalSinIva - $descuento;
            $totalIva = $baseImponible * ($tasa_iva / 100);
            $totalFactura = $baseImponible + $totalIva; // ✅ Total final (CON descuento)

            // Determinar estado (una factura anulada para pruebas)
            $estado = ($index === 2) ? 'ANULADA' : 'EMITIDA';
            $fechaAnulacion = ($estado === 'ANULADA') ? Carbon::now()->subDays(1) : null;
            $motivoAnulacion = ($estado === 'ANULADA') ? 'Factura de prueba anulada por error en datos del cliente' : null;

            $factura = [
                'id' => $facturaId,
                'numero_factura' => sprintf('001-001-%09d', $facturaId),
                'reserva_id' => $reserva->id,
                'cliente_facturacion_id' => $cliente->id,
                'fecha_emision' => Carbon::now()->subDays($index),

                // Copiar datos del cliente (inmutabilidad)
                'cliente_tipo_identificacion' => $cliente->tipo_identificacion,
                'cliente_identificacion' => $cliente->identificacion,
                'cliente_nombres_completos' => $cliente->nombres_completos,
                'cliente_direccion' => $cliente->direccion,
                'cliente_telefono' => $cliente->telefono,
                'cliente_email' => $cliente->email,

                // ✅ ACTUALIZADO: Totales
                'subtotal_sin_iva' => $subtotalSinIva,
                'total_iva' => $totalIva,
                'descuento' => $descuento,
                'tipo_descuento' => $tipoDescuento,
                'motivo_descuento' => $motivoDescuento,
                'total_factura' => $totalFactura, // ✅ Total final (CON descuento)
                // 'total_con_descuento' => ...   // ❌ ELIMINADO

                // Estado
                'estado' => $estado,
                'observaciones' => ($index === 0) ? 'Factura de prueba generada por seeder' : null,
                'motivo_anulacion' => $motivoAnulacion,
                'fecha_anulacion' => $fechaAnulacion,
                'usuario_anulo_id' => ($estado === 'ANULADA') ? 1 : null,
                'usuario_genero_id' => 1,

                'created_at' => Carbon::now()->subDays($index),
                'updated_at' => Carbon::now()->subDays($index),
            ];

            $facturas[] = $factura;

            // Asociar consumos a la factura (si está EMITIDA)
            if ($estado === 'EMITIDA') {
                Consumo::where('reserva_id', $reserva->id)
                    ->update(['factura_id' => $facturaId]);
            }

            $facturaId++;
        }

        DB::table('facturas')->insert($facturas);

        $this->command->info('✅ Facturas de prueba creadas correctamente');
        $this->command->info("   - Total facturas: " . count($facturas));
        $this->command->info("   - Con descuento: " . collect($facturas)->where('descuento', '>', 0)->count());
        $this->command->info("   - Anuladas: " . collect($facturas)->where('estado', 'ANULADA')->count());
    }
}
