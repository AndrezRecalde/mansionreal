<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();
        Role::truncate();

        $administradorRole  = Role::create(['name' => 'ADMINISTRADOR']);
        $gerenciaRole       = Role::create(['name' => 'GERENTE']);

        $admin = New User;
        $admin->apellidos = 'Recalde Solano';
        $admin->nombres = 'Cristhian Andres';
        $admin->dni = '0802704171';
        $admin->email = 'azw1021@gmail.com';
        $admin->password = Hash::make('a123456');
        $admin->activo = 1;
        $admin->save();
        $admin->assignRole($administradorRole);
    }
}
