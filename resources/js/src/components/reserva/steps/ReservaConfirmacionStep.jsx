import {
    Alert,
    Box,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Badge,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { formatFechaHoraModal } from "../../../helpers/fnHelper";

export const ReservaConfirmacionStep = ({
    datos_reserva,
    generarFactura,
    datosFacturacion,
    onBack,
    onConfirm,
    cargando,
}) => {
    // ❌ REMOVIDO: Cálculo de descuentos

    return (
        <Box mt="xl">
            <Stack gap="lg">
                <Alert
                    color="blue"
                    title="Confirmación"
                    icon={<IconAlertCircle />}
                >
                    Revise la información antes de finalizar la reserva y
                    generar la factura.
                </Alert>

                {/* Información de la reserva */}
                <Paper p="md" withBorder>
                    <Text size="sm" fw={600} mb="md">
                        Información de la Reserva
                    </Text>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Código:
                            </Text>
                            <Text size="sm" fw={500}>
                                {datos_reserva.codigo_reserva}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Huésped:
                            </Text>
                            <Text size="sm" fw={500}>
                                {datos_reserva.huesped}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Departamento:
                            </Text>
                            <Text size="sm" fw={500}>
                                {datos_reserva.tipo_departamento}  {datos_reserva.numero_departamento}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Check-in:
                            </Text>
                            <Text size="sm" fw={500}>
                                {formatFechaHoraModal(
                                    datos_reserva.fecha_checkin,
                                )}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Check-out:
                            </Text>
                            <Text size="sm" fw={500}>
                                {formatFechaHoraModal(
                                    datos_reserva.fecha_checkout,
                                )}
                            </Text>
                        </Group>
                    </Stack>
                </Paper>

                <Divider />

                {/* Resumen de facturación (sin descuentos) */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Text size="sm" fw={600}>
                            Resumen de Facturación
                        </Text>
                        <Badge color={generarFactura ? "teal" : "gray"}>
                            {generarFactura
                                ? "Cliente Registrado"
                                : "Consumidor Final"}
                        </Badge>
                    </Group>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Cliente:
                            </Text>
                            <Text size="sm" fw={500}>
                                {datosFacturacion?.cliente_nombres_completos ||
                                    "CONSUMIDOR FINAL"}
                            </Text>
                        </Group>
                        {datosFacturacion?.cliente_identificacion && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Identificación:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {datosFacturacion.cliente_identificacion}
                                </Text>
                            </Group>
                        )}
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Factura detallada:
                            </Text>
                            <Badge
                                color={
                                    datosFacturacion?.solicita_detallada
                                        ? "green"
                                        : "gray"
                                }
                            >
                                {datosFacturacion?.solicita_detallada
                                    ? "Sí"
                                    : "No"}
                            </Badge>
                        </Group>
                        {datosFacturacion?.observaciones && (
                            <>
                                <Divider my="xs" />
                                <Text size="sm" c="dimmed">
                                    Observaciones:
                                </Text>
                                <Text size="sm">
                                    {datosFacturacion.observaciones}
                                </Text>
                            </>
                        )}
                    </Stack>
                </Paper>

                {/* ❌ REMOVIDO: Información de descuentos */}

                <Alert color="yellow" icon={<IconAlertCircle />}>
                    Al confirmar, la reserva cambiará a estado{" "}
                    <strong>PAGADO</strong> y se generará la factura
                    automáticamente.
                </Alert>

                {/* Botones de navegación */}
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
                        leftSection={<IconCheck size={16} />}
                        color="teal"
                    >
                        Finalizar y Generar Factura
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
};
