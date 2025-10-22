@extends('pdf.layout.layout')
@section('title', 'Nota de Venta')
@section('report-title', 'Nota de Venta')

@section('summary')
    <strong>No. Nota de Venta:</strong> {{ $reserva['codigo_reserva'] }} <br>
    <strong>Cliente:</strong> {{ $reserva['huesped'] }} <br>
    <strong>Cédula:</strong> {{ $reserva['huesped_dni'] }} <br>
    <strong>Dirección:</strong> {{ $reserva['direccion'] }} <br>
    <strong>Check-in:</strong> {{ $reserva['fecha_checkin'] }} <br>
    <strong>Check-out:</strong> {{ $reserva['fecha_checkout'] }}
@endsection

@section('content')
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
            <tr class="totals-row">
                <td colspan="4" style="text-align: right;">TOTAL CONSUMOS:</td>
                <td>${{ number_format($totalConsumos, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 25px; font-size: 16px; text-align: center;">
        <em>Gracias por su preferencia. La <strong>factura</strong> será enviada al correo registrado.</em>
    </div>
@endsection
