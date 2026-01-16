import { useEffect } from "react";
import { Container, Grid, Paper, Group, Text, Stack } from "@mantine/core";
import {
    IconFileText,
    IconFileOff,
    IconCurrencyDollar,
} from "@tabler/icons-react";
import {
    TitlePage,
    FacturasTable,
    FacturaDetalleModal,
    FacturaAnularModal,
    VisorFacturaPDF,
} from "../../components";
import { useFacturaStore, useNotificaciones, useUiFactura } from "../../hooks";

const FacturasPage = () => {
    useNotificaciones();
    const {
        facturas,
        estadisticas,
        pdfUrl,
        activarFactura,
        fnCargarFacturas,
        //fnCargarEstadisticasFacturacion,
        fnLimpiarPdfUrl,
        fnDescargarFacturaPDF,
    } = useFacturaStore();

    const {
        abrirModalDetalleFactura,
        abrirModalAnularFactura,
        abrirModalPdfFactura,
        fnAbrirModalDetalleFactura,
        fnAbrirModalAnularFactura,
        fnAbrirModalPdfFactura,
    } = useUiFactura();

    useEffect(() => {
        fnCargarFacturas();
        //fnCargarEstadisticasFacturacion();
    }, []);

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Gestión de Facturas</TitlePage>

            {/* KPIs */}
            <Grid mt={20} mb={20}>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Paper shadow="sm" p="md" withBorder>
                        <Group>
                            <IconFileText size={32} color="#3498db" />
                            <Stack gap={0}>
                                <Text size="xl" fw={700}>
                                    {estadisticas?.total_facturas || 0}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Total Facturas
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Paper shadow="sm" p="md" withBorder>
                        <Group>
                            <IconFileText size={32} color="#27ae60" />
                            <Stack gap={0}>
                                <Text size="xl" fw={700}>
                                    {estadisticas?.facturas_emitidas || 0}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Emitidas
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Paper shadow="sm" p="md" withBorder>
                        <Group>
                            <IconFileOff size={32} color="#e74c3c" />
                            <Stack gap={0}>
                                <Text size="xl" fw={700}>
                                    {estadisticas?.facturas_anuladas || 0}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Anuladas
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Paper shadow="sm" p="md" withBorder>
                        <Group>
                            <IconCurrencyDollar size={32} color="#f39c12" />
                            <Stack gap={0}>
                                <Text size="xl" fw={700}>
                                    $
                                    {estadisticas?.total_facturado?.toFixed(
                                        2
                                    ) || "0.00"}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Total Facturado
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>
                </Grid.Col>
            </Grid>

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
