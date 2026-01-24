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
    Tooltip,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconFileText,
    IconDownload,
    IconTrash,
    IconDiscount,
    IconInfoCircle,
} from "@tabler/icons-react";
import { useFacturaStore, useUiFactura } from "../../../hooks";
import dayjs from "dayjs";

export const FacturaDetalleModal = ({ opened, onClose }) => {
    const { factura, fnDescargarFacturaPDF, fnActivarFactura } =
        useFacturaStore();
    const { fnAbrirModalAnularFactura } = useUiFactura();

    if (!factura) return null;

    // Calcular si tiene descuentos
    const tieneDescuentos =
        factura.consumos?.some((c) => parseFloat(c.descuento) > 0) || false;

    // Calcular totales de descuentos
    const totalDescuentos = factura.consumos?.reduce(
        (sum, c) => sum + parseFloat(c.descuento || 0),
        0,
    );

    const subtotalAntesDescuentos = factura.consumos?.reduce(
        (sum, c) => sum + parseFloat(c.subtotal || 0),
        0,
    );

    const handleAnular = () => {
        fnActivarFactura(factura);
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
                    {tieneDescuentos && (
                        <Badge
                            leftSection={<IconDiscount size={14} />}
                            color="orange"
                            variant="light"
                        >
                            Con Descuentos
                        </Badge>
                    )}
                </Group>
            }
            size={1100}
            padding="lg"
        >
            <Stack gap="md">
                {/* Estado de Factura */}
                {factura.estado === "ANULADA" && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Factura Anulada"
                        color="red"
                    >
                        <Text size="sm">
                            <strong>Motivo:</strong> {factura.motivo_anulacion}
                        </Text>
                        <Text size="sm">
                            <strong>Fecha de Anulación:</strong>{" "}
                            {dayjs(factura.fecha_anulacion).format(
                                "DD/MM/YYYY HH:mm",
                            )}
                        </Text>
                        {factura.usuario_anulo && (
                            <Text size="sm">
                                <strong>Anulada por:</strong>{" "}
                                {factura.usuario_anulo.nombres}{" "}
                                {factura.usuario_anulo.apellidos}
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
                            variant="light"
                            color={
                                factura.estado === "EMITIDA" ? "green" : "red"
                            }
                            size="md"
                        >
                            {factura.estado}
                        </Badge>
                    </Group>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Número de Factura:
                            </Text>
                            <Text size="sm" fw={600}>
                                {factura.numero_factura}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Fecha de Emisión:
                            </Text>
                            <Text size="sm" fw={600}>
                                {dayjs(factura.fecha_emision).format(
                                    "DD/MM/YYYY",
                                )}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Código de Reserva:
                            </Text>
                            <Badge variant="light" color="blue">
                                {factura.reserva?.codigo_reserva}
                            </Badge>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Tipo de Factura:
                            </Text>
                            <Badge
                                color={
                                    factura.solicita_factura_detallada
                                        ? "teal"
                                        : "gray"
                                }
                                variant="light"
                            >
                                {factura.solicita_factura_detallada
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
                                {factura.cliente_nombres_completos}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                {factura.cliente_tipo_identificacion}:
                            </Text>
                            <Text size="sm" fw={500}>
                                {factura.cliente_identificacion}
                            </Text>
                        </Group>
                        {factura.cliente_direccion && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Dirección:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {factura.cliente_direccion}
                                </Text>
                            </Group>
                        )}
                        {factura.cliente_telefono && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Teléfono:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {factura.cliente_telefono}
                                </Text>
                            </Group>
                        )}
                        {factura.cliente_email && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Email:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {factura.cliente_email}
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Paper>

                {/* Detalle de Consumos */}
                {factura.estado !== "ANULADA" ? (
                    <Paper p="md" withBorder>
                        <Group justify="space-between" mb="md">
                            <Text fw={600} size="md">
                                Detalle de Consumos
                            </Text>
                            {tieneDescuentos && (
                                <Badge
                                    leftSection={<IconDiscount size={14} />}
                                    color="orange"
                                    variant="light"
                                >
                                    Incluye descuentos
                                </Badge>
                            )}
                        </Group>
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
                                    {tieneDescuentos && (
                                        <Table.Th
                                            style={{ textAlign: "right" }}
                                        >
                                            Descuento
                                        </Table.Th>
                                    )}
                                    <Table.Th style={{ textAlign: "center" }}>
                                        IVA
                                    </Table.Th>
                                    <Table.Th style={{ textAlign: "right" }}>
                                        Total
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {factura.consumos?.map((consumo) => {
                                    const tieneDescuento =
                                        parseFloat(consumo.descuento || 0) > 0;
                                    const subtotalOriginal = parseFloat(
                                        consumo.subtotal || 0,
                                    );
                                    const descuentoMonto = parseFloat(
                                        consumo.descuento || 0,
                                    );

                                    return (
                                        <Table.Tr
                                            key={consumo.id}
                                            style={
                                                tieneDescuento
                                                    ? {
                                                          backgroundColor:
                                                              "#fff4e6",
                                                      }
                                                    : {}
                                            }
                                        >
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <Text size="sm">
                                                        {
                                                            consumo.inventario
                                                                ?.nombre_producto
                                                        }
                                                    </Text>
                                                    {tieneDescuento && (
                                                        <Tooltip
                                                            label={
                                                                consumo.motivo_descuento ||
                                                                "Descuento aplicado"
                                                            }
                                                            position="top"
                                                            withArrow
                                                        >
                                                            <IconDiscount
                                                                size={16}
                                                                color="#fd7e14"
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Group>
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                {parseFloat(
                                                    consumo.cantidad,
                                                ).toFixed(2)}
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "right" }}
                                            >
                                                $
                                                {parseFloat(
                                                    consumo.inventario
                                                        .precio_unitario,
                                                ).toFixed(2)}
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "right" }}
                                            >
                                                {tieneDescuento ? (
                                                    <Text
                                                        size="sm"
                                                        td="line-through"
                                                        c="dimmed"
                                                    >
                                                        $
                                                        {subtotalOriginal.toFixed(
                                                            2,
                                                        )}
                                                    </Text>
                                                ) : (
                                                    <Text size="sm">
                                                        $
                                                        {subtotalOriginal.toFixed(
                                                            2,
                                                        )}
                                                    </Text>
                                                )}
                                            </Table.Td>
                                            {tieneDescuentos && (
                                                <Table.Td
                                                    style={{
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    {tieneDescuento ? (
                                                        <Group
                                                            gap={4}
                                                            justify="flex-end"
                                                        >
                                                            <Text
                                                                size="sm"
                                                                c="red"
                                                                fw={500}
                                                            >
                                                                -$
                                                                {descuentoMonto.toFixed(
                                                                    2,
                                                                )}
                                                            </Text>
                                                            {consumo.tipo_descuento ===
                                                                "PORCENTAJE" && (
                                                                <Badge
                                                                    size="xs"
                                                                    color="orange"
                                                                >
                                                                    {parseFloat(
                                                                        consumo.porcentaje_descuento ||
                                                                            0,
                                                                    ).toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </Badge>
                                                            )}
                                                        </Group>
                                                    ) : (
                                                        <Text
                                                            size="sm"
                                                            c="dimmed"
                                                        >
                                                            -
                                                        </Text>
                                                    )}
                                                </Table.Td>
                                            )}
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                {consumo.tasa_iva}%
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "right" }}
                                            >
                                                <Text fw={600} size="sm">
                                                    $
                                                    {parseFloat(
                                                        consumo.total,
                                                    ).toFixed(2)}
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    );
                                })}
                            </Table.Tbody>
                        </Table>

                        {/* Mostrar consumos con descuento y sus motivos */}
                        {tieneDescuentos && (
                            <Paper
                                p="sm"
                                mt="md"
                                withBorder
                                style={{ backgroundColor: "#fff9db" }}
                            >
                                <Group gap="xs" mb="xs">
                                    <IconInfoCircle size={16} color="#fab005" />
                                    <Text size="sm" fw={600} c="orange">
                                        Motivos de Descuentos Aplicados
                                    </Text>
                                </Group>
                                <Stack gap="xs">
                                    {factura.consumos
                                        ?.filter(
                                            (c) =>
                                                parseFloat(c.descuento || 0) >
                                                0,
                                        )
                                        .map((consumo) => (
                                            <Group
                                                key={consumo.id}
                                                justify="space-between"
                                                gap="xs"
                                            >
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    flex={1}
                                                >
                                                    •{" "}
                                                    {
                                                        consumo.inventario
                                                            ?.nombre_producto
                                                    }
                                                    :
                                                </Text>
                                                <Text size="xs" flex={2}>
                                                    {consumo.motivo_descuento ||
                                                        "Sin motivo especificado"}
                                                </Text>
                                                {consumo.usuario_registro_descuento && (
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        fs="italic"
                                                    >
                                                        (
                                                        {
                                                            consumo
                                                                .usuario_registro_descuento
                                                                .nombres
                                                        }{" "}
                                                        {
                                                            consumo
                                                                .usuario_registro_descuento
                                                                .apellidos
                                                        }
                                                        )
                                                    </Text>
                                                )}
                                            </Group>
                                        ))}
                                </Stack>
                            </Paper>
                        )}
                    </Paper>
                ) : null}

                {/* Totales */}
                <Paper p="md" withBorder style={{ backgroundColor: "#f8f9fa" }}>
                    <Text fw={600} size="md" mb="md">
                        Resumen de Totales
                    </Text>
                    <Stack gap="xs">
                        {tieneDescuentos && (
                            <>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Subtotal antes de descuentos:
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        $
                                        {subtotalAntesDescuentos?.toFixed(2) ||
                                            "0.00"}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" fw={500} c="orange">
                                        Total descuentos aplicados:
                                    </Text>
                                    <Text size="sm" fw={600} c="orange">
                                        -$
                                        {totalDescuentos?.toFixed(2) || "0.00"}
                                    </Text>
                                </Group>
                                <Divider />
                            </>
                        )}
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                Subtotal sin IVA:
                            </Text>
                            <Text size="sm">
                                $
                                {parseFloat(factura.subtotal_sin_iva).toFixed(
                                    2,
                                )}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                Total de Descuento(s):
                            </Text>
                            <Text size="sm">
                                $
                                {parseFloat(factura.total_descuento).toFixed(
                                    2,
                                ) || "0.00"}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                IVA:
                            </Text>
                            <Text size="sm">
                                ${parseFloat(factura.total_iva).toFixed(2)}
                            </Text>
                        </Group>

                        <Divider my="xs" />
                        <Group justify="space-between">
                            <Text size="lg" fw={700}>
                                TOTAL A PAGAR:
                            </Text>
                            <Text size="lg" fw={700} c="teal">
                                ${parseFloat(factura.total_factura).toFixed(2)}
                            </Text>
                        </Group>
                        {tieneDescuentos && (
                            <Text size="xs" c="dimmed" ta="right">
                                Ahorro total: $
                                {totalDescuentos?.toFixed(2) || "0.00"}
                            </Text>
                        )}
                    </Stack>
                </Paper>

                {/* Observaciones */}
                {factura.observaciones && (
                    <Paper
                        p="md"
                        withBorder
                        style={{ backgroundColor: "#fff3cd" }}
                    >
                        <Text fw={600} size="sm" mb="xs">
                            Observaciones:
                        </Text>
                        <Text size="sm">{factura.observaciones}</Text>
                    </Paper>
                )}

                {/* Información de Auditoría */}
                <Paper p="md" withBorder>
                    <Text fw={600} size="sm" mb="xs">
                        Información de Auditoría
                    </Text>
                    <Text size="xs" c="dimmed">
                        Generado por: {factura.usuario_genero?.nombres}{" "}
                        {factura.usuario_genero?.apellidos}
                    </Text>
                    <Text size="xs" c="dimmed">
                        Fecha de creación:{" "}
                        {dayjs(factura.created_at).format(
                            "DD/MM/YYYY HH:mm:ss",
                        )}
                    </Text>
                </Paper>

                {/* Botones de Acción */}
                <Group justify="space-between" mt="md">
                    <Button
                        leftSection={<IconDownload size={16} />}
                        onClick={() => fnDescargarFacturaPDF(factura.id)}
                        color="teal"
                    >
                        Descargar PDF
                    </Button>

                    <Group>
                        {factura.estado === "EMITIDA" && (
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
