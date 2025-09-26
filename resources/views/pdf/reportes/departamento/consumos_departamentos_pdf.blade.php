@extends('pdf.layout.layout')

@section('report-title', 'Reporte de Consumos por Departamento')

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
        $sumImporte = 0;
        foreach ($departamentos as $productos) {
            foreach ($productos as $prod) {
                $sumCantidad += $prod['cantidad'];
                $sumSubtotal += $prod['subtotal'];
                $sumIva += $prod['iva'];
                $sumImporte += $prod['importe'];
            }
        }
    @endphp

    <p>
        Este reporte detalla los consumos realizados en los diferentes departamentos del hotel <strong>Mansion
            Real</strong>.
    </p>
    <p>
        <strong>Total de productos consumidos:</strong> {{ $sumCantidad }} <br>
        <strong>Subtotal acumulado:</strong> ${{ number_format($sumSubtotal, 2) }} <br>
        <strong>IVA total:</strong> ${{ number_format($sumIva, 2) }} <br>
        <strong>Total general:</strong> ${{ number_format($sumImporte, 2) }}
    </p>
@endsection

@section('content')
    @foreach ($departamentos as $numero => $productos)
        <h3>Departamento N.º <mark style="background-color: skyblue;">{{ $numero }}</mark></h3>
        @php
            $total_importe = 0;
            $total_iva = 0;
            $total_subtotal = 0;
            $total_cantidad = 0;
        @endphp
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad Total</th>
                    <th>Subtotal</th>
                    <th>IVA</th>
                    <th>Importe Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($productos as $prod)
                    @php
                        $total_importe += $prod['importe'];
                        $total_iva += $prod['iva'];
                        $total_subtotal += $prod['subtotal'];
                        $total_cantidad += $prod['cantidad'];
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
                    <td><strong>Totales</strong></td>
                    <td>{{ $total_cantidad }}</td>
                    <td>${{ number_format($total_subtotal, 2) }}</td>
                    <td>${{ number_format($total_iva, 2) }}</td>
                    <td>${{ number_format($total_importe, 2) }}</td>
                </tr>
            </tfoot>
        </table>
    @endforeach
@endsection
