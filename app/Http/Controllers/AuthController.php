<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    function login(LoginRequest $request): JsonResponse
    {
        try {
            if (!Auth::attempt($request->validated())) {
                return response()->json([
                    'msg' => HTTPStatus::LoginFailed
                ], 404);
            }

            $usuario = User::from('users as u')
                ->selectRaw('u.id, u.nombres, u.apellidos,
                            u.dni, u.email, u.activo,
                            r.id as role_id, r.name as role')
                ->join('model_has_roles as mhr', 'mhr.model_id', 'u.id')
                ->join('roles as r', 'r.id', 'mhr.role_id')
                ->where('u.dni', $request->dni)
                ->where('u.activo', 1)
                ->first();

            if ($usuario) {
                $token = $usuario->createToken('auth_token')->plainTextToken;

                // Cargar permisos del usuario (directos + heredados de roles)
                $permisos = $this->appendRolesAndPermissions($usuario, $usuario->id);

                return response()->json([
                    'status'       => 'success',
                    'access_token' => $token,
                    'token_type'   => 'Bearer',
                    'usuario'      => $usuario,
                    'permissions'  => $permisos,
                ]);
            } else {
                return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::UserNotActive], 404);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function refresh(): JsonResponse
    {
        $authUserId = Auth::id();
        $usuario = User::from('users as u')
            ->selectRaw('u.id, u.nombres, u.apellidos,
                         u.dni, u.email, u.activo,
                         r.id as role_id, r.name as role')
            ->join('model_has_roles as mhr', 'mhr.model_id', 'u.id')
            ->join('roles as r', 'r.id', 'mhr.role_id')
            ->where('u.id', $authUserId)
            ->where('u.activo', 1)
            ->first();

        if ($usuario) {
            // BUG FIX: Evitamos borrar los tokens inmediatamente para que las 
            // peticiones paralelas (axios concurrentes) que usan el token anterior no devuelvan 401.
            // En su lugar, el token simplemente expirará de acuerdo a config/sanctum.php o
            // podemos limpiar tokens antiguos periódicamente.
            // $usuario->tokens()->delete();
            
            // Opcionalmente borrar solo los tokens más antiguos si hay muchos
            if ($usuario->tokens()->count() > 5) {
                // Borramos todos los exceptos los últimos 2 por seguridad
                $tokensToDelete = $usuario->tokens()->orderBy('created_at', 'desc')->skip(2)->take(10)->get();
                foreach($tokensToDelete as $t) { $t->delete(); }
            }

            $token = $usuario->createToken('auth_token')->plainTextToken;

            // Cargar permisos del usuario (directos + heredados de roles)
            $permisos = $this->appendRolesAndPermissions($usuario, $authUserId);

            return response()->json([
                "usuario"      => $usuario,
                "token_type"   => 'Bearer',
                "access_token" => $token,
                "permissions"  => $permisos,
            ]);
        } else {
            return response()->json([
                "status" => HTTPStatus::Error,
                "msg"    => HTTPStatus::UserNotActive
            ]);
        }
    }

    function profile(): JsonResponse
    {
        $authUserId = Auth::id();
        $profile = User::from('users as u')
            ->selectRaw('u.id, u.nombres, u.apellidos,
                         u.dni, u.email, u.activo,
                         r.id as role_id, r.name as role')
            ->join('model_has_roles as mhr', 'mhr.model_id', 'u.id')
            ->join('roles as r', 'r.id', 'mhr.role_id')
            ->where('u.id', $authUserId)
            ->where('u.activo', 1)
            ->first();

        // Cargar permisos del usuario (directos + heredados de roles)
        $permisos = $this->appendRolesAndPermissions($profile, $authUserId);

        return response()->json([
            'status'      => HTTPStatus::Success,
            'profile'     => $profile,
            'permissions' => $permisos,
        ]);
    }

    function logout(Request $request): JsonResponse
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        if ($user) {
            // Revocar todos los tokens del usuario
            $user->tokens()->delete();
        }

        return response()->json([
            'status' => 200,
            'msg'    => 'Sesión finalizada'
        ]);
    }

    /**
     * Agrega roles y permisos de Spatie al objeto de usuario y retorna array de permisos.
     */
    private function appendRolesAndPermissions($user, int $userId): array
    {
        $usuarioModel = User::find($userId);
        
        if (!$usuarioModel) {
            $user->roles = [];
            $user->permissions = [];
            return [];
        }

        $roles = $usuarioModel->getRoleNames()->toArray();
        $permisos = $usuarioModel->getAllPermissions()->pluck('name')->toArray();
        
        $user->roles = empty($roles) ? [] : $roles;
        $user->permissions = empty($permisos) ? [] : $permisos;

        return $user->permissions;
    }
}

