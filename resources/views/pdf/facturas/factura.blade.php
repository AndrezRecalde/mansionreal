@extends('pdf.layout.factura_layout')

@section('extra-styles')
    <style>
        /* Estilos adicionales para descuentos */
        .descuento-badge {
            background-color: #ff9800;
            color: white;
            padding: 2px 6px;
            border-radius: 2px;
            font-size: 6pt;
            font-weight: bold;
            display: inline-block;
            margin-left: 3px;
        }

        .fila-con-descuento {
            background-color: #fff3e0;
        }

        .precio-tachado {
            text-decoration: line-through;
            color: #999;
            font-size: 7pt;
        }

        .precio-descuento {
            color: #e74c3c;
            font-weight: bold;
        }

        .motivos-descuento-section {
            background-color: #fff9c4;
            border: 1px solid #fbc02d;
            padding: 8px;
            margin: 10px 0;
            border-radius: 3px;
        }

        .motivo-item {
            font-size: 7pt;
            margin: 3px 0;
            padding-left: 8px;
        }

        .motivo-producto {
            font-weight: bold;
            color: #333;
        }

        .motivo-texto {
            color: #666;
        }

        .descuento-icon {
            color: #ff9800;
            font-size: 8pt;
            font-weight: bold;
        }

        .totales-row-descuento {
            background-color: #fff3e0;
            border-left: 3px solid #ff9800;
        }

        .ahorro-badge {
            font-size: 7pt;
            color: #27ae60;
            text-align: right;
            margin-top: 3px;
            font-weight: bold;
        }
    </style>
@endsection

