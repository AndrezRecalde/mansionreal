@extends('pdf.layouts.factura_layout')

@section('extra-styles')
    <style>
        .content-wrapper {
            opacity: 0.6;
        }
    </style>
@endsection

@section('content')
    {{-- MARCA DE AGUA --}}
    <div class="anulada-watermark">ANULADA</div>

    <div class="container">

        {{-- BANNER DE ANULADA --}}
        <div class="anulada-banner">
            ⚠️ FACTURA ANULADA ⚠️
        </div>

        <div class="content-wrapper">

            {{-- HEADER --}}
            <div class="header">
                <div class="header-left">
                    <div class="logo">{{ $hotel_nombre ?? 'Hotel Mansión Real' }}</div>
                    <div class="company-info">
                        <strong>RUC:</strong> 1234567890001<br>
                        <strong>Dirección:</strong> {{ $hotel_direccion ?? 'Av. Principal 123, Ecuador' }}<br>
                        <strong>Teléfono:</strong> {{ $hotel_telefono ?? '(02) 123-4567' }}<br>
                        <strong>Email:</strong> {{ $hotel_email ?? 'info@mansionreal.com' }}
                    </div>
                </div>
                <div class="header-right">
                    <div class="factura-box" style="background-color: #e74c3c;">
                        <div class="factura-title">FACTURA ANULADA</div>
                        <div class="factura-numero">{{ $factura->numero_factura }}</div>
                        <div class="factura-fecha">
                            Fecha Emisión: {{ $factura->fecha_emision->format('d/m/Y') }}
                        </div>
                    </div>
                </div>
            </div>

            {{-- INFORMACIÓN DE ANULACIÓN --}}
            <div class="cliente-section" style="background-color: #ffe6e6; border-left-color: #e74c3c;">
                <div class="section-title" style="color: #e74c3c;">⚠️ Información de Anulación</div>
                <div class="cliente-data">
                    <div class="cliente-row">
                        <div class="cliente-label">Fecha Anulación:</div>
                        <div class="cliente-value">{{ $factura->fecha_anulacion->format('d/m/Y H:i: s') }}</div>
                    </div>
                    <div class="cliente-row">
                        <div class="cliente-label">Anulada por:</div>
                        <div class="cliente-value">
                            {{ $factura->usuarioAnulo->nombres }} {{ $factura->usuarioAnulo->apellidos }}
                        </div>
                    </div>
                    <div class="cliente-row">
                        <div class="cliente-label">Motivo:</div>
                        <div class="cliente-value">{{ $factura->motivo_anulacion }}</div>
                    </div>
                </div>
            </div>

            {{-- INFORMACIÓN DEL CLIENTE --}}
            <div class="cliente-section">
                <div class="section-title">Datos del Cliente (Original)</div>
                <div class="cliente-data">
                    <div class="cliente-row">
                        <div class="cliente-label">Cliente:</div>
                        <div class="cliente-value">{{ $factura->cliente_nombre_completo }}</div>
                    </div>
                    <div class="cliente-row">
                        <div class="cliente-label">{{ $factura->cliente_tipo_identificacion }}:</div>
                        <div class="cliente-value">{{ $factura->cliente_identificacion }}</div>
                    </div>
                </div>
            </div>

            {{-- INFORMACIÓN DE LA RESERVA --}}
            <div class="cliente-section" style="background-color:  #f8f9fa; border-left-color: #95a5a6;">
                <div class="section-title">Datos de la Reserva (Original)</div>
                <div class="cliente-data">
                    <div class="cliente-row">
                        <div class="cliente-label">Código Reserva:</div>
                        <div class="cliente-value">{{ $factura->reserva->codigo_reserva }}</div>
                    </div>
                    <div class="cliente-row">
                        <div class="cliente-label">Huésped:</div>
                        <div class="cliente-value">
                            {{ $factura->reserva->huesped->nombres }} {{ $factura->reserva->huesped->apellidos }}
                        </div>
                    </div>
                </div>
            </div>

            {{-- DETALLE DE CONSUMOS (SIMPLIFICADO) --}}
            <div class="detalles-section">
                <div class="section-title">Detalle Original (Anulado)</div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%;">Cant.</th>
                            <th style="width:  55%;">Descripción</th>
                            <th class="text-right" style="width: 20%;">Subtotal</th>
                            <th class="text-right" style="width: 15%;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($factura->consumos as $consumo)
                            <tr>
                                <td class="text-center">{{ $consumo->cantidad }}</td>
                                <td>
                                    {{ $consumo->inventario->nombre_producto }}
                                    @if ($consumo->tasa_iva > 0)
                                        <small>(IVA {{ number_format($consumo->tasa_iva, 0) }}%)</small>
                                    @endif
                                </td>
                                <td class="text-right">${{ number_format($consumo->subtotal, 2) }}</td>
                                <td class="text-right">${{ number_format($consumo->total, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            {{-- TOTALES --}}
            <div class="totales-section">
                <div class="totales-left"></div>

                <div class="totales-right">
                    <div class="totales-box" style="border-color: #e74c3c;">
                        <div class="total-row">
                            <div class="total-label">Subtotal:</div>
                            <div class="total-value">
                                ${{ number_format($factura->subtotal_sin_iva + $factura->subtotal_con_iva, 2) }}</div>
                        </div>

                        @if ($factura->total_iva > 0)
                            <div class="total-row">
                                <div class="total-label">IVA: </div>
                                <div class="total-value">${{ number_format($factura->total_iva, 2) }}</div>
                            </div>
                        @endif

                        <div class="total-row total-final">
                            <div class="total-label">TOTAL (ANULADO):</div>
                            <div class="total-value" style="color: #e74c3c; text-decoration: line-through;">
                                ${{ number_format($factura->total_factura, 2) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {{-- FOOTER --}}
        <div class="footer">
            <p style="color: #e74c3c; font-weight: bold; font-size: 10pt;">
                ESTA FACTURA HA SIDO ANULADA Y NO TIENE VALIDEZ FISCAL
            </p>
            <p>Documento generado el {{ now()->format('d/m/Y H:i:s') }}</p>
            <p>Generado por: {{ $factura->usuarioGenero->nombres }} {{ $factura->usuarioGenero->apellidos }}</p>
        </div>

    </div>
@endsection
