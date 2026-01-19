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
        // Obtener algunas reservas existentes (asume que ya hay reservas creadas)
        $reservas = Reserva::with('consumos')->limit(5)->get();

        if ($reservas->isEmpty()) {
            $this->command->warn('No hay reservas en la base de datos.  Ejecuta primero ReservaSeeder.');
            return;
        }

        // Obtener clientes
        $consumidorFinal = ClienteFacturacion::find(1);
        $clientesRegistrados = ClienteFacturacion::where('id', '!=', 1)
            ->where('activo', true)
            ->take(3)
            ->get();

        $facturas = [];
        $facturaId = 1;

        foreach ($reservas as $index => $reserva) {
            // Alternar entre consumidor final y clientes registrados
            $cliente = ($index % 2 === 0)
                ? $consumidorFinal
                : $clientesRegistrados->random();

            // Calcular totales desde consumos
            $subtotalSinIva = 0;
            $subtotalConIva = 0;
            $totalIva = 0;

            foreach ($reserva->consumos as $consumo) {
                if ($consumo->tasa_iva > 0) {
                    $subtotalConIva += $consumo->subtotal;
                    $totalIva += $consumo->iva;
                } else {
                    $subtotalSinIva += $consumo->subtotal;
                }
            }

            $descuento = ($index === 1) ? 10.00 : 0.00; // Una factura con descuento
            $totalFactura = $subtotalSinIva + $subtotalConIva + $totalIva - $descuento;

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

                // Totales
                'subtotal_sin_iva' => $subtotalSinIva,
                'subtotal_con_iva' => $subtotalConIva,
                'total_iva' => $totalIva,
                'descuento' => $descuento,
                'total_factura' => $totalFactura,

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
    }
}
