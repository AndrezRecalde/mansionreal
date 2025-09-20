<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $this->call(AplicativoSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(ProvinciaSeeder::class);
        $this->call(EstadoSeeder::class);
        $this->call(TipoDepartamentoSeeder::class);
        $this->call(ServicioSeeder::class);
        $this->call(CategoriaSeeder::class);
        $this->call(ConfiguracionIvaSeeder::class);
        $this->call(TiposDanosSeeder::class);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
