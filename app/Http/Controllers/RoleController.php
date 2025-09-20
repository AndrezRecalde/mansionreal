<?php

namespace App\Http\Controllers;

use App\Enums\DataRoles;
use App\Enums\HTTPStatus;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    function getRoles(): JsonResponse
    {
        $roles = Role::orderBy('id', 'ASC')->get(['id', 'name']);
        $user = auth()->user();

        // Verifica si el usuario tiene el rol ADMINISTRADOR
        if ($user && $user->hasRole(DataRoles::ADMINISTRADOR)) {
            // Retorna todos los roles
            $rolesFiltrados = $roles;
        } else {
            // Retorna todos excepto el primero
            $rolesFiltrados = $roles->skip(1)->take(50)->values();
        }

        return response()->json([
            'status' => HTTPStatus::Success,
            'roles' => $rolesFiltrados
        ]);
    }
}
