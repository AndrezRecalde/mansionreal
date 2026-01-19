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
     * @param array $opciones [observaciones, descuento]
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

            // 5. CALCULAR TOTALES
            $totales = $this->calcularTotales($reserva->consumos, $opciones['descuento'] ?? 0);

            // 6. CREAR FACTURA
            $factura = $this->crearFactura(
                $numeroFactura,
                $reserva,
                $cliente,
                $totales,
                $usuarioId,
                $opciones
            );

            // 7. ASOCIAR CONSUMOS A LA FACTURA
            $this->asociarConsumos($reserva->consumos, $factura->id);

            // 8. LOG
            Log::info("Factura generada:  {$factura->numero_factura}", [
                'factura_id' => $factura->id,
                'reserva_id' => $reservaId,
                'usuario_id' => $usuarioId,
            ]);

            return $factura->load([
                'reserva.huesped',
                'reserva.departamento',
                'consumos.inventario',
                'clienteFacturacion'
            ]);
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
            $factura = Factura::find($facturaId);

            if (!$factura) {
                throw FacturacionException::facturaNoEncontrada($facturaId);
            }

            if (! $factura->puedeAnularse()) {
                throw FacturacionException::facturaNoAnulable($facturaId);
            }

            // Anular factura
            $factura->anular($motivo, $usuarioId);

            // Desasignar consumos (permitir re-facturación)
            Consumo::where('factura_id', $facturaId)
                ->update(['factura_id' => null]);

            // LOG
            Log::warning("Factura anulada: {$factura->numero_factura}", [
                'factura_id' => $facturaId,
                'motivo' => $motivo,
                'usuario_id' => $usuarioId,
            ]);

            return $factura->fresh(['usuarioAnulo', 'consumos', 'reserva.huesped']);
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
            ];
        }

        $motivos = [];

        if ($reserva->tiene_factura_emitida) {
            $motivos[] = 'Ya tiene factura generada';
        }

        if ($reserva->consumos->isEmpty()) {
            $motivos[] = 'No tiene consumos registrados';
        }

        $consumosFacturados = $reserva->consumos->where('factura_id', '!=', null);
        if ($consumosFacturados->isNotEmpty()) {
            $motivos[] = 'Algunos consumos ya están facturados';
        }

        return [
            'puede_facturar' => empty($motivos),
            'motivos' => $motivos,
            'tiene_factura' => $reserva->tiene_factura_emitida,
            'factura_existente' => $reserva->factura,
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
            'clienteFacturacion',
            'usuarioGenero'
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

            Log::info("Totales recalculados para factura:  {$factura->numero_factura}");

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
        $reserva->asignarClienteFacturacion(
            $clienteId,
            $solicitaDetallada,
            $usuarioId
        );
    }

    /**
     * Calcular totales desde consumos
     */
    private function calcularTotales($consumos, float $descuento = 0): array
    {
        $subtotal = 0;
        $total_iva = 0;

        foreach ($consumos as $consumo) {
            // Traspaso de datos desde consumos:
            // subtotal_sin_iva = suma de subtotal de los consumos
            // iva = suma de iva de los consumos
            $subtotal += $consumo->subtotal;
            $total_iva += $consumo->iva;
        }

        // total_factura = subtotal_sin_iva + iva (sin descuento)
        $totalFactura = $subtotal + $total_iva;

        // Validar descuento
        if ($descuento > $totalFactura) {
            throw FacturacionException::descuentoInvalido($descuento, $totalFactura);
        }

        // total_con_descuento = total_factura - descuento
        $totalConDescuento = $totalFactura - $descuento;

        return [
            'subtotal_sin_iva'     => $subtotal,
            'total_iva'            => $total_iva,
            'total_factura'        => $totalFactura,
            'descuento'            => $descuento,
            'total_con_descuento'  => $totalConDescuento,
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

        // Asignar totales
        $factura->subtotal_sin_iva = $totales['subtotal_sin_iva'];
        $factura->total_iva = $totales['total_iva'];
        $factura->descuento = $totales['descuento'];
        $factura->total_factura = $totales['total_factura'];
        $factura->total_con_descuento = $totales['total_con_descuento'];

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
