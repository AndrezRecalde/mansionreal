<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\TurnoCaja;
use Illuminate\Support\Facades\Auth;
use App\Enums\HTTPStatus;

class CheckTurnoAbierto
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $turnoAbierto = TurnoCaja::where('usuario_id', Auth::id())
            ->where('estado', 'ABIERTO')
            ->exists();

        if (!$turnoAbierto) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Proceso Denegado: No tienes un turno de caja abierto. Por favor inicia turno.'
            ], 403);
        }

        return $next($request);
    }
}
