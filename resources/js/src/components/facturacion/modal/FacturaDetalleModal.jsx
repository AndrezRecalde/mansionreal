import {
    Modal,
    Stack,
    Group,
    Text,
    Badge,
    Divider,
    Table,
    Paper,
    Alert,
    Button,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconFileText,
    IconDownload,
    IconTrash,
} from "@tabler/icons-react";
import { useFacturaStore, useUiFactura } from "../../../hooks";
import dayjs from "dayjs";

export const FacturaDetalleModal = ({ opened, onClose }) => {
    const { activarFactura, fnDescargarFacturaPDF } = useFacturaStore();
    const { fnAbrirModalAnularFactura } = useUiFactura();

    if (!activarFactura) return null;

    const handleAnular = () => {
        onClose();
        fnAbrirModalAnularFactura(true);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group>
                    <IconFileText size={24} />
                    <Text fw={700} size="lg">
                        Detalle de Factura
                    </Text>
                </Group>
            }
            size="xl"
            padding="lg"
        >
            <Stack gap="md">
                {/* Estado de Factura */}
                {activarFactura.estado === "ANULADA" && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Factura Anulada"
                        color="red"
                    >
                        <Text size="sm">
                            <strong>Motivo:</strong>{" "}
                            {activarFactura.motivo_anulacion}
                        </Text>
                        <Text size="sm">
                            <strong>Fecha de Anulación:</strong>{" "}
                            {dayjs(activarFactura.fecha_anulacion).format(
                                "DD/MM/YYYY HH:mm"
                            )}
                        </Text>
                        {activarFactura.usuario_anulo && (
                            <Text size="sm">
                                <strong>Anulada por:</strong>{" "}
                                {activarFactura.usuario_anulo.nombres_completos}
                            </Text>
                        )}
                    </Alert>
                )}

                {/* Información General */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Text fw={600} size="md">
                            Información General
                        </Text>
                        <Badge
                            color={
                                activarFactura.estado === "EMITIDA"
                                    ? "green"
                                    : "red"
                            }
                            size="lg"
                        >
                            {activarFactura.estado}
                        </Badge>
                    </Group>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Número de Factura:
                            </Text>
                            <Text size="sm" fw={600}>
                                {activarFactura.numero_factura}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Fecha de Emisión:
                            </Text>
                            <Text size="sm" fw={600}>
                                {dayjs(activarFactura.fecha_emision).format(
                                    "DD/MM/YYYY"
                                )}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Código de Reserva:
                            </Text>
                            <Badge variant="light" color="blue">
                                {activarFactura.reserva?.codigo_reserva}
                            </Badge>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Tipo de Factura:
                            </Text>
                            <Badge
                                color={
                                    activarFactura.solicita_factura_detallada
                                        ? "teal"
                                        : "gray"
                                }
                                variant="light"
                            >
                                {activarFactura.solicita_factura_detallada
                                    ? "Detallada"
                                    : "Simple"}
                            </Badge>
                        </Group>
                    </Stack>
                </Paper>

                {/* Datos del Cliente */}
                <Paper p="md" withBorder>
                    <Text fw={600} size="md" mb="md">
                        Datos del Cliente
                    </Text>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Nombres Completos:
                            </Text>
                            <Text size="sm" fw={500}>
                                {activarFactura.cliente_nombres_completos}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                {activarFactura.cliente_tipo_identificacion}:
                            </Text>
                            <Text size="sm" fw={500}>
                                {activarFactura.cliente_identificacion}
                            </Text>
                        </Group>
                        {activarFactura.cliente_direccion && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Dirección:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {activarFactura.cliente_direccion}
                                </Text>
                            </Group>
                        )}
                        {activarFactura.cliente_telefono && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Teléfono:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {activarFactura.cliente_telefono}
                                </Text>
                            </Group>
                        )}
                        {activarFactura.cliente_email && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Email:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {activarFactura.cliente_email}
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Paper>

                {/* Detalle de Consumos */}
                <Paper p="md" withBorder>
                    <Text fw={600} size="md" mb="md">
                        Detalle de Consumos
                    </Text>
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Descripción</Table.Th>
                                <Table.Th style={{ textAlign: "center" }}>
                                    Cant.
                                </Table.Th>
                                <Table.Th style={{ textAlign: "right" }}>
                                    P. Unit.
                                </Table.Th>
                                <Table.Th style={{ textAlign: "right" }}>
                                    Subtotal
                                </Table.Th>
                                <Table.Th style={{ textAlign: "center" }}>
                                    IVA
                                </Table.Th>
                                <Table.Th style={{ textAlign: "right" }}>
                                    Total
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {activarFactura.consumos?.map((consumo) => (
                                <Table.Tr key={consumo.id}>
                                    <Table.Td>
                                        {consumo.inventario?.nombre_producto}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: "center" }}>
                                        {parseFloat(consumo.cantidad).toFixed(
                                            2
                                        )}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: "right" }}>
                                        $
                                        {parseFloat(
                                            consumo.precio_unitario
                                        ).toFixed(2)}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: "right" }}>
                                        $
                                        {parseFloat(consumo.subtotal).toFixed(
                                            2
                                        )}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: "center" }}>
                                        {consumo.tasa_iva}%
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: "right" }}>
                                        <Text fw={600}>
                                            $
                                            {parseFloat(consumo.total).toFixed(
                                                2
                                            )}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>

                {/* Totales */}
                <Paper p="md" withBorder style={{ backgroundColor: "#f8f9fa" }}>
                    <Text fw={600} size="md" mb="md">
                        Resumen de Totales
                    </Text>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                Subtotal sin IVA:
                            </Text>
                            <Text size="sm">
                                $
                                {parseFloat(
                                    activarFactura.subtotal_sin_iva
                                ).toFixed(2)}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                Subtotal con IVA:
                            </Text>
                            <Text size="sm">
                                $
                                {parseFloat(
                                    activarFactura.subtotal_con_iva
                                ).toFixed(2)}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                IVA:
                            </Text>
                            <Text size="sm">
                                $
                                {parseFloat(activarFactura.total_iva).toFixed(
                                    2
                                )}
                            </Text>
                        </Group>
                        {activarFactura.descuento > 0 && (
                            <Group justify="space-between">
                                <Text size="sm" fw={500} c="red">
                                    Descuento:
                                </Text>
                                <Text size="sm" c="red">
                                    -$
                                    {parseFloat(
                                        activarFactura.descuento
                                    ).toFixed(2)}
                                </Text>
                            </Group>
                        )}
                        <Divider my="xs" />
                        <Group justify="space-between">
                            <Text size="lg" fw={700}>
                                TOTAL:
                            </Text>
                            <Text size="lg" fw={700} c="teal">
                                $
                                {parseFloat(
                                    activarFactura.total_factura
                                ).toFixed(2)}
                            </Text>
                        </Group>
                    </Stack>
                </Paper>

                {/* Observaciones */}
                {activarFactura.observaciones && (
                    <Paper
                        p="md"
                        withBorder
                        style={{ backgroundColor: "#fff3cd" }}
                    >
                        <Text fw={600} size="sm" mb="xs">
                            Observaciones:
                        </Text>
                        <Text size="sm">{activarFactura.observaciones}</Text>
                    </Paper>
                )}

                {/* Información de Auditoría */}
                <Paper p="md" withBorder>
                    <Text fw={600} size="sm" mb="xs">
                        Información de Auditoría
                    </Text>
                    <Text size="xs" c="dimmed">
                        Generado por: {activarFactura.usuario_genero?.nombres}{" "}
                        {activarFactura.usuario_genero?.apellidos}
                    </Text>
                    <Text size="xs" c="dimmed">
                        Fecha de creación:{" "}
                        {dayjs(activarFactura.created_at).format(
                            "DD/MM/YYYY HH:mm: ss"
                        )}
                    </Text>
                </Paper>

                {/* Botones de Acción */}
                <Group justify="space-between" mt="md">
                    <Button
                        leftSection={<IconDownload size={16} />}
                        onClick={() => fnDescargarFacturaPDF(activarFactura.id)}
                        color="teal"
                    >
                        Descargar PDF
                    </Button>

                    <Group>
                        {activarFactura.estado === "EMITIDA" && (
                            <Button
                                leftSection={<IconTrash size={16} />}
                                onClick={handleAnular}
                                color="red"
                                variant="light"
                            >
                                Anular Factura
                            </Button>
                        )}
                        <Button onClick={onClose} variant="default">
                            Cerrar
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
};
