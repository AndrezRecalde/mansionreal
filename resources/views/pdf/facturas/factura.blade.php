@extends('pdf.layouts.factura_layout')

@section('content')
    <div class="container">

        {{-- HEADER --}}
        <div class="header">
            <div class="header-left">
                <div class="logo">{{ $hotel_nombre ?? 'Hotel Mansión Real' }}</div>
                <div class="company-info">
                    <strong>RUC:</strong> 1234567890001<br>
                    <strong>Dirección:</strong> {{ $hotel_direccion ?? 'Av. Principal 123, Ecuador' }}<br>
                    <strong>Teléfono: </strong> {{ $hotel_telefono ?? '(02) 123-4567' }}<br>
                    <strong>Email:</strong> {{ $hotel_email ?? 'info@mansionreal.com' }}
                </div>
            </div>
            <div class="header-right">
                <div class="factura-box">
                    <div class="factura-title">FACTURA</div>
                    <div class="factura-numero">{{ $factura->numero_factura }}</div>
                    <div class="factura-fecha">
                        Fecha: {{ $factura->fecha_emision->format('d/m/Y') }}
                    </div>
                </div>
            </div>
        </div>

        {{-- INFORMACIÓN DEL CLIENTE --}}
        <div class="cliente-section">
            <div class="section-title">Datos del Cliente</div>
            <div class="cliente-data">
                <div class="cliente-row">
                    <div class="cliente-label">Cliente:</div>
                    <div class="cliente-value">{{ $factura->cliente_nombre_completo }}</div>
                </div>
                <div class="cliente-row">
                    <div class="cliente-label">{{ $factura->cliente_tipo_identificacion }}:</div>
                    <div class="cliente-value">{{ $factura->cliente_identificacion }}</div>
                </div>
                @if ($factura->cliente_direccion)
                    <div class="cliente-row">
                        <div class="cliente-label">Dirección:</div>
                        <div class="cliente-value">{{ $factura->cliente_direccion }}</div>
                    </div>
                @endif
                @if ($factura->cliente_telefono)
                    <div class="cliente-row">
                        <div class="cliente-label">Teléfono:</div>
                        <div class="cliente-value">{{ $factura->cliente_telefono }}</div>
                    </div>
                @endif
                @if ($factura->cliente_email)
                    <div class="cliente-row">
                        <div class="cliente-label">Email:</div>
                        <div class="cliente-value">{{ $factura->cliente_email }}</div>
                    </div>
                @endif
            </div>
        </div>

        {{-- INFORMACIÓN DE LA RESERVA --}}
        <div class="cliente-section" style="background-color: #e8f5e9; border-left-color: #27ae60;">
            <div class="section-title">Datos de la Reserva</div>
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
                @if ($factura->reserva->departamento)
                    <div class="cliente-row">
                        <div class="cliente-label">Habitación:</div>
                        <div class="cliente-value">
                            {{ $factura->reserva->departamento->numero_departamento }}
                            ({{ $factura->reserva->departamento->tipoDepartamento->nombre_tipo }})
                        </div>
                    </div>
                @endif
                <div class="cliente-row">
                    <div class="cliente-label">Check-in:</div>
                    <div class="cliente-value">
                        {{ \Carbon\Carbon::parse($factura->reserva->fecha_checkin)->format('d/m/Y H:i') }}</div>
                </div>
                <div class="cliente-row">
                    <div class="cliente-label">Check-out:</div>
                    <div class="cliente-value">
                        {{ \Carbon\Carbon::parse($factura->reserva->fecha_checkout)->format('d/m/Y H:i') }}</div>
                </div>
            </div>
        </div>

        {{-- DETALLE DE CONSUMOS --}}
        <div class="detalles-section">
            <div class="section-title">Detalle de Consumos</div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 10%;">Cant.</th>
                        <th style="width: 50%;">Descripción</th>
                        <th class="text-right" style="width: 13%;">P. Unit.</th>
                        <th class="text-right" style="width: 13%;">Subtotal</th>
                        <th class="text-right" style="width: 14%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($consumos_agrupados ?? $factura->consumos->groupBy('inventario.categoria. nombre_categoria') as $categoria => $consumos)
                        {{-- Categoría Header --}}
                        <tr>
                            <td colspan="5" class="categoria-header">
                                {{ $categoria }}
                            </td>
                        </tr>

                        {{-- Items de la categoría --}}
                        @foreach ($consumos as $consumo)
                            <tr>
                                <td class="text-center">{{ $consumo->cantidad }}</td>
                                <td>
                                    {{ $consumo->inventario->nombre_producto }}
                                    @if ($consumo->tasa_iva > 0)
                                        <small style="color: #27ae60;">(IVA
                                            {{ number_format($consumo->tasa_iva, 0) }}%)</small>
                                    @else
                                        <small style="color: #95a5a6;">(IVA 0%)</small>
                                    @endif
                                </td>
                                <td class="text-right">${{ number_format($consumo->inventario->precio_unitario, 2) }}</td>
                                <td class="text-right">${{ number_format($consumo->subtotal, 2) }}</td>
                                <td class="text-right font-bold">${{ number_format($consumo->total, 2) }}</td>
                            </tr>
                        @endforeach
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- TOTALES --}}
        <div class="totales-section">
            <div class="totales-left">
                @if ($factura->observaciones)
                    <div class="observaciones-section">
                        <div class="section-title">Observaciones</div>
                        <p>{{ $factura->observaciones }}</p>
                    </div>
                @endif
            </div>

            <div class="totales-right">
                <div class="totales-box">
                    @if ($factura->subtotal_sin_iva > 0)
                        <div class="total-row">
                            <div class="total-label">Subtotal 0% IVA:</div>
                            <div class="total-value">${{ number_format($factura->subtotal_sin_iva, 2) }}</div>
                        </div>
                    @endif

                    @if ($factura->subtotal_con_iva > 0)
                        <div class="total-row">
                            <div class="total-label">Subtotal {{ $factura->consumos->first()?->tasa_iva ?? 15 }}% IVA:
                            </div>
                            <div class="total-value">${{ number_format($factura->subtotal_con_iva, 2) }}</div>
                        </div>
                    @endif

                    <div class="total-row">
                        <div class="total-label">Subtotal: </div>
                        <div class="total-value">
                            ${{ number_format($factura->subtotal_sin_iva + $factura->subtotal_con_iva, 2) }}</div>
                    </div>

                    @if ($factura->total_iva > 0)
                        <div class="total-row">
                            <div class="total-label">IVA {{ $factura->consumos->first()?->tasa_iva ?? 15 }}%:</div>
                            <div class="total-value">${{ number_format($factura->total_iva, 2) }}</div>
                        </div>
                    @endif

                    @if ($factura->descuento > 0)
                        <div class="total-row">
                            <div class="total-label">Descuento: </div>
                            <div class="total-value" style="color: #e74c3c;">-${{ number_format($factura->descuento, 2) }}
                            </div>
                        </div>
                    @endif

                    <div class="total-row total-final">
                        <div class="total-label">TOTAL A PAGAR:</div>
                        <div class="total-value">${{ number_format($factura->total_factura, 2) }}</div>
                    </div>
                </div>
            </div>
        </div>

        {{-- FOOTER --}}
        <div class="footer">
            <p>Documento generado el {{ now()->format('d/m/Y H:i:s') }}</p>
            <p>Generado por: {{ $factura->usuarioGenero->nombres }} {{ $factura->usuarioGenero->apellidos }}</p>
            <p style="margin-top: 10px;">
                Este documento es una representación impresa de una factura electrónica. <br>
                Para consultas: {{ $hotel_email ?? 'info@mansionreal.com' }} | {{ $hotel_telefono ?? '(02) 123-4567' }}
            </p>
        </div>

    </div>
@endsection
