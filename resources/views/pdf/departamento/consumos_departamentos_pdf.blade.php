<!DOCTYPE html>
<html>

<head>
    <title>Consumos por Departamento</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
        }

        .logo {
            height: 60px;
        }

        .hotel-name {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px;
            text-align: left;
        }

        th {
            background: #eee;
        }

        tfoot td {
            font-weight: bold;
            background: #f6f6f6;
        }

        h3 {
            margin-bottom: 5px;
            margin-top: 18px;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="{{ public_path('assets/images/logo_hotel.jpeg') }}" alt="Logo Hotel" class="logo">
        <div class="hotel-name">Mansion Real</div>
        <h2>Reporte de Consumos por Departamento</h2>
        @if ($fecha_inicio && $fecha_fin)
            <p>Rango de fechas: {{ $fecha_inicio }} a {{ $fecha_fin }}</p>
        @elseif($anio)
            <p>Año: {{ $anio }}</p>
        @else
            <p>Sin filtro de fechas.</p>
        @endif
    </div>

    @foreach ($departamentos as $numero => $productos)
        <h3>Departamento No. {{ $numero }}</h3>
        @php
            $total_importe = 0;
            $total_iva = 0;
        @endphp
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad Total Consumida</th>
                    <th>Subtotal</th>
                    <th>IVA Total</th>
                    <th>Importe Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($productos as $prod)
                    @php
                        $total_importe += $prod['importe'];
                        $total_iva += $prod['iva'];
                    @endphp
                    <tr>
                        <td>{{ $prod['producto'] }}</td>
                        <td>{{ $prod['cantidad'] }}</td>
                        <td>${{ number_format($prod['subtotal'], 2) }}</td>
                        <td>${{ number_format($prod['iva'], 2) }}</td>
                        <td>${{ number_format($prod['importe'], 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="text-align:right;">Total Importe:</td>
                    <td>${{ number_format($total_iva, 2) }}</td>
                    <td>${{ number_format($total_importe, 2) }}</td>
                </tr>
            </tfoot>
        </table>
    @endforeach
</body>

</html>
