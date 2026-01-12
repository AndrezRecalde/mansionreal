<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Facturacion\FacturaService;
use App\Services\Facturacion\ClienteFacturacionService;
use App\Services\Facturacion\SecuenciaFacturaService;

class FacturacionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar como singletons
        $this->app->singleton(ClienteFacturacionService::class);
        $this->app->singleton(SecuenciaFacturaService::class);
        $this->app->singleton(FacturaService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