@section('content')
    @php
        // Verificar si hay descuentos en la factura
        $tieneDescuentos = false;
        $totalDescuentos = 0;
        $consumosConDescuento = [];
        $subtotalAntesDescuentos = 0;

        if ($factura->consumos && count($factura->consumos) > 0) {
            foreach ($factura->consumos as $consumo) {
                $subtotalAntesDescuentos += $consumo->subtotal;

                if ($consumo->descuento > 0) {
                    $tieneDescuentos = true;
                    $totalDescuentos += $consumo->descuento;
                    $consumosConDescuento[] = $consumo;
                }
            }
        }
    @endphp

    {{-- HEADER --}}
    <div class="header clearfix">
        <div class="header-content">
            <div class="header-left">
                <div class="logo">{{ $hotel_nombre ?? 'Hotel Mansión Real' }}</div>
                <div class="company-info">
                    <strong>RUC:</strong> {{ $hotel_ruc ?? '1234567890001' }}<br>
                    <strong>Dirección:</strong> {{ $hotel_direccion ?? 'Av. Principal 123, Ecuador' }}<br>
                    <strong>Teléfono:</strong> {{ $hotel_telefono ?? '(02) 123-4567' }}<br>
                    <strong>Email:</strong> {{ $hotel_email ?? 'info@mansionreal.com' }}
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
                @if ($tieneDescuentos)
                    <div class="badge-detallada" style="background-color: #ff9800; margin-top: 4px;">
                        CON DESCUENTOS
                    </div>
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
        <div class="cliente-section" style="background-color: #e8f5e9; border-left-color: #27ae60;">
            <div class="section-title">Información de la Reserva</div>
            <div class="cliente-data">
                <div class="cliente-row">
                    <span class="cliente-label">Código de Reserva:</span>
                    <span class="cliente-value">{{ $factura->reserva->codigo_reserva }}</span>
                </div>
                @if ($factura->reserva->departamento)
                    <div class="cliente-row">
                        <span class="cliente-label">Departamento:</span>
                        <span class="cliente-value">
                            N.° {{ $factura->reserva->departamento->numero_departamento }}
                            ({{ $factura->reserva->departamento->tipoDepartamento->nombre_tipo ?? 'N/A' }})
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
            <div class="section-title">
                Detalle Completo de Consumos
                @if ($tieneDescuentos)
                    <span class="descuento-icon">● Incluye Descuentos</span>
                @endif
            </div>
        @else
            <div class="section-title">
                Detalle de Consumos
                @if ($tieneDescuentos)
                    <span class="descuento-icon">● Incluye Descuentos</span>
                @endif
            </div>
        @endif

        <table>
            <thead>
                <tr>
                    <th style="width: 8%;">Cant.</th>
                    <th style="width: {{ $tieneDescuentos ? '32%' : '42%' }};">Descripción</th>
                    <th class="text-right" style="width: 15%;">P. Unit.</th>
                    @if ($tieneDescuentos)
                        <th class="text-right" style="width: 15%;">Subtotal</th>
                        <th class="text-right" style="width: 12%;">Descuento</th>
                    @endif
                    <th class="text-right" style="width: {{ $tieneDescuentos ? '15%' : '12%' }};">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($consumos_agrupados as $categoria => $consumos)
                    <tr>
                        <td colspan="{{ $tieneDescuentos ? '6' : '4' }}" class="categoria-header">
                            {{ $categoria }}
                        </td>
                    </tr>
                    @foreach ($consumos as $consumo)
                        @php
                            $tieneDescuentoItem = $consumo->descuento > 0;
                        @endphp
                        <tr class="{{ $tieneDescuentoItem ? 'fila-con-descuento' : '' }}">
                            <td class="text-center">{{ number_format($consumo->cantidad, 2) }}</td>
                            <td>
                                {{ $consumo->inventario->nombre_producto }}
                                @if ($tieneDescuentoItem)
                                    <span class="descuento-badge">
                                        @if ($consumo->tipo_descuento === 'PORCENTAJE')
                                            -{{ number_format($consumo->porcentaje_descuento, 0) }}%
                                        @else
                                            DESCUENTO
                                        @endif
                                    </span>
                                @endif
                            </td>
                            <td class="text-right">${{ number_format($consumo->inventario->precio_unitario, 2) }}</td>
                            @if ($tieneDescuentos)
                                <td class="text-right">
                                    @if ($tieneDescuentoItem)
                                        <span class="precio-tachado">${{ number_format($consumo->subtotal, 2) }}</span>
                                    @else
                                        ${{ number_format($consumo->subtotal, 2) }}
                                    @endif
                                </td>
                                <td class="text-right precio-descuento">
                                    @if ($tieneDescuentoItem)
                                        -${{ number_format($consumo->descuento, 2) }}
                                    @else
                                        -
                                    @endif
                                </td>
                            @endif
                            <td class="text-right" style="font-weight: bold;">
                                ${{ number_format($consumo->subtotal - $consumo->descuento, 2) }}
                            </td>
                        </tr>
                    @endforeach
                @endforeach
            </tbody>
        </table>
    </div>

    {{-- MOTIVOS DE DESCUENTOS (Solo si hay descuentos) --}}
    @if ($tieneDescuentos && count($consumosConDescuento) > 0)
        <div class="motivos-descuento-section">
            <div style="font-size: 9pt; font-weight: bold; color: #f57c00; margin-bottom: 5px;">
                MOTIVOS DE DESCUENTOS APLICADOS
            </div>
            @foreach ($consumosConDescuento as $consumo)
                <div class="motivo-item">
                    <span class="motivo-producto">• {{ $consumo->inventario->nombre_producto }}:</span>
                    <span class="motivo-texto">
                        {{ $consumo->motivo_descuento ?? 'Sin motivo especificado' }}
                        @if ($consumo->usuarioRegistroDescuento)
                            <em>(Autorizado por: {{ $consumo->usuarioRegistroDescuento->nombres }}
                                {{ $consumo->usuarioRegistroDescuento->apellidos }})</em>
                        @endif
                    </span>
                </div>
            @endforeach
        </div>
    @endif

    {{-- TOTALES --}}
    <div class="totales-section">
        <div class="totales-box">
            @if ($factura->solicita_factura_detallada)
                <div class="totales-row">
                    <span class="totales-label">Subtotal sin IVA:</span>
                    <span class="totales-value">${{ number_format($factura->subtotal_sin_iva, 2) }}</span>
                </div>
                @if ($tieneDescuentos)
                    <div class="totales-row totales-row-descuento">
                        <span class="totales-label" style="color: #ff9800;">Total Descuentos:</span>
                        <span class="totales-value" style="color: #e74c3c; font-weight: bold;">
                            -${{ number_format($totalDescuentos, 2) }}
                        </span>
                    </div>
                @endif
                <div class="totales-row">
                    <span class="totales-label">IVA {{ $factura->consumos->first()?->tasa_iva ?? 15 }}%:</span>
                    <span class="totales-value">${{ number_format($factura->total_iva, 2) }}</span>
                </div>
            @endif

            <div class="totales-row total-final">
                <span class="totales-label">TOTAL A PAGAR:</span>
                <span class="totales-value">${{ number_format($factura->total_factura, 2) }}</span>
            </div>

            @if ($tieneDescuentos)
                <div class="ahorro-badge">
                    Ahorro total: ${{ number_format($totalDescuentos, 2) }}
                </div>
            @endif
        </div>
    </div>

    {{-- OBSERVACIONES --}}
    @if ($factura->observaciones)
        <div class="observaciones-section">
            <div class="observaciones-title">OBSERVACIONES:</div>
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
            Generado el {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}
        </div>
    </div>
@endsection
