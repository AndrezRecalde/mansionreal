import {
    Alert,
    Box,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCheck } from "@tabler/icons-react";

export const ReservaConfirmacionStep = ({
    datos_reserva,
    generarFactura,
    datosFacturacion,
    onBack,
    onConfirm,
    cargando,
}) => {
    return (
        <Box mt="xl">
            <Stack gap="lg">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Confirmar Finalización"
                    color="blue"
                >
                    <Text size="sm">
                        Está a punto de finalizar la reserva. Esta acción no se
                        puede deshacer.
                    </Text>
                </Alert>

                {/* Resumen de la reserva */}
                <Paper p="md" withBorder>
                    <Text size="sm" fw={600} mb="md">
                        Resumen de la Reserva
                    </Text>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Código de Reserva:
                            </Text>
                            <Text size="sm" fw={600}>
                                {datos_reserva.codigo_reserva}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Huésped:
                            </Text>
                            <Text size="sm" fw={600}>
                                {datos_reserva.huesped?.nombres || "N/A"}
                            </Text>
                        </Group>
                        {datos_reserva.numero_departamento && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Departamento:
                                </Text>
                                <Text size="sm" fw={600}>
                                    {datos_reserva.numero_departamento}
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Paper>

                <Divider />

                {/* Resumen de facturación */}
                <Paper p="md" withBorder>
                    <Text size="sm" fw={600} mb="md">
                        Resumen de Facturación
                    </Text>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                ¿Se generará factura?
                            </Text>
                            <Text
                                size="sm"
                                fw={600}
                                c={generarFactura ? "teal" : "gray"}
                            >
                                {generarFactura
                                    ? "SÍ"
                                    : "NO (Consumidor Final)"}
                            </Text>
                        </Group>

                        {generarFactura && datosFacturacion && (
                            <>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Cliente:
                                    </Text>
                                    <Text size="sm" fw={600}>
                                        {datosFacturacion.cliente_nombre}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Factura detallada:
                                    </Text>
                                    <Text size="sm" fw={600}>
                                        {datosFacturacion.solicita_detallada
                                            ? "SÍ"
                                            : "NO"}
                                    </Text>
                                </Group>
                            </>
                        )}
                    </Stack>
                </Paper>

                {/* Botones de acción */}
                <Group justify="space-between" mt="xl">
                    <Button
                        variant="default"
                        onClick={onBack}
                        leftSection={<IconArrowLeft size={16} />}
                        disabled={cargando}
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={onConfirm}
                        loading={cargando}
                        color="teal"
                        size="md"
                        leftSection={<IconCheck size={16} />}
                    >
                        Finalizar Reserva y Generar Factura
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
};
