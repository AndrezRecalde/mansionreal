import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    TitlePage,
    FacturasTable,
    FacturaDetalleModal,
    FacturaAnularModal,
    VisorFacturaPDF,
    FiltrarPorFechasCodigo,
    FacturaPeriodoIndicator,
    FacturasKPISection,
    FacturasMontosSection,
    FacturasDetalleSection,
} from "../../components";
import {
    useFacturaStore,
    useNotificaciones,
    useTitleHook,
    useUiFactura,
} from "../../hooks";
import Swal from "sweetalert2";

const FacturasPage = () => {
    useTitleHook("Gestión de Facturas - Mansión Real");
    useNotificaciones();

    const {
        cargando,
        estadisticas,
        pdfUrl,
        activarFactura,
        mensaje,
        errores,
        fnCargarFacturas,
        fnCargarEstadisticasFacturacion,
        fnLimpiarPdfUrl,
        fnDescargarFacturaPDF,
        fnLimpiarFacturas,
    } = useFacturaStore();

    const {
        abrirModalDetalleFactura,
        abrirModalAnularFactura,
        abrirModalPdfFactura,
        fnAbrirModalDetalleFactura,
        fnAbrirModalAnularFactura,
        fnAbrirModalPdfFactura,
    } = useUiFactura();

    const formatMonto = (valor) => {
        if (valor === null || valor === undefined) return "0.00";
        const numero = typeof valor === "string" ? parseFloat(valor) : valor;
        return isNaN(numero) ? "0.00" : numero.toFixed(2);
    };

    useEffect(() => {
        //const currentYear = new Date().getFullYear();
        //fnCargarFacturas({ p_anio: currentYear });
        //fnCargarEstadisticasFacturacion({ p_anio: currentYear });

        return () => {
            fnLimpiarFacturas();
        };
    }, []);

    const handleBuscarFacturas = (values) => {
        // Mapear campos de FiltrarPorFechasCodigo al formato que usa el backend de facturas
        const filtros = {
            p_codigo_reserva: values.codigo_reserva ?? null,
            p_fecha_inicio: values.fecha_inicio ?? null,
            p_fecha_fin: values.fecha_fin ?? null,
            p_anio: values.anio ?? null,
        };
        fnCargarFacturas(filtros);
        fnCargarEstadisticasFacturacion(filtros);
    };

    // Mensajes de error/éxito
    useEffect(() => {
        if (mensaje !== undefined) {
            Swal.fire({
                icon: mensaje.status,
                text: mensaje.msg,
                showConfirmButton: true,
            });
        }
    }, [mensaje]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                text: errores,
                showConfirmButton: true,
            });
        }
    }, [errores]);

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Gestión de Facturas</TitlePage>

            {/* Filtros */}
            <FiltrarPorFechasCodigo
                cargando={cargando}
                fnHandleAction={handleBuscarFacturas}
            />

            <Divider my={20} />

            {/* Indicador de Periodo */}
            <FacturaPeriodoIndicator
                periodo={estadisticas?.periodo}
                totalFacturas={estadisticas?.facturas?.total_general}
            />

            <Divider my={20} />

            {/* Tabla de Facturas */}
            <FacturasTable />

            {/* KPIs Principales */}
            <FacturasKPISection
                facturas={estadisticas?.facturas}
                clientes={estadisticas?.clientes}
            />

            {/* Montos */}
            <FacturasMontosSection
                formatMonto={formatMonto}
                montos={estadisticas?.montos}
            />

            {/* Detalle:  Clientes y Tickets */}
            <FacturasDetalleSection
                clientes={estadisticas?.clientes}
                formatMonto={formatMonto}
                montos={estadisticas?.montos}
            />

            {/* Modales */}
            <FacturaDetalleModal
                opened={abrirModalDetalleFactura}
                onClose={() => fnAbrirModalDetalleFactura(false)}
            />

            <FacturaAnularModal
                opened={abrirModalAnularFactura}
                onClose={() => fnAbrirModalAnularFactura(false)}
            />

            <VisorFacturaPDF
                opened={abrirModalPdfFactura}
                onClose={() => {
                    fnAbrirModalPdfFactura(false);
                    fnLimpiarPdfUrl();
                }}
                pdfUrl={pdfUrl}
                facturaNumero={activarFactura?.numero_factura}
                onDownload={() => {
                    if (activarFactura) {
                        fnDescargarFacturaPDF(activarFactura.id);
                    }
                }}
            />
        </Container>
    );
};

export default FacturasPage;
