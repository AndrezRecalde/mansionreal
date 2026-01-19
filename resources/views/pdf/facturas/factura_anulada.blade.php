@extends('pdf.layout.factura_layout')

@section('content')
    {{-- MARCA DE AGUA --}}
    <div class="anulada-watermark">ANULADA</div>

    {{-- BANNER --}}
    <div class="anulada-banner">
        FACTURA ANULADA
    </div>

    <div class="content-wrapper">
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
                    <div class="factura-box" style="background-color: #e74c3c;">
                        <div class="factura-title">FACTURA ANULADA</div>
                        <div class="factura-numero">{{ $factura->numero_factura }}</div>
                        <div class="factura-fecha">
                            Emisión: {{ \Carbon\Carbon::parse($factura->fecha_emision)->format('d/m/Y') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- INFORMACIÓN DE ANULACIÓN --}}
        <div class="cliente-section" style="background-color: #ffe6e6; border-left-color: #e74c3c;">
            <div class="section-title" style="color: #e74c3c;">Información de Anulación</div>
            <div class="cliente-data">
                <div class="cliente-row">
                    <span class="cliente-label">Fecha Anulación:</span>
                    <span
                        class="cliente-value">{{ \Carbon\Carbon::parse($factura->fecha_anulacion)->format('d/m/Y H:i') }}</span>
                </div>
                <div class="cliente-row">
                    <span class="cliente-label">Motivo: </span>
                    <span class="cliente-value">{{ $factura->motivo_anulacion }}</span>
                </div>
                @if ($factura->usuarioAnulo)
                    <div class="cliente-row">
                        <span class="cliente-label">Anulado por:</span>
                        <span class="cliente-value">{{ $factura->usuarioAnulo->nombres }}
                            {{ $factura->usuarioAnulo->apellidos }}</span>
                    </div>
                @endif
            </div>
        </div>

        {{-- DATOS DEL CLIENTE --}}
        <div class="cliente-section">
            <div class="section-title">Datos del Cliente (Original)</div>
            <div class="cliente-data">
                <div class="cliente-row">
                    <span class="cliente-label">Nombre:</span>
                    <span class="cliente-value">{{ $factura->cliente_nombres_completos }}</span>
                </div>
                <div class="cliente-row">
                    <span class="cliente-label">{{ $factura->cliente_tipo_identificacion }}:</span>
                    <span class="cliente-value">{{ $factura->cliente_identificacion }}</span>
                </div>
            </div>
        </div>

        {{-- TOTALES (Resumen) --}}
        <div class="totales-section">
            <div class="totales-box">
                <div class="totales-row">
                    <span class="totales-label">Subtotal sin IVA:</span>
                    <span class="totales-value">${{ number_format($factura->subtotal_sin_iva, 2) }}</span>
                </div>
                <div class="totales-row">
                    <span class="totales-label">Subtotal con IVA:</span>
                    <span class="totales-value">${{ number_format($factura->subtotal_con_iva, 2) }}</span>
                </div>
                <div class="totales-row">
                    <span class="totales-label">IVA: </span>
                    <span class="totales-value">${{ number_format($factura->total_iva, 2) }}</span>
                </div>
                <div class="totales-row total-final" style="background-color: #e74c3c;">
                    <span class="totales-label">TOTAL (ANULADO):</span>
                    <span class="totales-value">${{ number_format($factura->total_factura, 2) }}</span>
                </div>
            </div>
        </div>

        {{-- FOOTER --}}
        <div class="footer">
            <div class="footer-text" style="color: #e74c3c; font-weight: bold;">
                DOCUMENTO ANULADO - SIN VALIDEZ FISCAL
            </div>
            <div class="footer-text" style="margin-top: 5px;">
                Generado el {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}
            </div>
        </div>
    </div>
@endsection
