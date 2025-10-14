<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>@yield('title') - Mansion Real</title>
    <style>
        @page {
            size: 21cm 29.7cm;
            margin: 30px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
        }

        .header img {
            max-height: 90px;
            margin-bottom: 10px;
        }

        .hotel-name {
            font-size: 20px;
            font-weight: bold;
            color: #222;
            margin-bottom: 5px;
        }

        .report-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .sub-title {
            font-size: 13px;
            color: #555;
        }

        .summary {
            margin: 20px 0;
            padding: 12px;
            border: 1px solid #ccc;
            background-color: #fafafa;
            font-size: 13px;
        }

        .summary strong {
            color: #000;
        }

        h3 {
            margin-top: 20px;
            margin-bottom: 8px;
            font-size: 15px;
            color: #444;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }

        th,
        td {
            border: 1px solid #777;
            padding: 6px 8px;
            text-align: center;
        }

        th {
            background: #eaeaea;
            font-weight: bold;
            font-size: 13px;
        }

        tfoot td {
            font-weight: bold;
            background: #f6f6f6;
        }

        .footer {
            position: fixed;
            bottom: 15px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 5px;
        }
    </style>
</head>

<body>
    {{-- Cabecera --}}
    <div class="header">
        <img src="{{ public_path('assets/images/logo_hotel.jpeg') }}" alt="Logo Mansion Real">
        <div class="hotel-name">Mansion Real</div>
        <div class="report-title">@yield('report-title')</div>
        <div class="sub-title">
            @yield('date-filter')
        </div>
    </div>

    {{-- Resumen --}}
    <div class="summary">
        @yield('summary')
    </div>

    {{-- Contenido principal (tablas) --}}
    @yield('content')

    {{-- Pie de página --}}
    <div class="footer">
        <strong>Mansion Real</strong> – Atacames, Vía a Sua alado del Hotel Marimba <br>
        Reporte generado el {{ now()->format('d/m/Y H:i') }}
    </div>
</body>

</html>
