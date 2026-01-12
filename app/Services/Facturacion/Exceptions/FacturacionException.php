<?php

namespace App\Services\Facturacion\Exceptions;

use Exception;

class FacturacionException extends Exception
{
    /**
     * Error codes
     */
    const RESERVA_YA_FACTURADA = 1001;
    const RESERVA_SIN_CONSUMOS = 1002;
    const CONSUMOS_YA_FACTURADOS = 1003;
    const CLIENTE_INACTIVO = 1004;
    const ERROR_SECUENCIAL = 1005;
    const FACTURA_NO_ANULABLE = 1006;
    const DESCUENTO_INVALIDO = 1007;
    const FACTURA_NO_ENCONTRADA = 1008;

    /**
     * Crear excepción con código específico
     */
    public static function reservaYaFacturada(int $reservaId): self
    {
        return new self(
            "La reserva #{$reservaId} ya tiene una factura generada",
            self::RESERVA_YA_FACTURADA
        );
    }

    public static function reservaSinConsumos(int $reservaId): self
    {
        return new self(
            "La reserva #{$reservaId} no tiene consumos para facturar",
            self::RESERVA_SIN_CONSUMOS
        );
    }

    public static function consumosYaFacturados(): self
    {
        return new self(
            "Algunos consumos ya están incluidos en otra factura",
            self::CONSUMOS_YA_FACTURADOS
        );
    }

    public static function clienteInactivo(int $clienteId): self
    {
        return new self(
            "El cliente #{$clienteId} está inactivo",
            self::CLIENTE_INACTIVO
        );
    }

    public static function errorSecuencial(string $mensaje): self
    {
        return new self(
            "Error al generar número de factura: {$mensaje}",
            self::ERROR_SECUENCIAL
        );
    }

    public static function facturaNoAnulable(int $facturaId): self
    {
        return new self(
            "La factura #{$facturaId} no puede ser anulada",
            self::FACTURA_NO_ANULABLE
        );
    }

    public static function descuentoInvalido(float $descuento, float $total): self
    {
        return new self(
            "El descuento \${$descuento} no puede ser mayor al total \${$total}",
            self::DESCUENTO_INVALIDO
        );
    }

    public static function facturaNoEncontrada(int $facturaId): self
    {
        return new self(
            "La factura #{$facturaId} no fue encontrada",
            self::FACTURA_NO_ENCONTRADA
        );
    }
}
