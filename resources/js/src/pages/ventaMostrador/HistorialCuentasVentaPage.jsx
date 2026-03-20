import { useEffect, useState } from "react";
import { Container, Stack } from "@mantine/core";
import {
    PrincipalSectionPage,
    FiltrarPorFechasForm,
    VisorFacturaPDF,
} from "../../components";
import { HistorialCuentasTable } from "../../components/ventaMostrador/table/HistorialCuentasTable";
import { useHistorialCuentasVenta, useFacturaStore } from "../../hooks";
import { IconHistory } from "@tabler/icons-react";

const HistorialCuentasVentaPage = () => {
    const {
        cargando,
        historialCuentas,
        fnCargarHistorialCuentas,
        fnLimpiarHistorialCuentas,
    } = useHistorialCuentasVenta();

    const {
        pdfUrl,
        fnPrevisualizarFacturaPDF,
        fnLimpiarPdfUrl,
        fnDescargarFacturaPDF,
    } = useFacturaStore();

    const [abrirModalPdf, setAbrirModalPdf] = useState(false);
    const [facturaActiva, setFacturaActiva] = useState(null);

    // Carga inicial (año actual por defecto en el back)
    useEffect(() => {
        //fnCargarHistorialCuentas({});

        return () => {
            fnLimpiarHistorialCuentas();
        };
    }, []);

    const handleBuscar = (filtros) => {
        fnCargarHistorialCuentas(filtros);
    };

    const handleVerFactura = async (factura) => {
        setFacturaActiva(factura);
        setAbrirModalPdf(true);
        await fnPrevisualizarFacturaPDF(factura.id);
    };

    return (
        <Container size="xl" my={20}>
            <PrincipalSectionPage
                title="Historial de Cuentas de Venta"
                description="Aquí puedes ver el historial de cuentas de ventas externas."
                icon={<IconHistory size={24} />}
            />

            <Stack gap="lg" mt="md">
                <FiltrarPorFechasForm
                    titulo="Filtros de Búsqueda"
                    cargando={cargando}
                    fnHandleAction={handleBuscar}
                />

                <HistorialCuentasTable
                    datos={historialCuentas}
                    cargando={cargando}
                    onVerFactura={handleVerFactura}
                />
            </Stack>

            <VisorFacturaPDF
                opened={abrirModalPdf}
                onClose={() => {
                    setAbrirModalPdf(false);
                    setFacturaActiva(null);
                    fnLimpiarPdfUrl();
                }}
                pdfUrl={pdfUrl}
                facturaNumero={facturaActiva?.numero_factura}
                onDownload={() => {
                    if (facturaActiva) {
                        fnDescargarFacturaPDF(facturaActiva.id);
                    }
                }}
            />
        </Container>
    );
};

export default HistorialCuentasVentaPage;
