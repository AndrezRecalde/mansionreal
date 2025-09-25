<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Nota de Venta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: left;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
            width: 140px;
            margin-bottom: 10px;
        }

        .datos {
            margin-bottom: 15px;
        }

        .totales {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="{{ $logo }}" class="logo">
        <h2>HOTEL MANSIÓN REAL</h2>
        <div>RUC: {{ $ruc }}</div>
        <div>Dirección: {{ $direccion }}</div>
    </div>

    <div class="datos">
        <div><strong>No. Nota de Venta:</strong> {{ $reserva['codigo_reserva'] }}</div>
        <div><strong>Cliente:</strong> {{ $reserva['huesped'] }}</div>
        <div><strong>DNI:</strong> {{ $reserva['huesped_dni'] }}</div>
        <div><strong>Check-in:</strong> {{ $reserva['fecha_checkin'] }}</div>
        <div><strong>Check-out:</strong> {{ $reserva['fecha_checkout'] }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @php $totalConsumos = 0; @endphp
            @foreach ($reserva['consumos'] ?? [] as $consumo)
                <tr>
                    <td>{{ $consumo['producto'] }}</td>
                    <td>{{ $consumo['cantidad'] }}</td>
                    <td>${{ number_format($consumo['subtotal'], 2) }}</td>
                    <td>${{ number_format($consumo['iva'], 2) }}</td>
                    <td>${{ number_format($consumo['total'], 2) }}</td>
                </tr>
                @php $totalConsumos += $consumo['total']; @endphp
            @endforeach
            <tr class="totales">
                <td colspan="4" style="text-align: right;">TOTAL CONSUMOS:</td>
                <td>${{ number_format($totalConsumos, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 20px;">
        <em>Gracias por su preferencia. La <strong>factura</strong> se enviará al correo registrado</em>
    </div>
</body>

</html>
