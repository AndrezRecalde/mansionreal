<?php

namespace App\Console\Commands;

use App\Models\ConfiguracionIva;
use Illuminate\Console\Command;

class ActualizarIvas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ivas:actualizar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza las tasas de IVA según la fecha y activa la tasa estándar si corresponde';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ConfiguracionIva::actualizarTasas();
        $this->info('Tasas de IVA actualizadas correctamente.');
        return 0;
    }
}
