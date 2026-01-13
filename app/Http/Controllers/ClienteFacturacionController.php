<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\ClienteFacturacionRequest;
use App\Services\Facturacion\ClienteFacturacionService;
use App\Services\Facturacion\Exceptions\FacturacionException;
use App\Models\ClienteFacturacion;
use App\Models\Reserva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClienteFacturacionController extends Controller
{
    protected ClienteFacturacionService $clienteService;

    public function __construct(ClienteFacturacionService $clienteService)
    {
        $this->clienteService = $clienteService;
    }

    /**
     * Listar todos los clientes de facturación
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 20;
            $search = $request->search;
            $tipoCliente = $request->tipo_cliente;
            $activo = $request->activo;

            $query = ClienteFacturacion::query()
                ->where('id', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_ID);

            // Filtro por estado activo/inactivo
            if ($activo !== null) {
                $query->where('activo', $activo);
            } else {
                $query->activos();
            }

            // Filtro por tipo de cliente
            if ($tipoCliente) {
                $query->where('tipo_cliente', $tipoCliente);
            }

            // Búsqueda
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('identificacion', 'like', "%{$search}%")
                        ->orWhere('nombres', 'like', "%{$search}%")
                        ->orWhere('apellidos', 'like', "%{$search}%")
                        ->orWhereRaw("CONCAT(apellidos, ' ', nombres) LIKE ?", ["%{$search}%"]);
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
     * Obtener un cliente específico (USANDO SERVICIO)
     */
    public function show(int $id): JsonResponse
    {
        try {
            $cliente = $this->clienteService->validarCliente($id);

            $estadisticas = $this->clienteService->obtenerEstadisticas($id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $cliente->load([
                    'facturas' => function ($query) {
                        $query->emitidas()->orderBy('fecha_emision', 'desc')->limit(10);
                    }
                ]),
                'estadisticas' => $estadisticas,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 400);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener CONSUMIDOR FINAL (USANDO SERVICIO)
     */
    public function getConsumidorFinal(): JsonResponse
    {
        try {
            $consumidorFinal = $this->clienteService->obtenerConsumidorFinal();

            if (!$consumidorFinal) {
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
     * Buscar cliente por identificación (USANDO SERVICIO)
     */
    public function buscarPorIdentificacion(Request $request): JsonResponse
    {
        $request->validate([
            'identificacion' => 'required|string|max:20'
        ]);

        try {
            $cliente = $this->clienteService->buscarPorIdentificacion($request->identificacion);

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $cliente,
                'existe' => $cliente !== null,
                'msg' => $cliente ? null : 'Cliente no encontrado',
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
     * Prellenar datos desde huésped (USANDO SERVICIO)
     */
    public function prellenarDesdeHuesped(int $huespedId): JsonResponse
    {
        try {
            $resultado = $this->clienteService->prellenarDesdeHuesped($huespedId);

            return response()->json([
                'status' => HTTPStatus::Success,
                'datos' => $resultado['datos'],
                'cliente_existente' => $resultado['cliente_existente'],
                'existe' => $resultado['existe'],
                'msg' => $resultado['existe']
                    ? 'Ya existe un cliente con esta identificación'
                    : 'Datos prellenados desde el huésped',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Prellenar datos desde reserva
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
     * Crear cliente de facturación (USANDO SERVICIO)
     */
    public function store(ClienteFacturacionRequest $request): JsonResponse
    {
        try {
            $cliente = $this->clienteService->crearCliente($request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Cliente de facturación creado correctamente',
                'cliente' => $cliente,
            ], 201);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 409);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar cliente de facturación (USANDO SERVICIO)
     */
    public function update(ClienteFacturacionRequest $request, int $id): JsonResponse
    {
        try {
            $cliente = $this->clienteService->actualizarCliente($id, $request->validated());

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Cliente actualizado correctamente',
                'cliente' => $cliente,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], $e->getCode() === 403 ? 403 : 409);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar estado del cliente (USANDO SERVICIO)
     */
    public function toggleEstado(int $id): JsonResponse
    {
        try {
            $cliente = $this->clienteService->toggleEstado($id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => $cliente->activo ? 'Cliente activado correctamente' : 'Cliente desactivado correctamente',
                'cliente' => $cliente,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 403);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas del cliente (USANDO SERVICIO)
     */
    public function estadisticas(int $id): JsonResponse
    {
        try {
            $cliente = $this->clienteService->validarCliente($id);
            $estadisticas = $this->clienteService->obtenerEstadisticas($id);

            return response()->json([
                'status' => HTTPStatus::Success,
                'cliente' => $cliente,
                'estadisticas' => $estadisticas,
            ], 200);
        } catch (FacturacionException $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 400);
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
                ->registrados()
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
