<?php

namespace App\Services\Facturacion;

use App\Models\ClienteFacturacion;
use App\Models\Huesped;
use App\Services\Facturacion\Exceptions\FacturacionException;
use Illuminate\Support\Facades\DB;

class ClienteFacturacionService
{
    /**
     * Validar y obtener cliente
     *
     * @param int $clienteId
     * @return ClienteFacturacion
     * @throws FacturacionException
     */
    public function validarCliente(int $clienteId): ClienteFacturacion
    {
        $cliente = ClienteFacturacion::find($clienteId);

        if (!$cliente) {
            throw new FacturacionException("Cliente #{$clienteId} no encontrado", 404);
        }

        // Consumidor final siempre es válido
        if ($cliente->id === ClienteFacturacion::CONSUMIDOR_FINAL_ID) {
            return $cliente;
        }

        // Validar que esté activo
        if (!$cliente->activo) {
            throw FacturacionException::clienteInactivo($clienteId);
        }

        return $cliente;
    }

    /**
     * Crear cliente de facturación
     *
     * @param array $datos
     * @return ClienteFacturacion
     */
    public function crearCliente(array $datos): ClienteFacturacion
    {
        return DB::transaction(function () use ($datos) {
            // Verificar si ya existe
            $existe = ClienteFacturacion::where('identificacion', $datos['identificacion'])->exists();

            if ($existe) {
                throw new FacturacionException(
                    "Ya existe un cliente con la identificación {$datos['identificacion']}"
                );
            }

            return ClienteFacturacion::create($datos);
        });
    }

    /**
     * Actualizar cliente de facturación
     *
     * @param int $clienteId
     * @param array $datos
     * @return ClienteFacturacion
     */
    public function actualizarCliente(int $clienteId, array $datos): ClienteFacturacion
    {
        return DB::transaction(function () use ($clienteId, $datos) {
            $cliente = ClienteFacturacion::findOrFail($clienteId);

            // No permitir editar CONSUMIDOR FINAL
            if ($cliente->id === ClienteFacturacion::CONSUMIDOR_FINAL_ID) {
                throw new FacturacionException('No se puede modificar el CONSUMIDOR FINAL');
            }

            // Verificar identificación única
            $existe = ClienteFacturacion::where('identificacion', $datos['identificacion'])
                ->where('id', '!=', $clienteId)
                ->exists();

            if ($existe) {
                throw new FacturacionException(
                    "Ya existe otro cliente con la identificación {$datos['identificacion']}"
                );
            }

            $cliente->update($datos);

            return $cliente->fresh();
        });
    }

    /**
     * Buscar o crear cliente desde huésped
     *
     * @param int $huespedId
     * @return array
     */
    public function prellenarDesdeHuesped(int $huespedId): array
    {
        $huesped = Huesped::findOrFail($huespedId);

        // ================================================================
        // SIMPLIFICADO: Solo retornar datos, NO adivinar tipo
        // ================================================================

        $datos = [
            'tipo_cliente' => ClienteFacturacion::TIPO_CLIENTE_REGISTRADO,
            // tipo_identificacion NO se incluye - el usuario lo selecciona
            'identificacion' => $huesped->dni,
            'nombres' => $huesped->nombres,
            'apellidos' => $huesped->apellidos,
            'telefono' => $huesped->telefono ?? '',
            'email' => $huesped->email ?? '',
            'activo' => true,
        ];

        // Verificar si ya existe un cliente con esa identificación
        $clienteExistente = ClienteFacturacion::where('identificacion', $huesped->dni)->first();

        return [
            'datos' => $datos,
            'cliente_existente' => $clienteExistente,
            'existe' => $clienteExistente !== null,
        ];
    }

    /**
     * Buscar cliente por identificación
     *
     * @param string $identificacion
     * @return ClienteFacturacion|null
     */
    public function buscarPorIdentificacion(string $identificacion): ?ClienteFacturacion
    {
        return ClienteFacturacion::where('identificacion', $identificacion)
            ->where('id', '!=', ClienteFacturacion::CONSUMIDOR_FINAL_ID)
            ->activos()
            ->first();
    }

    /**
     * Obtener consumidor final
     *
     * @return ClienteFacturacion
     */
    public function obtenerConsumidorFinal(): ClienteFacturacion
    {
        return ClienteFacturacion::consumidorFinal();
    }

    /**
     * Cambiar estado del cliente
     *
     * @param int $clienteId
     * @return ClienteFacturacion
     */
    public function toggleEstado(int $clienteId): ClienteFacturacion
    {
        return DB::transaction(function () use ($clienteId) {
            $cliente = ClienteFacturacion::findOrFail($clienteId);

            // No permitir desactivar CONSUMIDOR FINAL
            if ($cliente->id === ClienteFacturacion::CONSUMIDOR_FINAL_ID) {
                throw new FacturacionException('No se puede desactivar el CONSUMIDOR FINAL');
            }

            $cliente->activo = !$cliente->activo;
            $cliente->save();

            return $cliente;
        });
    }

    /**
     * Obtener estadísticas del cliente
     *
     * @param int $clienteId
     * @return array
     */
    public function obtenerEstadisticas(int $clienteId): array
    {
        $cliente = ClienteFacturacion::findOrFail($clienteId);

        return [
            'total_reservas' => $cliente->contarReservas(),
            'total_facturado' => $cliente->totalFacturado(),
            'facturas_emitidas' => $cliente->facturas()->emitidas()->count(),
            'facturas_anuladas' => $cliente->facturas()->anuladas()->count(),
            'ultima_factura' => $cliente->facturas()->emitidas()->latest('fecha_emision')->first(),
            'promedio_facturacion' => $cliente->facturas()->emitidas()->avg('total_factura'),
        ];
    }
}
