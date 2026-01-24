<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            color: #333;
            line-height: 1.4;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2c3e50;
        }

        .header h1 {
            font-size: 16px;
            color: #2c3e50;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .header . subtitle {
            font-size: 11px;
            color: #7f8c8d;
            margin-bottom: 8px;
        }

        . metadata {
            background-color: #ecf0f1;
            padding: 8px;
            margin-bottom: 15px;
            border-radius: 2px;
        }

        .metadata table {
            width: 100%;
        }

        .metadata td {
            padding: 3px 8px;
            font-size: 9px;
        }

        .metadata strong {
            color: #2c3e50;
        }

        .categoria-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .categoria-header {
            background-color: #3498db;
            color: white;
            padding: 8px 10px;
            margin-bottom: 8px;
            border-radius: 2px;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        table thead {
            background-color: #34495e;
            color: white;
        }

        table thead th {
            padding: 6px 5px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            border: 1px solid #2c3e50;
        }

        table tbody td {
            padding: 5px;
            border: 1px solid #bdc3c7;
            font-size: 9px;
        }

        table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        table tbody tr:hover {
            background-color: #e8f4f8;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .totales-categoria {
            background-color: #d5e8f7;
            font-weight: bold;
            color: #2c3e50;
        }

        .totales-generales {
            margin-top: 20px;
            page-break-inside: avoid;
        }

        .totales-generales-header {
            background-color: #27ae60;
            color: white;
            padding: 8px 10px;
            margin-bottom: 8px;
            border-radius: 2px;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
        }

        .totales-generales table {
            background-color: #e8f8f5;
        }

        .totales-generales tbody td {
            padding: 8px;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #27ae60;
        }

        .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #bdc3c7;
            text-align: center;
            font-size: 8px;
            color: #7f8c8d;
        }

        . page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    <!-- Encabezado -->
    <div class="header">
        <h1>{{ $title }}</h1>
        <div class="subtitle">Estado de Reservas: PAGADO</div>
    </div>

    <!-- Metadatos del Reporte -->
    <div class="metadata">
        <table>
            <tr>
                <td><strong>Fecha Inicio:</strong>
                    {{ \Carbon\Carbon::parse($metadatos['p_fecha_inicio'])->format('d/m/Y') }}</td>
                <td><strong>Fecha Fin:</strong> {{ \Carbon\Carbon::parse($metadatos['p_fecha_fin'])->format('d/m/Y') }}
                </td>
            </tr>
            <tr>
                <td><strong>Fecha de Generación:</strong>
                    {{ \Carbon\Carbon::parse($metadatos['fecha_generacion'])->format('d/m/Y H:i:s') }}</td>
                <td><strong>Total Categorías:</strong> {{ $metadatos['total_categorias'] }} | <strong>Total Productos:
                    </strong> {{ $metadatos['total_productos'] }}</td>
            </tr>
        </table>
    </div>

    <!-- Detalle por Categorías -->
    @foreach ($categorias as $index => $categoria)
        <div class="categoria-section">
            <div class="categoria-header">
                {{ $categoria['nombre_categoria'] }}
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">ID</th>
                        <th style="width: 35%;">Producto</th>
                        <th style="width: 10%;" class="text-center">Cantidad</th>
                        <th style="width: 12%;" class="text-right">P. Unitario</th>
                        <th style="width: 12%;" class="text-right">Subtotal</th>
                        <th style="width: 10%;" class="text-right">Descuento</th>
                        <th style="width:  12%;" class="text-right">IVA</th>
                        <th style="width: 14%;" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($categoria['productos'] as $producto)
                        <tr>
                            <td class="text-center">{{ $producto['producto_id'] }}</td>
                            <td>{{ $producto['nombre_producto'] }}</td>
                            <td class="text-center">{{ $producto['cantidad_total'] }}</td>
                            <td class="text-right">${{ number_format($producto['precio_unitario'], 2) }}</td>
                            <td class="text-right">${{ number_format($producto['subtotal'], 2) }}</td>
                            <td class="text-right">
                                @if ($producto['descuento'] > 0)
                                    <span style="color: red;">-${{ number_format($producto['descuento'], 2) }}</span>
                                @else
                                    $0.00
                                @endif
                            </td>
                            <td class="text-right">${{ number_format($producto['iva'], 2) }}</td>
                            <td class="text-right">${{ number_format($producto['total'], 2) }}</td>
                        </tr>
                    @endforeach

                    <!-- Totales por Categoría -->
                    <tr class="totales-categoria">
                        <td colspan="2" class="text-right">TOTAL {{ strtoupper($categoria['nombre_categoria']) }}:
                        </td>
                        <td class="text-center">{{ $categoria['totales_categoria']['cantidad_total'] }}</td>
                        <td></td>
                        <td class="text-right">${{ number_format($categoria['totales_categoria']['subtotal'], 2) }}
                        </td>
                        <td class="text-right">
                            @if ($categoria['totales_categoria']['descuento'] > 0)
                                <span
                                    style="color: red;">-${{ number_format($categoria['totales_categoria']['descuento'], 2) }}</span>
                            @else
                                $0.00
                            @endif
                        </td>
                        <td class="text-right">${{ number_format($categoria['totales_categoria']['iva'], 2) }}</td>
                        <td class="text-right">${{ number_format($categoria['totales_categoria']['total'], 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {{-- Salto de página cada 2 categorías para mejor visualización --}}
        @if (($index + 1) % 2 == 0 && $index + 1 < count($categorias))
            <div class="page-break"></div>
        @endif
    @endforeach

    <!-- Totales Generales -->
    <div class="totales-generales">
        <div class="totales-generales-header">
            Totales Generales del Reporte
        </div>
        <table>
            <tbody>
                <tr>
                    <td style="width: 50%;">CANTIDAD TOTAL DE PRODUCTOS CONSUMIDOS: </td>
                    <td style="width: 50%;" class="text-right">{{ $totales_generales['cantidad_total_general'] }}
                        unidades</td>
                </tr>
                <tr>
                    <td>SUBTOTAL GENERAL:</td>
                    <td class="text-right">${{ number_format($totales_generales['subtotal_general'], 2) }}</td>
                </tr>
                <tr>
                    <td>DESCUENTO GENERAL:</td>
                    <td class="text-right">
                        @if ($totales_generales['descuento_general'] > 0)
                            <span
                                style="color: red;">-${{ number_format($totales_generales['descuento_general'], 2) }}</span>
                        @else
                            $0.00
                        @endif
                    </td>
                </tr>
                <tr>
                    <td>IVA GENERAL:</td>
                    <td class="text-right">${{ number_format($totales_generales['iva_general'], 2) }}</td>
                </tr>
                <tr style="background-color: #27ae60; color: white; font-size: 11px;">
                    <td>TOTAL GENERAL: </td>
                    <td class="text-right">${{ number_format($totales_generales['total_general'], 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Reporte generado automáticamente por el Sistema de Gestión - {{ now()->format('d/m/Y H:i: s') }}</p>
    </div>
</body>

</html>
