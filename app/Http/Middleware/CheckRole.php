<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        // Asegurar la obtención del usuario, ya sea por el guard por defecto o explícitamente por sanctum
        $user = $request->user() ?? auth('sanctum')->user() ?? auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Soporte para múltiples roles separados por | (ej: ADMINISTRADOR|GERENTE)
        $rolesArray = explode('|', $roles);

        if (!$user->hasAnyRole($rolesArray)) {
            return response()->json([
                'message' => 'No tienes permisos para acceder a este recurso.'
            ], 403);
        }

        return $next($request);
    }
}
