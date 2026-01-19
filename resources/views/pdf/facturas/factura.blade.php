@extends('pdf.layout.factura_layout')

@section('content')
    {{-- HEADER --}}
    <div class="header clearfix">
        <div class="header-content">
            <div class="header-left">
                <div class="logo">{{ $hotel_nombre ?? 'Hotel Mansión Real' }}</div>
                <div class="company-info">
                    <strong>RUC:</strong> {{ $hotel_ruc ?? '1234567890001' }}<br>
                    <strong>Dirección:</strong> {{ $hotel_direccion ?? 'Av. Principal 123, Ecuador' }}<br>
                    <strong>Teléfono:</strong> {{ $hotel_telefono ?? '(02) 123-4567' }}<br>
                    <strong>Email: </strong> {{ $hotel_email ?? 'info@mansionreal.com' }}
                </div>
            </div>
            <div class="header-right">
                <div class="factura-box">
                    <div class="factura-title">FACTURA</div>
                    <div class="factura-numero">{{ $factura->numero_factura }}</div>
                    <div class="factura-fecha">
                        Fecha: {{ \Carbon\Carbon::parse($factura->fecha_emision)->format('d/m/Y') }}
                    </div>
                </div>
                @if ($factura->solicita_factura_detallada)
                    <div class="badge-detallada">FACTURA DETALLADA</div>
                @endif
            </div>
        </div>
    </div>

    {{-- INFORMACIÓN DEL CLIENTE --}}
    <div class="cliente-section">
        @if ($factura->solicita_factura_detallada)
            <div class="section-title">Datos Fiscales del Cliente</div>
        @else
            <div class="section-title">Datos del Cliente</div>
        @endif
        <div class="cliente-data">
            <div class="cliente-row">
                <span class="cliente-label">Razón Social:</span>
                <span class="cliente-value">{{ $factura->cliente_nombres_completos }}</span>
            </div>
            <div class="cliente-row">
                <span class="cliente-label">{{ $factura->cliente_tipo_identificacion }}:</span>
                <span class="cliente-value">{{ $factura->cliente_identificacion }}</span>
            </div>
            @if ($factura->solicita_factura_detallada || $factura->cliente_direccion)
                <div class="cliente-row">
                    <span class="cliente-label">Dirección:</span>
                    <span class="cliente-value">{{ $factura->cliente_direccion ?? 'No especificada' }}</span>
                </div>
            @endif
            @if ($factura->cliente_telefono)
                <div class="cliente-row">
                    <span class="cliente-label">Teléfono:</span>
                    <span class="cliente-value">{{ $factura->cliente_telefono }}</span>
                </div>
            @endif
            @if ($factura->solicita_factura_detallada && $factura->cliente_email)
                <div class="cliente-row">
                    <span class="cliente-label">Email:</span>
                    <span class="cliente-value">{{ $factura->cliente_email }}</span>
                </div>
            @endif
        </div>
    </div>

    {{-- INFORMACIÓN DE LA RESERVA --}}
    @if ($factura->reserva)
        <div class="cliente-section" style="background-color:  #e8f5e9; border-left-color: #27ae60;">
            <div class="section-title">Datos de la Reserva</div>
            <div class="cliente-data">
                <div class="cliente-row">
                    <span class="cliente-label">Código Reserva:</span>
                    <span class="cliente-value">{{ $factura->reserva->codigo_reserva }}</span>
                </div>
                <div class="cliente-row">
                    <span class="cliente-label">Huésped:</span>
                    <span class="cliente-value">{{ $factura->reserva->huesped->nombres_completos }}</span>
                </div>
                @if ($factura->reserva->departamento)
                    <div class="cliente-row">
                        <span class="cliente-label">Habitación:</span>
                        <span class="cliente-value">
                            {{ $factura->reserva->departamento->numero_departamento }}
                            ({{ $factura->reserva->departamento->tipoDepartamento->nombre_tipo }})
                        </span>
                    </div>
                @endif
                <div class="cliente-row">
                    <span class="cliente-label">Check-in:</span>
                    <span
                        class="cliente-value">{{ \Carbon\Carbon::parse($factura->reserva->fecha_checkin)->format('d/m/Y H:i') }}</span>
                </div>
                <div class="cliente-row">
                    <span class="cliente-label">Check-out:</span>
                    <span
                        class="cliente-value">{{ \Carbon\Carbon::parse($factura->reserva->fecha_checkout)->format('d/m/Y H:i') }}</span>
                </div>
                <div class="cliente-row">
                    <span class="cliente-label">Total Noches:</span>
                    <span class="cliente-value">{{ $factura->reserva->total_noches }}</span>
                </div>
            </div>
        </div>
    @endif

    {{-- DETALLE DE CONSUMOS --}}
    <div class="detalles-section">
        @if ($factura->solicita_factura_detallada)
            <div class="section-title">Detalle Completo de Consumos</div>
        @else
            <div class="section-title">Detalle de Consumos</div>
        @endif

        @if ($consumos_agrupados && count($consumos_agrupados) > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width: 8%;">Cant.</th>
                        <th style="width: 42%;">Descripción</th>
                        <th class="text-right" style="width: 15%;">P. Unit.</th>
                        @if ($factura->solicita_factura_detallada)
                            <th class="text-right" style="width: 15%;">Subtotal</th>
                            <th class="text-center" style="width: 8%;">IVA%</th>
                        @endif
                        <th class="text-right" style="width: 12%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($consumos_agrupados as $categoria => $consumos)
                        <tr>
                            <td colspan="{{ $factura->solicita_factura_detallada ? '6' : '4' }}" class="categoria-header">
                                {{ $categoria }}
                            </td>
                        </tr>
                        @foreach ($consumos as $consumo)
                            <tr>
                                <td class="text-center">{{ number_format($consumo->cantidad, 2) }}</td>
                                <td>{{ $consumo->inventario->nombre_producto }}</td>
                                <td class="text-right">${{ number_format($consumo->inventario->precio_unitario, 2) }}</td>
                                @if ($factura->solicita_factura_detallada)
                                    <td class="text-right">${{ number_format($consumo->subtotal, 2) }}</td>
                                    <td class="text-center">{{ $consumo->tasa_iva > 0 ? $consumo->tasa_iva . '%' : '0%' }}
                                    </td>
                                @endif
                                <td class="text-right"><strong>${{ number_format($consumo->total, 2) }}</strong></td>
                            </tr>
                        @endforeach
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="text-align: center; padding: 15px; color: #999;">No hay consumos registrados</p>
        @endif
    </div>

    {{-- DESGLOSE TRIBUTARIO (solo factura detallada) --}}
    @if ($factura->solicita_factura_detallada)
        <div class="tributario-section">
            <div class="section-title">Desglose Tributario</div>
            <div class="cliente-data">
                <div class="cliente-row">
                    <span class="cliente-label">Base Imponible 0%:</span>
                    <span class="cliente-value">${{ number_format($factura->subtotal_sin_iva, 2) }}</span>
                </div>
                <div class="cliente-row">
                    <span class="cliente-label">Base Imponible {{ $factura->consumos->first()?->tasa_iva ?? 15 }}%:</span>
                    <span class="cliente-value">${{ number_format($factura->subtotal_con_iva, 2) }}</span>
                </div>
                <div class="cliente-row">
                    <span class="cliente-label">IVA {{ $factura->consumos->first()?->tasa_iva ?? 15 }}%:</span>
                    <span class="cliente-value">${{ number_format($factura->total_iva, 2) }}</span>
                </div>
            </div>
        </div>
    @endif

    {{-- TOTALES --}}
    <div class="totales-section">
        <div class="totales-box">
            @if (!$factura->solicita_factura_detallada)
                <div class="totales-row">
                    <span class="totales-label">Subtotal sin IVA:</span>
                    <span class="totales-value">${{ number_format($factura->subtotal_sin_iva, 2) }}</span>
                </div>
                <div class="totales-row">
                    <span class="totales-label">Subtotal con IVA:</span>
                    <span class="totales-value">${{ number_format($factura->subtotal_con_iva, 2) }}</span>
                </div>
                <div class="totales-row">
                    <span class="totales-label">IVA {{ $factura->consumos->first()?->tasa_iva ?? 15 }}%:</span>
                    <span class="totales-value">${{ number_format($factura->total_iva, 2) }}</span>
                </div>
            @endif
            @if ($factura->descuento > 0)
                <div class="totales-row">
                    <span class="totales-label">Descuento:</span>
                    <span class="totales-value"
                        style="color: #e74c3c;">-${{ number_format($factura->descuento, 2) }}</span>
                </div>
            @endif
            <div class="totales-row total-final">
                <span class="totales-label">TOTAL A PAGAR:</span>
                <span class="totales-value">${{ number_format($factura->total_factura, 2) }}</span>
            </div>
        </div>
    </div>

    {{-- OBSERVACIONES --}}
    @if ($factura->observaciones)
        <div class="observaciones-section">
            <div class="observaciones-title">OBSERVACIONES: </div>
            <div class="observaciones-text">{{ $factura->observaciones }}</div>
        </div>
    @endif

    {{-- FOOTER --}}
    <div class="footer">
        <div class="footer-text">
            <strong>Gracias por su preferencia</strong>
        </div>
        @if ($factura->solicita_factura_detallada)
            <div class="footer-text">
                <strong>DOCUMENTO VÁLIDO PARA SUSTENTAR COSTOS Y GASTOS</strong>
            </div>
        @endif
        <div class="footer-text">
            Este documento es una representación impresa de una factura electrónica
        </div>
        <div class="footer-text">
            Usuario: {{ $factura->usuarioGenero->nombres ?? 'Sistema' }} {{ $factura->usuarioGenero->apellidos ?? '' }}
        </div>
        <div class="footer-text" style="margin-top: 5px;">
            Generado el {{ \Carbon\Carbon::now()->format('d/m/Y H:i: s') }}
        </div>
    </div>
@endsection
