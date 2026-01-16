import { useEffect } from "react";
import {
    Container,
    Grid,
    Paper,
    Group,
    Text,
    Stack,
    Divider,
} from "@mantine/core";
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
    FiltrarPorFechasForm,
} from "../../components";
import {
    useFacturaStore,
    useNotificaciones,
    useUiFactura,
} from "../../hooks";
import Swal from "sweetalert2";

const FacturasPage = () => {
    useNotificaciones();

    const {
        facturas,
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

    useEffect(() => {
        // Inicializar con año actual
        const currentYear = new Date().getFullYear();

        // Cargar facturas del año actual por defecto
        fnCargarFacturas({ p_anio: currentYear });
        fnCargarEstadisticasFacturacion({ p_anio: currentYear });

        return () => {
            fnLimpiarFacturas();
        };
    }, []);

    const handleBuscarFacturas = (values) => {
        fnCargarFacturas(values);
        fnCargarEstadisticasFacturacion(values);
    }

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
            <Divider my={15} />
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={false}
                fnHandleAction={(values) => {
                    fnCargarFacturas(values);
                    fnCargarEstadisticasFacturacion(values);
                }}
            />

            <Divider my={15} />

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
