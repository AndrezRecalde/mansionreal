<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\StatusRequest;
use App\Http\Requests\UserPassword;
use App\Http\Requests\UsuarioRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class UsuarioController extends Controller
{
    public function getUsuarios(): JsonResponse
    {
        try {
            $usuarios = User::with('roles')->allowed()->get();

            // Transforma los usuarios para incluir solo el primer nombre de rol
            $usuarios = $usuarios->map(function ($usuario) {
                return [
                    'id' => $usuario->id,
                    'apellidos' => $usuario->apellidos,
                    'nombres' => $usuario->nombres,
                    'dni' => $usuario->dni,
                    'activo' => (bool) $usuario->activo,
                    'email' => $usuario->email,
                    // Toma solo el primer rol (si existe), si no, null
                    'role' => optional($usuario->roles->first())->name,
                    // Agrega más campos si lo necesitas
                ];
            });

            return response()->json([
                'status' => HTTPStatus::Success,
                'usuarios' => $usuarios
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    function store(UsuarioRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = new User;
            $usuario->fill($request->validated());
            $usuario->user_id = auth()->id();
            $usuario->save();
            $usuario->assignRole($request->role);
            DB::commit();

            return response()->json(
                [
                    'status' => HTTPStatus::Success,
                    'msg'   => HTTPStatus::Creacion
                ],
                201
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function update(UsuarioRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = User::find($id);
            if ($usuario) {
                $usuario->update($request->validated());

                if ($request->filled('role')) {
                    $usuario->roles()->detach();
                    $usuario->assignRole($request->role);
                }
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Actualizado
                ], 201);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    public function updatePassword(UserPassword $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = User::find($id);
            if ($usuario) {
                $usuario->update($request->validated());
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Actualizado
                ], 201);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    public function updateStatus(StatusRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = User::find($id);
            if ($usuario) {
                $usuario->update($request->validated());
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Actualizado
                ], 201);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    /* Obtener los usuarios con Role GERENTE */
    public function getGerentes(): JsonResponse
    {
        try {
            $usuarios = User::role('GERENTE')
                ->where('activo', true)
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'usuarios' => $usuarios
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    // Consulta JSON
    public function pagosPorGerente(Request $request)
    {
        $data = $this->getPagosPorGerente($request);

        return response()->json([
            'status' => HTTPStatus::Success,
            'results' => $request->p_usuario_id ? $data->first() : $data
        ], 200);
    }

    // Exportación a PDF
    public function exportarPagosPorGerentePDF(Request $request)
    {
        $data = $this->getPagosPorGerente($request);

        $pdf = Pdf::loadView('pdf.reportes.gerente.pagos_por_gerente', ['data' => $data]);
        return $pdf->download('pagos_por_gerente.pdf');
    }

    // Método privado reutilizable para obtener y procesar los datos
    private function getPagosPorGerente(Request $request)
    {
        // Validar request
        $request->validate([
            'p_anio' => 'required|integer|min:2000|max:2100',
            'p_fecha_inicio' => 'nullable|date',
            'p_fecha_fin' => 'nullable|date|after_or_equal:p_fecha_inicio',
            'p_usuario_id' => 'nullable|integer|exists:users,id',
        ]);

        $anio = $request->p_anio;
        $fechaInicio = $request->p_fecha_inicio;
        $fechaFin = $request->p_fecha_fin;
        $usuarioId = $request->p_usuario_id ?? null;

        // Consulta usuarios con role GERENTE usando Spatie
        $usuariosQuery = User::role('GERENTE')
            ->with(['pagosRegistrados' => function ($q) use ($fechaInicio, $fechaFin, $anio) {
                if ($fechaInicio && $fechaFin) {
                    $q->whereBetween('fecha_pago', [$fechaInicio, $fechaFin]);
                } else {
                    $q->whereYear('fecha_pago', $anio);
                }
                $q->with(['reserva:id,codigo_reserva', 'conceptoPago:id,nombre_concepto']);
            }]);

        if ($usuarioId) {
            $usuariosQuery->where('id', $usuarioId);
        }

        $usuarios = $usuariosQuery->get();

        // Procesa los datos para el frontend o PDF
        return $usuarios->map(function ($usuario) {
            return [
                'id' => $usuario->id,
                'nombres' => $usuario->nombres . ' ' . $usuario->apellidos,
                'dni' => $usuario->dni,
                'activo' => (bool) $usuario->activo,
                'pagos' => $usuario->pagosRegistrados->map(function ($pago) {
                    return [
                        'id' => $pago->id,
                        'reserva' => [
                            'id' => $pago->reserva->id,
                            'codigo_reserva' => $pago->reserva->codigo_reserva,
                        ],
                        'codigo_voucher' => $pago->codigo_voucher,
                        'concepto_pago_id' => [
                            'id' => $pago->conceptoPago->id,
                            'nombre_concepto' => $pago->conceptoPago->nombre_concepto,
                        ],
                        'monto' => (float) $pago->monto,
                        'metodo_pago' => $pago->metodo_pago,
                        'fecha_pago' => $pago->fecha_pago,
                        'observaciones' => $pago->observaciones,
                    ];
                }),
                'total_registros' => $usuario->pagosRegistrados->count(),
                'total_monto' => $usuario->pagosRegistrados->sum('monto'),
            ];
        });
    }
}
