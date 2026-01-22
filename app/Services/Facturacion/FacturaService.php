<?php

namespace App\Services\Facturacion;

use App\Models\Factura;
use App\Models\Reserva;
use App\Models\ClienteFacturacion;
use App\Models\Consumo;
use App\Services\Facturacion\Exceptions\FacturacionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FacturaService
{
    protected ClienteFacturacionService $clienteService;
    protected SecuenciaFacturaService $secuenciaService;

    public function __construct(
        ClienteFacturacionService $clienteService,
        SecuenciaFacturaService $secuenciaService
    ) {
        $this->clienteService = $clienteService;
        $this->secuenciaService = $secuenciaService;
    }

    /**
     * Generar factura para una reserva
     *
     * @param int $reservaId
     * @param int $clienteFacturacionId
     * @param bool $solicitaFacturaDetallada
     * @param int $usuarioId
     *  @param array $opciones [
     *      'observaciones' => string,
     *      'descuento' => float,
     *      'tipo_descuento' => string,
     *      'porcentaje_descuento' => float,
     *      'motivo_descuento' => string
     * ]
     * @return Factura
     * @throws FacturacionException
     */
    public function generarFactura(
        int $reservaId,
        int $clienteFacturacionId,
        bool $solicitaFacturaDetallada,
        int $usuarioId,
        array $opciones = []
    ): Factura {
        return DB::transaction(function () use (
            $reservaId,
            $clienteFacturacionId,
            $solicitaFacturaDetallada,
            $usuarioId,
            $opciones
        ) {
            // 1. VALIDAR RESERVA
            $reserva = $this->validarReserva($reservaId);

            // 2. VALIDAR Y OBTENER CLIENTE
            $cliente = $this->clienteService->validarCliente($clienteFacturacionId);

            // 3. ASIGNAR CLIENTE A RESERVA
            $this->asignarClienteAReserva($reserva, $clienteFacturacionId, $solicitaFacturaDetallada, $usuarioId);

            // 4. GENERAR NÚMERO DE FACTURA
            $numeroFactura = $this->secuenciaService->generarNumero();

            // 5. EXTRAER DATOS DE DESCUENTO
            $descuento = $opciones['descuento'] ?? 0;
            $tipoDescuento = $opciones['tipo_descuento'] ??  Factura::TIPO_DESCUENTO_MONTO_FIJO;
            $porcentajeDescuento = $opciones['porcentaje_descuento'] ?? null;
            $motivoDescuento = $opciones['motivo_descuento'] ?? null;

            // 6. CALCULAR TOTALES
            $totales = $this->calcularTotales(
                $reserva->consumos,
                $descuento,
                $tipoDescuento,
                $porcentajeDescuento
            );

            // 7. CREAR FACTURA
            $factura = $this->crearFactura(
                $numeroFactura,
                $reserva,
                $cliente,
                $totales,
                $usuarioId,
                $opciones,
                $tipoDescuento,
                $porcentajeDescuento,
                $motivoDescuento
            );

            // 8. ASOCIAR CONSUMOS A LA FACTURA
            $this->asociarConsumos($reserva->consumos, $factura->id);

            // 9. LOG
            Log::info("Factura generada:  {$factura->numero_factura}", [
                'factura_id' => $factura->id,
                'numero_factura' => $factura->numero_factura,
                'reserva_id' => $reservaId,
                'cliente_id' => $cliente->id,
                'subtotal_sin_iva' => $factura->subtotal_sin_iva,
                'descuento' => $factura->descuento,
                'base_imponible' => $totales['base_imponible'],
                'total_iva' => $factura->total_iva,
                'total_factura' => $factura->total_factura, // ✅ Total final (con descuento)
                'usuario_id' => $usuarioId,
            ]);

            return $factura->fresh([
                'reserva.huesped',
                'reserva.departamento',
                'consumos.inventario',
                'clienteFacturacion',
                'usuarioGenero',
                'usuarioRegistroDescuento'
            ]);
        });
    }

    /**
     * ✅ NUEVO: Aplicar descuento a una factura existente
     *
     * @param int $facturaId
     * @param float $descuento
     * @param string $tipoDescuento
     * @param float|null $porcentaje
     * @param string|null $motivo
     * @param int $usuarioId
     * @return Factura
     * @throws FacturacionException
     */
    public function aplicarDescuentoFactura(
        int $facturaId,
        float $descuento,
        string $tipoDescuento = Factura::TIPO_DESCUENTO_MONTO_FIJO,
        ?float $porcentaje = null,
        ?string $motivo = null,
        int $usuarioId
    ): Factura {
        return DB::transaction(function () use (
            $facturaId,
            $descuento,
            $tipoDescuento,
            $porcentaje,
            $motivo,
            $usuarioId
        ) {
            $factura = Factura::findOrFail($facturaId);

            // Aplicar descuento usando el método del modelo
            $factura->aplicarDescuento(
                $descuento,
                $tipoDescuento,
                $porcentaje,
                $motivo,
                $usuarioId
            );

            Log::info('Descuento aplicado a factura', [
                'factura_id' => $factura->id,
                'numero_factura' => $factura->numero_factura,
                'descuento' => $descuento,
                'tipo' => $tipoDescuento,
                'porcentaje' => $porcentaje,
                'total_factura' => $factura->total_factura,
                'usuario_id' => $usuarioId,
            ]);

            return $factura->fresh();
        });
    }

    /**
     * ✅ NUEVO: Eliminar descuento de una factura
     *
     * @param int $facturaId
     * @param int $usuarioId
     * @return Factura
     * @throws FacturacionException
     */
    public function eliminarDescuentoFactura(int $facturaId, int $usuarioId): Factura
    {
        return DB::transaction(function () use ($facturaId, $usuarioId) {
            $factura = Factura::findOrFail($facturaId);

            $factura->eliminarDescuento();

            Log::info('Descuento eliminado de factura', [
                'factura_id' => $factura->id,
                'numero_factura' => $factura->numero_factura,
                'total_factura' => $factura->total_factura,
                'usuario_id' => $usuarioId,
            ]);

            return $factura->fresh();
        });
    }

    /**
     * Anular factura
     *
     * @param int $facturaId
     * @param string $motivo
     * @param int $usuarioId
     * @return Factura
     * @throws FacturacionException
     */
    public function anularFactura(int $facturaId, string $motivo, int $usuarioId): Factura
    {
        return DB::transaction(function () use ($facturaId, $motivo, $usuarioId) {
            $factura = Factura::with('consumos')->findOrFail($facturaId);


            if (!$factura->puedeAnularse()) {
                throw FacturacionException::facturaNoAnulable($facturaId);
            }

            // Anular factura
            $factura->anular($motivo, $usuarioId);

            // Desasignar consumos (permitir re-facturación)
            $factura->consumos()->update(['factura_id' => null]);

            // LOG
            Log::warning("Factura anulada: {$factura->numero_factura}", [
                'factura_id' => $facturaId,
                'motivo' => $motivo,
                'usuario_id' => $usuarioId,
            ]);

            return $factura->fresh(['usuarioAnulo', 'reserva.huesped']);
        });
    }

    /**
     * Verificar si una reserva puede generar factura
     *
     * @param int $reservaId
     * @return array
     */
    public function verificarPuedeFacturar(int $reservaId): array
    {
        $reserva = Reserva::with(['consumos', 'factura'])->find($reservaId);

        if (!$reserva) {
            return [
                'puede_facturar' => false,
                'motivo' => 'Reserva no encontrada',
            ];
        }

        if ($reserva->tiene_factura_emitida) {
            return [
                'puede_facturar' => false,
                'motivo' => 'La reserva ya tiene una factura emitida',
                'factura_existente' => $reserva->factura->numero_factura,
            ];
        }

        if ($reserva->consumos->isEmpty()) {
            return [
                'puede_facturar' => false,
                'motivo' => 'La reserva no tiene consumos registrados',
            ];
        }

        return [
            'puede_facturar' => true,
            'motivo' => null,
            'cantidad_consumos' => $reserva->consumos->count(),
        ];
    }

    /**
     * Obtener factura por reserva
     *
     * @param int $reservaId
     * @return Factura|null
     */
    public function obtenerFacturaPorReserva(int $reservaId): ?Factura
    {
        return Factura::with([
            'consumos.inventario',
            'clienteFacturacion',
            'usuarioGenero',
            'usuarioRegistroDescuento'
        ])->where('reserva_id', $reservaId)->first();
    }

    /**
     * Recalcular totales de una factura (útil para correcciones)
     *
     * @param int $facturaId
     * @return Factura
     * @throws FacturacionException
     */
    public function recalcularTotales(int $facturaId): Factura
    {
        return DB::transaction(function () use ($facturaId) {
            $factura = Factura::with('consumos')->find($facturaId);

            if (!$factura) {
                throw FacturacionException::facturaNoEncontrada($facturaId);
            }

            if (!$factura->esta_emitida) {
                throw new FacturacionException("Solo se pueden recalcular facturas emitidas");
            }

            $factura->calcularTotales();
            $factura->save();

            Log::info("Totales recalculados para factura: {$factura->numero_factura}", [
                'factura_id' => $factura->id,
                'total_factura' => $factura->total_factura,
            ]);

            return $factura->fresh();
        });
    }

    // ====================================================================
    // MÉTODOS PRIVADOS
    // ====================================================================

    /**
     * Validar reserva antes de facturar
     */
    private function validarReserva(int $reservaId): Reserva
    {
        $reserva = Reserva::with(['consumos', 'factura'])->find($reservaId);

        if (!$reserva) {
            throw new FacturacionException("Reserva #{$reservaId} no encontrada", 404);
        }

        // Validar que no tenga factura
        if ($reserva->tiene_factura_emitida) {
            throw FacturacionException::reservaYaFacturada($reservaId);
        }

        // Validar que tenga consumos
        if ($reserva->consumos->isEmpty()) {
            throw FacturacionException::reservaSinConsumos($reservaId);
        }

        // Validar que los consumos no estén facturados
        $consumosFacturados = $reserva->consumos->where('factura_id', '!=', null);
        if ($consumosFacturados->isNotEmpty()) {
            throw FacturacionException::consumosYaFacturados();
        }

        return $reserva;
    }

    /**
     * Asignar cliente a reserva (tabla pivote)
     */
    private function asignarClienteAReserva(
        Reserva $reserva,
        int $clienteId,
        bool $solicitaDetallada,
        int $usuarioId
    ): void {
        $reserva->clientesFacturacion()->syncWithoutDetaching([
            $clienteId => [
                'solicita_factura_detallada' => $solicitaDetallada,
                'usuario_asigno_id' => $usuarioId,
            ]
        ]);
    }

    /**
     * Calcular totales desde consumos
     */
    private function calcularTotales(
        $consumos,
        float $descuento = 0,
        string $tipoDescuento = Factura::TIPO_DESCUENTO_MONTO_FIJO,
        ?float $porcentajeDescuento = null
    ): array {
        // PASO 1: Sumar subtotales de consumos (SIN IVA)
        $subtotal_sin_iva = 0;
        $tasa_iva_aplicable = 0;

        foreach ($consumos as $consumo) {
            $subtotal_sin_iva += $consumo->subtotal;

            // Obtener tasa de IVA (asumimos misma tasa para todos)
            if ($consumo->tasa_iva > 0 && $tasa_iva_aplicable == 0) {
                $tasa_iva_aplicable = $consumo->tasa_iva;
            }
        }

        // PASO 2: Calcular monto del descuento
        if ($tipoDescuento === Factura::TIPO_DESCUENTO_PORCENTAJE && $porcentajeDescuento > 0) {
            $descuento = $subtotal_sin_iva * ($porcentajeDescuento / 100);
        }

        // Validar que el descuento no supere el subtotal
        if ($descuento > $subtotal_sin_iva) {
            throw FacturacionException::descuentoInvalido($descuento, $subtotal_sin_iva);
        }

        // PASO 3: Calcular BASE IMPONIBLE (subtotal - descuento)
        $base_imponible = $subtotal_sin_iva - $descuento;

        // PASO 4: Calcular IVA sobre la base imponible (DESPUÉS del descuento)
        $total_iva = $base_imponible * ($tasa_iva_aplicable / 100);

        // PASO 5: ✅ Total final CON descuento (lo que realmente paga el cliente)
        $total_factura = $base_imponible + $total_iva;

        return [
            'subtotal_sin_iva'     => round($subtotal_sin_iva, 2),     // Subtotal ANTES de descuento
            'descuento'            => round($descuento, 2),              // Monto descontado
            'base_imponible'       => round($base_imponible, 2),        // Subtotal DESPUÉS de descuento
            'total_iva'            => round($total_iva, 2),              // IVA sobre base imponible
            'total_factura'        => round($total_factura, 2),          // ✅ Total final (CON descuento)
        ];
    }

    /**
     * Crear factura
     */
    private function crearFactura(
        string $numeroFactura,
        Reserva $reserva,
        ClienteFacturacion $cliente,
        array $totales,
        int $usuarioId,
        array $opciones,
        string $tipoDescuento,
        ?float $porcentajeDescuento,
        ?string $motivoDescuento
    ): Factura {
        $factura = new Factura();
        $factura->numero_factura = $numeroFactura;
        $factura->reserva_id = $reserva->id;
        $factura->cliente_facturacion_id = $cliente->id;
        $factura->fecha_emision = now()->toDateString();
        $factura->observaciones = $opciones['observaciones'] ?? null;
        $factura->usuario_genero_id = $usuarioId;

        // Copiar datos del cliente (inmutabilidad)
        $factura->copiarDatosCliente($cliente);

        // Asignar totales
        $factura->subtotal_sin_iva = $totales['subtotal_sin_iva'];
        $factura->total_iva = $totales['total_iva'];
        $factura->total_factura = $totales['total_factura'];
        $factura->descuento = $totales['descuento'];

        // ✅ NUEVO: Asignar datos de descuento
        if ($totales['descuento'] > 0) {
            $factura->tipo_descuento = $tipoDescuento;
            $factura->porcentaje_descuento = $porcentajeDescuento;
            $factura->motivo_descuento = $motivoDescuento;
            $factura->usuario_registro_descuento_id = $usuarioId;
        }

        $factura->save();

        return $factura;
    }

    /**
     * Asociar consumos a la factura
     */
    private function asociarConsumos($consumos, int $facturaId): void
    {
        $consumoIds = $consumos->pluck('id')->toArray();

        Consumo::whereIn('id', $consumoIds)
            ->update(['factura_id' => $facturaId]);
    }
}
