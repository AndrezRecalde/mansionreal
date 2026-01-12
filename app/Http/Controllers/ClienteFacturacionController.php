<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\ClienteFacturacionRequest;
use App\Models\ClienteFacturacion;
use App\Models\Huesped;
use App\Models\Reserva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteFacturacionController extends Controller
{
    /**
     * Listar todos los clientes de facturación (con paginación y búsqueda)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 20;
            $search = $request->search;
            $tipoCliente = $request->tipo_cliente;
            $activo = $request->activo;

            $query = ClienteFacturacion::query()
                ->where('id', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_ID); // Excluir CONSUMIDOR FINAL

            // Filtro por estado activo/inactivo
            if ($activo !== null) {
                $query->where('activo', $activo);
            } else {
                $query->activos(); // Por defecto solo activos
            }

            // Filtro por tipo de cliente
            if ($tipoCliente) {
                $query->where('tipo_cliente', $tipoCliente);
            }

            // Búsqueda por identificación, nombres o apellidos
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('identificacion', 'like', "%{$search}%")
                        ->orWhere('nombres', 'like', "%{$search}%")
                        ->orWhere('apellidos', 'like', "%{$search}%")
                        ->orWhere(DB::raw("CONCAT(apellidos, ' ', nombres)"), 'like', "%{$search}%");
                });
            }

            $clientes = $query->orderBy('apellidos')
                ->orderBy('nombres')
                ->paginate($perPage);

            // Agregar estadísticas a cada cliente
            $clientes->getCollection()->transform(function ($cliente) {
                $cliente->total_reservas = $cliente->contarReservas();
                $cliente->total_facturado = $cliente->totalFacturado();
                return $cliente;
            });

            return response()->json([
                'status' => HTTPStatus::Success,
                'clientes' => $clientes,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un cliente específico
     */
    public function show(int $id): JsonResponse
    {
        try {
            $cliente = ClienteFacturacion::with([
                'facturas' => function ($query) {
                    $query->emitidas()->orderBy('fecha_emision', 'desc')->limit(10);
                }
            ])->findOrFail($id);

            $estadisticas = [
                'total_reservas' => $cliente->contarReservas(),
                'total_facturado' => $cliente->totalFacturado(),
                'facturas_emitidas' => $cliente->facturas()->emitidas()->count(),
                'facturas_anuladas' => $cliente->facturas()->anuladas()->count(),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $cliente,
                'estadisticas' => $estadisticas,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener CONSUMIDOR FINAL
     */
    public function getConsumidorFinal(): JsonResponse
    {
        try {
            $consumidorFinal = ClienteFacturacion::consumidorFinal();

            if (! $consumidorFinal) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se encontró el registro de CONSUMIDOR FINAL'
                ], 404);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $consumidorFinal,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar cliente por identificación (DNI/RUC/Pasaporte)
     */
    public function buscarPorIdentificacion(Request $request): JsonResponse
    {
        $request->validate([
            'identificacion' => 'required|string|max:20'
        ]);

        try {
            $cliente = ClienteFacturacion::buscarPorIdentificacion($request->identificacion)
                ->where('id', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_ID)
                ->first();

            if (!$cliente) {
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'cliente' => null,
                    'msg' => 'Cliente no encontrado',
                    'existe' => false,
                ], 200);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $cliente,
                'existe' => true,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar clientes por nombre (autocompletado)
     */
    public function buscarPorNombre(Request $request): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|min:2'
        ]);

        try {
            $clientes = ClienteFacturacion::buscarPorNombre($request->nombre)
                ->activos()
                ->where('id', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_ID)
                ->limit(10)
                ->get(['id', 'identificacion', 'nombres', 'apellidos', 'tipo_identificacion']);

            return response()->json([
                'status' => HTTPStatus::Success,
                'clientes' => $clientes,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nuevo cliente de facturación
     */
    public function store(ClienteFacturacionRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            // Verificar si ya existe la identificación
            $existe = ClienteFacturacion::where('identificacion', $validated['identificacion'])->exists();
            if ($existe) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Ya existe un cliente con esa identificación'
                ], 409);
            }

            // Crear cliente
            $cliente = ClienteFacturacion::create($validated);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Cliente de facturación creado correctamente',
                'cliente' => $cliente,
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar cliente de facturación
     */
    public function update(ClienteFacturacionRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $cliente = ClienteFacturacion::findOrFail($id);

            // No permitir editar CONSUMIDOR FINAL
            if ($cliente->id === ClienteFacturacion::CONSUMIDOR_FINAL_ID) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se puede modificar el registro de CONSUMIDOR FINAL'
                ], 403);
            }

            $validated = $request->validated();

            // Verificar identificación única (excepto el mismo cliente)
            $existe = ClienteFacturacion::where('identificacion', $validated['identificacion'])
                ->where('id', '!=', $id)
                ->exists();

            if ($existe) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Ya existe otro cliente con esa identificación'
                ], 409);
            }

            $cliente->update($validated);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Cliente actualizado correctamente',
                'cliente' => $cliente->fresh(),
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar estado del cliente (activar/desactivar)
     */
    public function toggleEstado(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $cliente = ClienteFacturacion::findOrFail($id);

            // No permitir desactivar CONSUMIDOR FINAL
            if ($cliente->id === ClienteFacturacion::CONSUMIDOR_FINAL_ID) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'No se puede desactivar el CONSUMIDOR FINAL'
                ], 403);
            }

            $cliente->activo = !$cliente->activo;
            $cliente->save();

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => $cliente->activo ? 'Cliente activado correctamente' : 'Cliente desactivado correctamente',
                'cliente' => $cliente,
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas detalladas del cliente
     */
    public function estadisticas(int $id): JsonResponse
    {
        try {
            $cliente = ClienteFacturacion::findOrFail($id);

            $stats = [
                'total_reservas' => $cliente->contarReservas(),
                'total_facturado' => $cliente->totalFacturado(),
                'facturas_emitidas' => $cliente->facturas()->emitidas()->count(),
                'facturas_anuladas' => $cliente->facturas()->anuladas()->count(),
                'ultima_factura' => $cliente->facturas()->emitidas()->latest('fecha_emision')->first(),
                'promedio_facturacion' => $cliente->facturas()->emitidas()->avg('total_factura'),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $cliente,
                'estadisticas' => $stats,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Prellenar datos desde un huésped (agilizar creación)
     */
    public function prellenarDesdeHuesped(int $huespedId): JsonResponse
    {
        try {
            $huesped = Huesped::findOrFail($huespedId);

            // Mapear nacionalidad a tipo de identificación
            $tipoIdentificacion = 'CEDULA'; // Por defecto

            if (strlen($huesped->dni) === 13) {
                $tipoIdentificacion = 'RUC';
            } elseif ($huesped->nacionalidad === 'EXTRANJERO') {
                $tipoIdentificacion = 'PASAPORTE';
            }

            $datos = [
                'tipo_cliente' => ClienteFacturacion::TIPO_CLIENTE_REGISTRADO,
                'tipo_identificacion' => $tipoIdentificacion,
                'identificacion' => $huesped->dni,
                'nombres' => $huesped->nombres,
                'apellidos' => $huesped->apellidos,
                'direccion' => $huesped->direccion,
                'telefono' => $huesped->telefono,
                'email' => $huesped->email,
                'activo' => true,
            ];

            // Verificar si ya existe un cliente con esa identificación
            $clienteExistente = ClienteFacturacion::where('identificacion', $huesped->dni)->first();

            return response()->json([
                'status' => HTTPStatus::Success,
                'datos' => $datos,
                'cliente_existente' => $clienteExistente,
                'existe' => $clienteExistente !== null,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Prellenar datos desde una reserva (usa el huésped de la reserva)
     */
    public function prellenarDesdeReserva(int $reservaId): JsonResponse
    {
        try {
            $reserva = Reserva::with('huesped')->findOrFail($reservaId);

            if (!$reserva->huesped) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'La reserva no tiene huésped asociado'
                ], 404);
            }

            return $this->prellenarDesdeHuesped($reserva->huesped->id);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Listado simplificado para selects/dropdowns
     */
    public function listadoSimple(): JsonResponse
    {
        try {
            $clientes = ClienteFacturacion::activos()
                ->registrados() // Excluye CONSUMIDOR FINAL
                ->orderBy('apellidos')
                ->orderBy('nombres')
                ->get(['id', 'identificacion', 'nombres', 'apellidos', 'tipo_identificacion']);

            return response()->json([
                'status' => HTTPStatus::Success,
                'clientes' => $clientes,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
