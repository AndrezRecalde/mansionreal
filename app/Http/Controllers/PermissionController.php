<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Listar todos los permisos.
     */
    public function index(): JsonResponse
    {
        try {
            $permisos = Permission::orderBy('id', 'ASC')->get(['id', 'name', 'guard_name']);
            return response()->json([
                'status' => HTTPStatus::Success,
                'permisos' => $permisos,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear un nuevo permiso.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:permissions,name|max:100',
            ]);

            $permiso = Permission::create([
                'name' => $request->name,
                'guard_name' => 'web',
            ]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Creacion,
                'permiso' => $permiso,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar un permiso.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $permiso = Permission::findOrFail($id);

            $request->validate([
                'name' => 'required|string|unique:permissions,name,' . $id . '|max:100',
            ]);

            $permiso->update(['name' => $request->name]);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => HTTPStatus::Actualizado,
                'permiso' => $permiso,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un permiso.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $permiso = Permission::findOrFail($id);
            $permiso->delete();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Permiso eliminado correctamente',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage(),
            ], 500);
        }
    }
}
