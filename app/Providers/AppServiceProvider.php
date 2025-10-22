<?php

namespace App\Providers;

use App\Models\Inventario;
use App\Observers\InventarioObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //Inventario::observe(InventarioObserver::class);
    }
}
