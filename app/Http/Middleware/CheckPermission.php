<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     * Permite acceso si el usuario tiene el rol ADMINISTRADOR|GERENTE
     * O si tiene el permiso específico asignado directamente.
     *
     * Uso: CheckPermission::class . ':permiso1|permiso2'
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Administradores y gerentes siempre pasan
        if ($user->hasAnyRole(['ADMINISTRADOR', 'GERENTE'])) {
            return $next($request);
        }

        // Verificar si tiene alguno de los permisos requeridos (separados por |)
        $permisosRequeridos = explode('|', $permissions);

        foreach ($permisosRequeridos as $permiso) {
            if ($user->hasPermissionTo(trim($permiso))) {
                return $next($request);
            }
        }

        return response()->json([
            'message' => 'No tienes permisos para acceder a este recurso.'
        ], 403);
    }
}
