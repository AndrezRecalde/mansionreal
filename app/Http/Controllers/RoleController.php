<?php

namespace App\Http\Controllers;

use App\Enums\DataRoles;
use App\Enums\HTTPStatus;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Listar roles.
     * El ADMINISTRADOR ve todos; el resto no ve el primer rol (ADMINISTRADOR).
     */
    public function getRoles(): JsonResponse
    {
        $roles = Role::with('permissions')->orderBy('id', 'ASC')->get(['id', 'name']);
        $user = auth()->user();

        if ($user && $user->hasRole(DataRoles::ADMINISTRADOR)) {
            $rolesFiltrados = $roles;
        }
        else {
            $rolesFiltrados = $roles->skip(1)->take(50)->values();
        }

        return response()->json([
            'status' => HTTPStatus::Success,
            'roles' => $rolesFiltrados,
        ], 200);
    }

    /**
     * Listar todos los permisos disponibles en el sistema.
     */
    public function getPermisos(): JsonResponse
    {
        try {
            $permisos = Permission::orderBy('id', 'ASC')->get(['id', 'name']);
            return response()->json([
                'status' => HTTPStatus::Success,
                'permisos' => $permisos,
            ]);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear un nuevo rol.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:roles,name|max:100',
            ]);

            $rol = Role::create([
                'name' => strtoupper($request->name),
                'guard_name' => 'web',
            ]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Creacion,
                'rol' => $rol,
            ], 201);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar el nombre de un rol.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $rol = Role::findOrFail($id);

            $request->validate([
                'name' => 'required|string|unique:roles,name,' . $id . '|max:100',
            ]);

            $rol->update(['name' => strtoupper($request->name)]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Actualizado,
                'rol' => $rol,
            ]);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un rol.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $rol = Role::findOrFail($id);
            $rol->delete();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Rol eliminado correctamente',
            ]);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener los permisos asignados a un rol.
     */
    public function getPermisosDeRol(int $id): JsonResponse
    {
        try {
            $rol = Role::with('permissions')->findOrFail($id);
            return response()->json([
                'status' => HTTPStatus::Success,
                'permisos' => $rol->permissions->map(fn($p) => ['id' => $p->id, 'name' => $p->name]),
            ]);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Sincronizar permisos de un rol (reemplaza todos los permisos del rol).
     */
    public function asignarPermisos(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'permisos' => 'array',
                'permisos.*' => 'string|exists:permissions,name',
            ]);

            $rol = Role::findOrFail($id);
            $rol->syncPermissions($request->permisos ?? []);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Permisos del rol actualizados correctamente',
            ]);
        }
        catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }
}
