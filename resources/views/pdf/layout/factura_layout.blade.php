<!DOCTYPE html>
    <html lang="es">

    <head>
        <meta charset="UTF-8">
        <title>Factura {{ $factura->numero_factura ?? '' }}</title>
        <style>
            @page {
                size: A4 portrait;
            }

            * {
                font-family: "Helvetica", Helvetica, Arial, sans-serif;
                box-sizing: border-box;
            }

            body {
                font-size: 9pt;
                color: #333;
                line-height: 1.3;
                padding: 0;
            }

            /* HEADER */
            .header {
                width: 100%;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #2c3e50;
            }

            .header-content {
                width: 100%;
            }

            .header-left {
                width: 58%;
                float: left;
            }

            .header-right {
                width: 38%;
                float: right;
                text-align: right;
            }

            .logo {
                font-size: 16pt;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 5px;
            }

            .company-info {
                font-size: 8pt;
                color: #666;
                line-height: 1.4;
            }

            .factura-box {
                background-color: #2c3e50;
                color: white;
                padding: 10px;
                border-radius: 3px;
            }

            .factura-title {
                font-size: 11pt;
                font-weight: bold;
                margin-bottom: 3px;
            }

            .factura-numero {
                font-size: 12pt;
                font-weight: bold;
                letter-spacing: 0.5px;
            }

            .factura-fecha {
                font-size: 7pt;
                margin-top: 3px;
            }

            /* CLEAR FLOATS */
            .clearfix::after {
                content: "";
                display: table;
                clear: both;
            }

            /* CLIENTE SECTION */
            .cliente-section {
                margin: 12px 0;
                background-color: #f8f9fa;
                padding: 10px;
                border-left: 3px solid #3498db;
                clear: both;
            }

            .section-title {
                font-size: 10pt;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 8px;
                text-transform: uppercase;
            }

            .cliente-data {
                width: 100%;
            }

            .cliente-row {
                margin-bottom: 3px;
            }

            .cliente-label {
                display: inline-block;
                width: 28%;
                font-weight: bold;
                color: #555;
                font-size: 8pt;
            }

            .cliente-value {
                display: inline-block;
                width: 70%;
                color: #333;
                font-size: 8pt;
            }

            /* TABLAS */
            .detalles-section {
                margin: 12px 0;
                clear: both;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8px;
            }

            thead {
                background-color: #2c3e50;
                color: white;
            }

            th {
                padding: 6px 5px;
                text-align: left;
                font-size: 8pt;
                font-weight: bold;
            }

            tbody tr {
                border-bottom: 1px solid #e0e0e0;
            }

            td {
                padding: 5px;
                font-size: 8pt;
            }

            .text-center {
                text-align: center;
            }

            .text-right {
                text-align: right;
            }

            .categoria-header {
                background-color: #ecf0f1;
                font-weight: bold;
                padding: 6px 5px;
                color: #2c3e50;
                font-size: 9pt;
            }

            /* TOTALES */
            .totales-section {
                width: 45%;
                float: right;
                margin-top: 15px;
            }

            .totales-box {
                border: 2px solid #2c3e50;
                border-radius: 5px;
                overflow: hidden;
            }

            .totales-row {
                padding: 6px 10px;
                border-bottom: 1px solid #dee2e6;
            }

            .totales-row:last-child {
                border-bottom: none;
            }

            .totales-label {
                display: inline-block;
                width: 55%;
                font-weight: bold;
                color: #555;
                font-size: 8pt;
                text-align: right;
            }

            .totales-value {
                display: inline-block;
                width: 42%;
                text-align: right;
                font-size: 9pt;
                font-weight: bold;
            }

            .total-final {
                background-color: #2c3e50;
                color: white;
                padding: 10px;
            }

            .total-final .totales-label,
            .total-final .totales-value {
                color: white;
                font-size: 10pt;
            }

            /* OBSERVACIONES */
            .observaciones-section {
                clear: both;
                margin: 12px 0;
                padding: 10px;
                background-color: #fff3cd;
                border-left: 3px solid #ffc107;
            }

            .observaciones-title {
                font-weight: bold;
                color: #856404;
                margin-bottom: 5px;
                font-size: 9pt;
            }

            .observaciones-text {
                font-size: 8pt;
                color: #856404;
            }

            /* FOOTER */
            .footer {
                clear: both;
                margin-top: 25px;
                padding-top: 10px;
                border-top: 1px solid #dee2e6;
                text-align: center;
                font-size: 7pt;
                color: #777;
            }

            .footer-text {
                margin-bottom: 3px;
            }

            /* FACTURA ANULADA */
            .anulada-watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 100pt;
                font-weight: bold;
                color: rgba(231, 76, 60, 0.1);
                z-index: -1;
            }

            .anulada-banner {
                background-color: #e74c3c;
                color: white;
                padding: 12px;
                text-align: center;
                font-size: 12pt;
                font-weight: bold;
                margin-bottom: 15px;
                border-radius: 3px;
            }

            .content-wrapper {
                opacity: 0.6;
            }

            /* DESGLOSE TRIBUTARIO */
            .tributario-section {
                clear: both;
                margin: 12px 0;
                padding: 10px;
                background-color: #e8f4f8;
                border-left: 3px solid #3498db;
            }

            /* BADGE DETALLADA */
            .badge-detallada {
                background-color: #3498db;
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 7pt;
                text-align: center;
                margin-top: 4px;
                display: inline-block;
            }
        </style>
        @yield('extra-styles')
    </head>

    <body>
        @yield('content')
    </body>

    </html>
