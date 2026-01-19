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
    return (
        <Box mt="xl">
            <Stack gap="lg">
                {/* Alerta de confirmación */}
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Confirmar Finalización"
                >
                    <Text size="sm">
                        Está a punto de{" "}
                        <strong>
                            finalizar la reserva y generar la factura
                        </strong>
                        .
                    </Text>
                    <Text size="sm" mt="xs">
                        Esta acción no se puede deshacer. Verifique que toda la
                        información sea correcta.
                    </Text>
                </Alert>

                {/* Resumen de la reserva */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Text size="sm" fw={600}>
                            Resumen de la Reserva
                        </Text>
                        <Badge variant="light">
                            {datos_reserva.codigo_reserva}
                        </Badge>
                    </Group>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Huésped:
                            </Text>
                            <Text size="sm" fw={500}>
                                {datos_reserva.huesped || "N/A"}
                            </Text>
                        </Group>
                        {datos_reserva.numero_departamento && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Departamento:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {datos_reserva.tipo_departamento +
                                        " — " +
                                        datos_reserva.numero_departamento}
                                </Text>
                            </Group>
                        )}
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

                {/* Resumen de facturación */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Text size="sm" fw={600}>
                            Resumen de Facturación
                        </Text>
                        <Badge
                            color={generarFactura ? "teal" : "gray"}
                            variant="light"
                        >
                            {generarFactura
                                ? "Cliente Registrado"
                                : "Consumidor Final"}
                        </Badge>
                    </Group>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Tipo de Factura:
                            </Text>
                            <Text size="sm" fw={500}>
                                {generarFactura ? "Personalizada" : "Genérica"}
                            </Text>
                        </Group>

                        {datosFacturacion && (
                            <>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Cliente:
                                    </Text>
                                    <Text size="sm" fw={500}>
                                        {datosFacturacion.cliente_nombres_completos}
                                    </Text>
                                </Group>

                                {datosFacturacion.cliente_identificacion && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">
                                            Identificación:
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {
                                                datosFacturacion.cliente_identificacion
                                            }
                                        </Text>
                                    </Group>
                                )}

                                {generarFactura && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">
                                            Factura detallada:
                                        </Text>
                                        <Badge
                                            color={
                                                datosFacturacion.solicita_detallada
                                                    ? "teal"
                                                    : "gray"
                                            }
                                            size="sm"
                                        >
                                            {datosFacturacion.solicita_detallada
                                                ? "SÍ"
                                                : "NO"}
                                        </Badge>
                                    </Group>
                                )}
                            </>
                        )}
                    </Stack>
                </Paper>

                {/* Información adicional */}
                <Alert color="gray" variant="light">
                    <Text size="xs" c="dimmed">
                        <strong>Nota:</strong> Al confirmar se ejecutarán las
                        siguientes acciones:
                    </Text>
                    <Text size="xs" c="dimmed" mt="xs" component="ul" pl="md">
                        <li>
                            Se cambiará el estado de la reserva a{" "}
                            <strong>PAGADO</strong>
                        </li>
                        <li>Se generará la factura automáticamente</li>
                        <li>Se exportará la nota de venta en PDF</li>
                    </Text>
                </Alert>

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
