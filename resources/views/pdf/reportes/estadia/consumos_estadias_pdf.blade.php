@extends('pdf.layout.layout')

@section('report-title', 'Reporte de Consumos por Estadías')

@section('date-filter')
    @if ($fecha_inicio && $fecha_fin)
        Rango de fechas: {{ $fecha_inicio }} al {{ $fecha_fin }}
    @elseif($anio)
        Año: {{ $anio }}
    @else
        Fecha: Todos los registros
    @endif
@endsection

@section('summary')
    @php
        $sumCantidad = 0;
        $sumSubtotal = 0;
        $sumIva = 0;
        $sumTotal = 0;
        foreach ($consumos as $c) {
            $sumCantidad += $c->total_consumido;
            $sumSubtotal += $c->subtotal_consumido;
            $sumIva += $c->total_iva;
            $sumTotal += $c->total_importe;
        }
    @endphp

    <p>
        Este reporte presenta un resumen de los consumos realizados por huéspedes durante sus estadías en el hotel.
    </p>
    <p>
        <strong>Total de productos consumidos:</strong> {{ $sumCantidad }} <br>
        <strong>Subtotal acumulado:</strong> ${{ number_format($sumSubtotal, 2) }} <br>
        <strong>IVA total:</strong> ${{ number_format($sumIva, 2) }} <br>
        <strong>Total general:</strong> ${{ number_format($sumTotal, 2) }}
    </p>
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
            @foreach ($consumos as $consumo)
                <tr>
                    <td>{{ $consumo->nombre_producto }}</td>
                    <td>{{ $consumo->total_consumido }}</td>
                    <td>${{ number_format($consumo->subtotal_consumido, 2) }}</td>
                    <td>${{ number_format($consumo->total_iva, 2) }}</td>
                    <td>${{ number_format($consumo->total_importe, 2) }}</td>
                </tr>
            @endforeach
            <tr>
                <td><strong>Total General</strong></td>
                <td>{{ $sumCantidad }}</td>
                <td>${{ number_format($sumSubtotal, 2) }}</td>
                <td>${{ number_format($sumIva, 2) }}</td>
                <td>${{ number_format($sumTotal, 2) }}</td>
            </tr>
        </tbody>
    </table>
@endsection
