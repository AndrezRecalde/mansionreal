<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reporte KPIs y Departamentos - {{ $hotel_nombre }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #222;
        }

        .logo {
            width: 140px;
            margin-bottom: 10px;
        }

        .header {
            text-align: center;
            margin-bottom: 18px;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-top: 14px;
            margin-bottom: 8px;
        }

        .section-paragraph {
            font-size: 11px;
            color: #444;
            margin-bottom: 10px;
            margin-top: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            table-layout: fixed;
        }

        th,
        td {
            border: 1px solid #bbb;
            padding: 4px 2px;
            text-align: center;
            font-size: 10px;
        }

        th {
            background-color: #f5f5f5;
        }

        .kpi-table td,
        .kpi-table th {
            font-size: 11px;
        }

        .img-small {
            max-width: 22px;
            max-height: 22px;
        }

        .wrap {
            word-break: break-word;
            max-width: 70px;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="{{ $logo }}" class="logo" alt="Logo Mansion Real">
        <h2>{{ $hotel_nombre }}</h2>
        <p>
            <strong>Reporte KPIs y Detalles de Departamentos</strong><br>
            @if ($fecha_inicio && $fecha_fin)
                <span>Desde: {{ $fecha_inicio }} &nbsp; Hasta: {{ $fecha_fin }}</span>
            @elseif($anio)
                <span>Año: {{ $anio }}</span>
            @endif
        </p>
        <hr>
    </div>

    <div>
        <span class="section-title">Resumen KPIs</span>
        <p class="section-paragraph">
            El siguiente cuadro muestra los principales indicadores de gestión del hotel en el periodo seleccionado,
            incluyendo el porcentaje de ocupación, los ingresos totales generados, la recaudación de IVA, el monto total
            de gastos registrados y el número total de huéspedes atendidos. Estos valores permiten visualizar el
            desempeño general y la eficiencia operativa alcanzada en el periodo.
        </p>
        <table class="kpi-table">
            <tr>
                <th>Porcentaje Ocupación</th>
                <th>Ingresos Totales</th>
                <th>Recaudación IVA</th>
                <th>Total Gastos</th>
                <th>Total Huéspedes</th>
            </tr>
            @if ($kpi)
                <tr>
                    <td>{{ number_format($kpi->porcentaje_ocupacion, 2) }}%</td>
                    <td>${{ number_format($kpi->ingresos_totales, 2) }}</td>
                    <td>${{ number_format($kpi->recaudacion_iva, 2) }}</td>
                    <td>${{ number_format($kpi->total_gastos, 2) }}</td>
                    <td>{{ $kpi->total_huespedes }}</td>
                </tr>
            @else
                <tr>
                    <td colspan="5">No hay datos para el periodo seleccionado.</td>
                </tr>
            @endif
        </table>
    </div>

    <div>
        <span class="section-title">Detalle por Departamento</span>
        <p class="section-paragraph">
            A continuación se presenta el desglose individual de cada departamento, mostrando su tipo, capacidad, precio
            unitario, cantidad de reservas realizadas, montos relacionados a consumos y recaudación de IVA, así como el
            número de huéspedes únicos atendidos y una imagen referencial. Esta información permite analizar el
            comportamiento y rendimiento específico de cada departamento dentro del hotel.
        </p>
        <table>
            <thead>
                <tr>
                    <th style="width: 70px;">Depto.</th>
                    <th style="width: 60px;">Tipo</th>
                    <th style="width: 30px;">Cap.</th>
                    <th style="width: 45px;">Precio</th>
                    <th style="width: 38px;">Reservas</th>
                    <th style="width: 55px;">Subtotal</th>
                    <th style="width: 55px;">IVA</th>
                    <th style="width: 55px;">Total</th>
                    <th style="width: 38px;">Huésp.</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($departamentos as $dpto)
                    <tr>
                        <td class="wrap">{{ $dpto->nombre_departamento }}</td>
                        <td class="wrap">{{ $dpto->tipo_departamento }}</td>
                        <td>{{ $dpto->capacidad }}</td>
                        <td>${{ number_format($dpto->precio_unitario, 2) }}</td>
                        <td>{{ $dpto->total_reservas }}</td>
                        <td>${{ number_format($dpto->subtotal_consumos, 2) }}</td>
                        <td>${{ number_format($dpto->iva_recaudado, 2) }}</td>
                        <td>${{ number_format($dpto->total_consumos, 2) }}</td>
                        <td>{{ $dpto->total_huespedes }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>

</html>
