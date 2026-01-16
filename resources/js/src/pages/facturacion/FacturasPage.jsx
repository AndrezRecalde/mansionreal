import { useEffect } from "react";
import { Container, Paper, Divider } from "@mantine/core";
import {
    TitlePage,
    FacturasTable,
    FacturaDetalleModal,
    FacturaAnularModal,
    VisorFacturaPDF,
    FiltrarPorFechasForm,
    FacturaPeriodoIndicator,
    FacturasKPISection,
    FacturasMontosSection,
    FacturasDetalleSection,
} from "../../components";
import { useFacturaStore, useNotificaciones, useUiFactura } from "../../hooks";
import Swal from "sweetalert2";

const FacturasPage = () => {
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
        const currentYear = new Date().getFullYear();
        fnCargarFacturas({ p_anio: currentYear });
        fnCargarEstadisticasFacturacion({ p_anio: currentYear });

        return () => {
            fnLimpiarFacturas();
        };
    }, []);

    const handleBuscarFacturas = (values) => {
        fnCargarFacturas(values);
        fnCargarEstadisticasFacturacion(values);
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
            <Paper shadow="sm" p="md" withBorder mt={20}>
                <FiltrarPorFechasForm
                    titulo="Filtrar por fechas"
                    cargando={cargando}
                    fnHandleAction={handleBuscarFacturas}
                />
            </Paper>

            <Divider my={20} />

            {/* Indicador de Periodo */}
            <FacturaPeriodoIndicator
                periodo={estadisticas?.periodo}
                totalFacturas={estadisticas?.facturas?.total_general}
            />

            <Divider my={20} />

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

            {/* Tabla de Facturas */}
            <FacturasTable />

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
