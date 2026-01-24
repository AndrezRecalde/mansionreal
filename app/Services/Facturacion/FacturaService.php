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
     * ✅ ACTUALIZADO: Generar factura para una reserva
     *
     * Los descuentos ahora se manejan a nivel de consumos individuales
     *
     * @param int $reservaId
     * @param int $clienteFacturacionId
     * @param bool $solicitaFacturaDetallada
     * @param int $usuarioId
     * @param array $opciones [
     *      'observaciones' => string,
     *      'descuentos_consumos' => array [ // ✅ NUEVO: descuentos por consumo
     *          'consumo_id' => [
     *              'descuento' => float,
     *              'tipo_descuento' => string,
     *              'porcentaje_descuento' => float,
     *              'motivo_descuento' => string
     *          ]
     *      ]
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

            // 4. ✅ NUEVO: APLICAR DESCUENTOS A CONSUMOS (ANTES de generar factura)
            if (isset($opciones['descuentos_consumos']) && is_array($opciones['descuentos_consumos'])) {
                $this->aplicarDescuentosAConsumos($reserva->consumos, $opciones['descuentos_consumos'], $usuarioId);
                $reserva->load('consumos'); // Recargar consumos con descuentos aplicados
            }

            // 5. GENERAR NÚMERO DE FACTURA
            $numeroFactura = $this->secuenciaService->generarNumero();

            // 6. ✅ ACTUALIZADO: CALCULAR TOTALES (desde consumos con descuentos)
            $totales = $this->calcularTotalesDesdeConsumos($reserva->consumos);

            // 7. ✅ ACTUALIZADO: CREAR FACTURA (sin campos de descuento)
            $factura = $this->crearFactura(
                $numeroFactura,
                $reserva,
                $cliente,
                $totales,
                $usuarioId,
                $opciones
            );

            // 8. ASOCIAR CONSUMOS A LA FACTURA
            $this->asociarConsumos($reserva->consumos, $factura->id);

            // 9. LOG
            Log::info("Factura generada: {$factura->numero_factura}", [
                'factura_id' => $factura->id,
                'numero_factura' => $factura->numero_factura,
                'reserva_id' => $reservaId,
                'cliente_id' => $cliente->id,
                'subtotal_sin_iva' => $factura->subtotal_sin_iva,
                'total_descuentos' => $factura->total_descuento, // ✅ Calculado desde consumos
                'total_iva' => $factura->total_iva,
                'total_factura' => $factura->total_factura,
                'usuario_id' => $usuarioId,
            ]);

            return $factura->fresh([
                'reserva.huesped',
                'reserva.departamento',
                'consumos.inventario',
                'consumos.usuarioRegistroDescuento',
                'clienteFacturacion',
                'usuarioGenero'
            ]);
        });
    }

    /**
     * ✅ NUEVO: Aplicar descuento a un consumo específico
     *
     * @param int $consumoId
     * @param float $descuento
     * @param string $tipoDescuento
     * @param float|null $porcentajeDescuento
     * @param string|null $motivo
     * @param int $usuarioId
     * @return Consumo
     * @throws FacturacionException
     */
    public function aplicarDescuentoConsumo(
        int $consumoId,
        float $descuento,
        string $tipoDescuento = Consumo::TIPO_DESCUENTO_MONTO_FIJO,
        ?float $porcentajeDescuento = null,
        ?string $motivo = null,
        int $usuarioId
    ): Consumo {
        return DB::transaction(function () use (
            $consumoId,
            $descuento,
            $tipoDescuento,
            $porcentajeDescuento,
            $motivo,
            $usuarioId
        ) {
            $consumo = Consumo::findOrFail($consumoId);

            // Validar que no esté facturado
            if ($consumo->esta_facturado) {
                throw new FacturacionException(
                    "No se puede aplicar descuento a un consumo ya facturado"
                );
            }

            // Aplicar descuento usando el método del modelo
            $success = $consumo->aplicarDescuento(
                $descuento,
                $tipoDescuento,
                $motivo,
                $usuarioId
            );

            if (!$success) {
                throw new FacturacionException(
                    "Error al aplicar descuento al consumo #{$consumoId}"
                );
            }

            Log::info('Descuento aplicado a consumo', [
                'consumo_id' => $consumo->id,
                'reserva_id' => $consumo->reserva_id,
                'descuento' => $descuento,
                'tipo' => $tipoDescuento,
                'porcentaje' => $porcentajeDescuento,
                'total_consumo' => $consumo->total,
                'usuario_id' => $usuarioId,
            ]);

            return $consumo->fresh(['inventario', 'usuarioRegistroDescuento']);
        });
    }

    /**
     * ✅ NUEVO: Eliminar descuento de un consumo
     *
     * @param int $consumoId
     * @param int $usuarioId
     * @return Consumo
     * @throws FacturacionException
     */
    public function eliminarDescuentoConsumo(int $consumoId, int $usuarioId): Consumo
    {
        return DB::transaction(function () use ($consumoId, $usuarioId) {
            $consumo = Consumo::findOrFail($consumoId);

            if ($consumo->esta_facturado) {
                throw new FacturacionException(
                    "No se puede eliminar descuento de un consumo ya facturado"
                );
            }

            $consumo->removerDescuento();

            Log::info('Descuento eliminado de consumo', [
                'consumo_id' => $consumo->id,
                'total_consumo' => $consumo->total,
                'usuario_id' => $usuarioId,
            ]);

            return $consumo->fresh();
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
            // NOTA: Los descuentos en consumos se mantienen para auditoría
            $factura->consumos()->update(['factura_id' => null]);

            Log::warning("Factura anulada: {$factura->numero_factura}", [
                'factura_id' => $facturaId,
                'motivo' => $motivo,
                'usuario_id' => $usuarioId,
            ]);

            return $factura->fresh(['usuarioAnulo', 'reserva.huesped', 'consumos']);
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
                'motivos' => ['Reserva no encontrada'],
                'tiene_factura' => false,
                'factura_existente' => null,
                'total_consumos' => 0,
                'cantidad_consumos' => 0,
            ];
        }

        $motivos = [];

        if ($reserva->tiene_factura_emitida) {
            $motivos[] = 'La reserva ya tiene una factura emitida';
            return [
                'puede_facturar' => false,
                'motivos' => $motivos,
                'tiene_factura' => true,
                'factura_existente' => $reserva->factura->numero_factura,
                'total_consumos' => $reserva->consumos->sum('total'),
                'cantidad_consumos' => $reserva->consumos->count(),
            ];
        }

        if ($reserva->consumos->isEmpty()) {
            $motivos[] = 'La reserva no tiene consumos registrados';
        }

        return [
            'puede_facturar' => empty($motivos),
            'motivos' => $motivos,
            'tiene_factura' => false,
            'factura_existente' => null,
            'total_consumos' => $reserva->consumos->sum('total'),
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
            'consumos.usuarioRegistroDescuento', // ✅ NUEVO
            'clienteFacturacion',
            'usuarioGenero'
        ])->where('reserva_id', $reservaId)->first();
    }

    /**
     * ✅ ACTUALIZADO: Recalcular totales de una factura desde consumos
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

            // ✅ NUEVO: Usa el método del modelo que calcula desde consumos
            $factura->recalcularTotales();

            Log::info("Totales recalculados para factura: {$factura->numero_factura}", [
                'factura_id' => $factura->id,
                'subtotal_sin_iva' => $factura->subtotal_sin_iva,
                'total_descuentos' => $factura->total_descuentos,
                'total_iva' => $factura->total_iva,
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
     * ✅ NUEVO: Aplicar descuentos a múltiples consumos
     */
    private function aplicarDescuentosAConsumos(
        $consumos,
        array $descuentosData,
        int $usuarioId
    ): void {
        foreach ($consumos as $consumo) {
            // Verificar si hay descuento para este consumo
            if (isset($descuentosData[$consumo->id])) {
                $dataDescuento = $descuentosData[$consumo->id];

                $consumo->aplicarDescuento(
                    descuento: $dataDescuento['descuento'] ?? 0,
                    tipo: $dataDescuento['tipo_descuento'] ?? Consumo::TIPO_DESCUENTO_MONTO_FIJO,
                    motivo: $dataDescuento['motivo_descuento'] ?? null,
                    usuarioId: $usuarioId
                );
            }
        }
    }

    /**
     * ✅ NUEVO: Calcular totales desde consumos (con descuentos ya aplicados)
     */
    private function calcularTotalesDesdeConsumos($consumos): array
    {
        $subtotal_sin_iva = 0;
        $total_descuento = 0;
        $total_iva = 0;
        $total_factura = 0;

        foreach ($consumos as $consumo) {
            $subtotal_sin_iva += $consumo->subtotal; // Subtotal antes de descuento
            $total_descuento += $consumo->descuento; // Total descuentos
            $total_iva += $consumo->iva;              // IVA ya calculado con descuento
            $total_factura += $consumo->total;        // Total con descuento aplicado
        }

        return [
            'subtotal_sin_iva' => round($subtotal_sin_iva, 2),
            'total_descuento' => round($total_descuento, 2),
            'total_iva' => round($total_iva, 2),
            'total_factura' => round($total_factura, 2),
        ];
    }

    /**
     * ✅ ACTUALIZADO: Crear factura (sin campos de descuento)
     */
    private function crearFactura(
        string $numeroFactura,
        Reserva $reserva,
        ClienteFacturacion $cliente,
        array $totales,
        int $usuarioId,
        array $opciones
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

        // Asignar totales (calculados desde consumos)
        $factura->subtotal_sin_iva = $totales['subtotal_sin_iva'];
        $factura->total_descuento = $totales['total_descuento'];
        $factura->total_iva = $totales['total_iva'];
        $factura->total_factura = $totales['total_factura'];

        // ❌ REMOVIDO: Ya no se asignan campos de descuento aquí
        // Los descuentos están en los consumos individuales

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
