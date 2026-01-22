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
import {
    IconAlertCircle,
    IconArrowLeft,
    IconCheck,
    IconDiscount,
} from "@tabler/icons-react";
import { formatFechaHoraModal } from "../../../helpers/fnHelper";

export const ReservaConfirmacionStep = ({
    datos_reserva,
    generarFactura,
    datosFacturacion,
    onBack,
    onConfirm,
    cargando,
}) => {
    // Calcular monto del descuento para vista previa
    const tieneDescuento =
        datosFacturacion?.descuento > 0 ||
        datosFacturacion?.porcentaje_descuento > 0;

    const montoDescuento =
        datosFacturacion?.tipo_descuento === "MONTO_FIJO"
            ? datosFacturacion?.descuento || 0
            : 0; // El backend calculará el monto si es porcentaje

    return (
        <Box mt="xl">
            <Stack gap="lg">
                {/* Alerta de confirmación */}
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Confirmar Finalización"
                    color="orange"
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
                        información sea correcta antes de continuar.
                    </Text>
                </Alert>

                {/* Resumen de la reserva */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Text size="sm" fw={600}>
                            Resumen de la Reserva
                        </Text>
                        <Badge color="blue">
                            {datos_reserva.codigo_reserva}
                        </Badge>
                    </Group>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Huésped:
                            </Text>
                            <Text size="sm" fw={500}>
                                {datos_reserva.nombres_huesped}{" "}
                                {datos_reserva.apellidos_huesped}
                            </Text>
                        </Group>
                        {datos_reserva.tipo_reserva === "HOSPEDAJE" && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Departamento:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {datos_reserva.tipo_departamento}{" "}
                                    {datos_reserva.numero_departamento}
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
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Identificación:
                            </Text>
                            <Text size="sm" fw={500}>
                                {datosFacturacion?.cliente_identificacion ||
                                    "9999999999999"}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Factura Detallada:
                            </Text>
                            <Badge
                                size="sm"
                                color={
                                    datosFacturacion?.solicita_detallada
                                        ? "teal"
                                        : "gray"
                                }
                            >
                                {datosFacturacion?.solicita_detallada
                                    ? "Sí"
                                    : "No"}
                            </Badge>
                        </Group>

                        {/* ✅ NUEVO: Mostrar información de descuento */}
                        {tieneDescuento && (
                            <>
                                <Divider my="xs" />
                                <Group justify="space-between">
                                    <Group gap="xs">
                                        <IconDiscount
                                            size={16}
                                            color="var(--mantine-color-red-6)"
                                        />
                                        <Text size="sm" c="dimmed">
                                            Descuento:
                                        </Text>
                                    </Group>
                                    <Stack gap={4} align="flex-end">
                                        {datosFacturacion?.tipo_descuento ===
                                        "MONTO_FIJO" ? (
                                            <Text size="sm" fw={600} c="red">
                                                - ${montoDescuento.toFixed(2)}
                                            </Text>
                                        ) : (
                                            <Text size="sm" fw={600} c="red">
                                                -{" "}
                                                {datosFacturacion?.porcentaje_descuento?.toFixed(
                                                    2,
                                                )}
                                                %
                                            </Text>
                                        )}
                                        <Badge
                                            size="xs"
                                            color="red"
                                            variant="light"
                                        >
                                            {datosFacturacion?.tipo_descuento ===
                                            "MONTO_FIJO"
                                                ? "Monto Fijo"
                                                : "Porcentaje"}
                                        </Badge>
                                    </Stack>
                                </Group>

                                {datosFacturacion?.motivo_descuento && (
                                    <Group
                                        justify="space-between"
                                        align="flex-start"
                                    >
                                        <Text size="sm" c="dimmed">
                                            Motivo:
                                        </Text>
                                        <Text
                                            size="sm"
                                            style={{
                                                maxWidth: "60%",
                                                textAlign: "right",
                                            }}
                                        >
                                            {datosFacturacion.motivo_descuento}
                                        </Text>
                                    </Group>
                                )}

                                <Alert
                                    color="blue"
                                    variant="light"
                                    icon={<IconDiscount size={16} />}
                                >
                                    <Text size="xs">
                                        {datosFacturacion?.tipo_descuento ===
                                        "MONTO_FIJO"
                                            ? `Se aplicará un descuento de $${montoDescuento.toFixed(2)} al total de la factura`
                                            : `Se aplicará un descuento del ${datosFacturacion?.porcentaje_descuento?.toFixed(2)}% al total de la factura`}
                                    </Text>
                                </Alert>
                            </>
                        )}
                    </Stack>
                </Paper>

                {/* Advertencia final */}
                <Alert
                    icon={<IconCheck size={16} />}
                    title="Acciones a realizar"
                    color="teal"
                >
                    <Text size="sm" component="ul" style={{ paddingLeft: 20 }}>
                        <li>
                            Se cambiará el estado de la reserva a{" "}
                            <strong>PAGADO</strong>
                        </li>
                        <li>Se generará la factura automáticamente</li>
                        {tieneDescuento && (
                            <li>
                                Se aplicará el descuento configurado a la
                                factura
                            </li>
                        )}
                        <li>Se descargará la factura en PDF automáticamente</li>
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
