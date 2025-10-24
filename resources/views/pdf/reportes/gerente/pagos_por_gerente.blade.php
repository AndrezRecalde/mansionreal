@extends('pdf.layout.layout')
@section('title', 'Reporte de Gerente')
@section('report-title', 'Reporte de Gerente')

@section('date-filter')
    @if ($data[0]['fecha_inicio'] && $data[0]['fecha_fin'])
        Rango de fechas: {{ $data[0]['fecha_inicio'] }} al {{ $data[0]['fecha_fin'] }}
    @elseif($data[0]['anio'])
        Año: {{ $data[0]['anio'] }}
    @else
        Fecha: Todos los registros
    @endif
@endsection

@section('summary')
    @foreach ($data as $gerente)
        <div class="gerente">
            <strong>Gerente:</strong> {{ $gerente['nombres'] }}<br>
            <strong>DNI:</strong> {{ $gerente['dni'] }}<br>
            <strong>Correo:</strong> {{ $gerente['email'] }}<br>
            <strong>Activo:</strong> {{ $gerente['activo'] ? 'Sí' : 'No' }}
        </div>
    @endsection
    @section('content')
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Código Reserva</th>
                    <th>Código Voucher</th>
                    <th>Concepto Pago</th>
                    <th>Método Pago</th>
                    <th>Monto</th>
                    <th>Fecha Pago</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($gerente['pagos'] as $i => $pago)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ $pago['reserva']['codigo_reserva'] }}</td>
                        <td>{{ $pago['codigo_voucher'] }}</td>
                        <td>{{ $pago['concepto_pago_id']['nombre_concepto'] }}</td>
                        <td>{{ $pago['metodo_pago'] }}</td>
                        <td>{{ number_format($pago['monto'], 2) }}</td>
                        <td>{{ \Carbon\Carbon::parse($pago['fecha_pago'])->format('d/m/Y') }}</td>
                        <td>{{ $pago['observaciones'] }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" style="text-align: center; color: #888;">No hay pagos registrados.</td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr class="totales">
                    <td colspan="5">Total Registros: {{ $gerente['total_registros'] }}</td>
                    <td colspan="3">Total Monto: {{ number_format($gerente['total_monto'], 2) }}</td>
                </tr>
            </tfoot>
        </table>
    @endforeach
@endsection
@section('footer')
    <div class="footer">
        Reporte generado el {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
    </div>
@endsection
