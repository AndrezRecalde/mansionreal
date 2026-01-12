<?php

namespace App\Services\Facturacion;

use App\Models\SecuenciaFactura;
use App\Services\Facturacion\Exceptions\FacturacionException;
use Illuminate\Support\Facades\DB;

class SecuenciaFacturaService
{
    /**
     * Generar siguiente número de factura
     *
     * @param int|null $secuenciaId
     * @return string
     * @throws FacturacionException
     */
    public function generarNumero(?int $secuenciaId = null): string
    {
        try {
            if ($secuenciaId) {
                return SecuenciaFactura::generarSiguienteNumero($secuenciaId);
            }

            // Usar secuencia por defecto
            return SecuenciaFactura::generarSiguienteNumero();
        } catch (\Exception $e) {
            throw FacturacionException::errorSecuencial($e->getMessage());
        }
    }

    /**
     * Obtener secuencia activa
     *
     * @return SecuenciaFactura
     * @throws FacturacionException
     */
    public function obtenerSecuenciaActiva(): SecuenciaFactura
    {
        $secuencia = SecuenciaFactura::obtenerDefault();

        if (!$secuencia) {
            throw FacturacionException::errorSecuencial('No hay secuencia activa configurada');
        }

        if (! $secuencia->puedeGenerarMas()) {
            throw FacturacionException::errorSecuencial('La secuencia alcanzó su límite');
        }

        return $secuencia;
    }

    /**
     * Crear nueva secuencia
     *
     * @param array $datos
     * @return SecuenciaFactura
     */
    public function crearSecuencia(array $datos): SecuenciaFactura
    {
        return DB::transaction(function () use ($datos) {
            // Verificar que no exista la combinación
            $existe = SecuenciaFactura::where('establecimiento', $datos['establecimiento'])
                ->where('punto_emision', $datos['punto_emision'])
                ->exists();

            if ($existe) {
                throw new FacturacionException(
                    'Ya existe una secuencia con ese establecimiento y punto de emisión'
                );
            }

            // Validar secuencial_fin
            if (isset($datos['secuencial_fin']) && $datos['secuencial_fin'] < $datos['secuencial_inicio']) {
                throw new FacturacionException(
                    'El secuencial final debe ser mayor al inicial'
                );
            }

            return SecuenciaFactura::create(array_merge($datos, [
                'secuencial_actual' => 0,
            ]));
        });
    }

    /**
     * Actualizar secuencia
     *
     * @param int $secuenciaId
     * @param array $datos
     * @return SecuenciaFactura
     */
    public function actualizarSecuencia(int $secuenciaId, array $datos): SecuenciaFactura
    {
        return DB::transaction(function () use ($secuenciaId, $datos) {
            $secuencia = SecuenciaFactura::findOrFail($secuenciaId);

            // Solo permitir actualizar descripción y límite final
            $secuencia->update([
                'descripcion' => $datos['descripcion'] ?? $secuencia->descripcion,
                'secuencial_fin' => $datos['secuencial_fin'] ??  $secuencia->secuencial_fin,
            ]);

            return $secuencia->fresh();
        });
    }

    /**
     * Cambiar estado de secuencia
     *
     * @param int $secuenciaId
     * @return SecuenciaFactura
     */
    public function toggleEstado(int $secuenciaId): SecuenciaFactura
    {
        return DB::transaction(function () use ($secuenciaId) {
            $secuencia = SecuenciaFactura::findOrFail($secuenciaId);
            $secuencia->activo = !$secuencia->activo;
            $secuencia->save();

            return $secuencia;
        });
    }

    /**
     * Verificar disponibilidad de números
     *
     * @param int $secuenciaId
     * @return array
     */
    public function verificarDisponibilidad(int $secuenciaId): array
    {
        $secuencia = SecuenciaFactura::findOrFail($secuenciaId);

        return [
            'puede_generar' => $secuencia->puedeGenerarMas(),
            'numeros_disponibles' => $secuencia->numerosDisponibles(),
            'siguiente_numero' => $secuencia->siguienteNumero(),
            'secuencial_actual' => $secuencia->secuencial_actual,
            'secuencial_fin' => $secuencia->secuencial_fin,
        ];
    }
}
