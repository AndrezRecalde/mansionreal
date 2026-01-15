<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Reserva;
use App\Models\ClienteFacturacion;

class ReservaClienteFacturacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reservas = Reserva::where('estado_id', 8)->limit(5)->get();
        $clientes = ClienteFacturacion::where('id', '!=', 1)->take(3)->get();

        if ($reservas->isEmpty() || $clientes->isEmpty()) {
            $this->command->warn('No hay suficientes reservas o clientes.');
            return;
        }

        $asignaciones = [];

        foreach ($reservas as $index => $reserva) {
            $cliente = ($index % 2 === 0)
                ? ClienteFacturacion::find(1) // Consumidor final
                : $clientes->random();

            $asignaciones[] = [
                'reserva_id' => $reserva->id,
                'cliente_facturacion_id' => $cliente->id,
                'solicita_factura_detallada' => ($index % 3 === 0),
                'usuario_asigno_id' => 1,
                'fecha_asignacion' => Carbon::now()->subDays($index),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('reserva_cliente_facturacion')->insert($asignaciones);
    }
}
