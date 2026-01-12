<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura {{ $factura->numero_factura }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            color: #333;
            line-height: 1.4;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        /* HEADER */
        .header {
            display: table;
            width: 100%;
            margin-bottom: 20px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
        }

        . header-left {
            display: table-cell;
            width: 60%;
            vertical-align: top;
        }

        .header-right {
            display: table-cell;
            width: 40%;
            vertical-align: top;
            text-align: right;
        }

        .logo {
            font-size: 24pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        . company-info {
            font-size: 9pt;
            color: #666;
            line-height: 1.6;
        }

        .factura-box {
            background-color: #2c3e50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }

        .factura-title {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .factura-numero {
            font-size: 14pt;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .factura-fecha {
            font-size: 9pt;
            margin-top: 5px;
        }

        /* CLIENTE INFO */
        .cliente-section {
            margin: 20px 0;
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #3498db;
        }

        . section-title {
            font-size: 11pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .cliente-data {
            display: table;
            width: 100%;
        }

        .cliente-row {
            display: table-row;
        }

        .cliente-label {
            display: table-cell;
            width: 25%;
            font-weight: bold;
            padding: 3px 0;
            color: #555;
        }

        .cliente-value {
            display: table-cell;
            padding: 3px 0;
            color: #333;
        }

        /* DETALLES DE FACTURA */
        .detalles-section {
            margin: 20px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        thead {
            background-color: #2c3e50;
            color: white;
        }

        th {
            padding: 10px;
            text-align: left;
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
        }

        th. text-center {
            text-align: center;
        }

        th.text-right {
            text-align: right;
        }

        tbody tr {
            border-bottom: 1px solid #e0e0e0;
        }

        tbody tr:hover {
            background-color: #f8f9fa;
        }

        td {
            padding: 8px 10px;
            font-size: 9pt;
        }

        td.text-center {
            text-align: center;
        }

        td.text-right {
            text-align: right;
        }

        /* TOTALES */
        .totales-section {
            margin-top: 30px;
            display: table;
            width: 100%;
        }

        .totales-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .totales-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .totales-box {
            background-color: #f8f9fa;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
        }

        .total-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }

        . total-label {
            display: table-cell;
            width: 70%;
            font-size: 10pt;
            color: #555;
        }

        .total-value {
            display: table-cell;
            width: 30%;
            text-align: right;
            font-size: 10pt;
            font-weight: bold;
        }

        . total-final {
            border-top: 2px solid #2c3e50;
            padding-top: 10px;
            margin-top: 10px;
        }

        . total-final . total-label {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
        }

        .total-final .total-value {
            font-size: 14pt;
            color: #27ae60;
        }

        /* OBSERVACIONES */
        .observaciones-section {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff9e6;
            border-left: 4px solid #f39c12;
        }

        /* FOOTER */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            font-size: 8pt;
            color: #999;
            text-align: center;
        }

        /* MARCA DE AGUA ANULADA */
        .anulada-watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120pt;
            font-weight: bold;
            color: rgba(231, 76, 60, 0.15);
            z-index: -1;
            pointer-events: none;
        }

        . anulada-banner {
            background-color: #e74c3c;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 20px;
            border-radius: 5px;
        }

        /* UTILIDADES */
        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .font-bold {
            font-weight: bold;
        }

        .categoria-header {
            background-color: #ecf0f1;
            font-weight: bold;
            padding: 8px 10px ! important;
            color: #2c3e50;
        }

        /* PAGE BREAK */
        .page-break {
            page-break-after: always;
        }
    </style>

    @yield('extra-styles')
</head>

<body>
    @yield('content')
</body>

</html>
