import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Group,
    NumberInput,
    Paper,
    SegmentedControl,
    Stack,
    Text,
    Textarea,
    Divider,
} from "@mantine/core";
import {
    IconCurrencyDollar,
    IconPercentage,
    IconAlertCircle,
    IconDiscount,
} from "@tabler/icons-react";
import { useConsumoStore } from "../../../hooks";
import classes from "../../elements/modules/LabelsInput.module.css";

export const ConsumoDescuentoForm = ({ form, consumo }) => {
    const { cargando } = useConsumoStore();
    const [vistaPrevia, setVistaPrevia] = useState(null);

    // Calcular vista previa del descuento
    useEffect(() => {
        if (!consumo) return;

        const tipoDescuento = form.values.tipo_descuento;
        const descuentoValor = parseFloat(form.values.descuento) || 0;
        const porcentaje = parseFloat(form.values.porcentaje_descuento) || 0;

        let montoDescuento = 0;

        if (tipoDescuento === "MONTO_FIJO") {
            montoDescuento = descuentoValor;
        } else if (tipoDescuento === "PORCENTAJE") {
            montoDescuento = (consumo.subtotal * porcentaje) / 100;
        }

        // Validar que el descuento no exceda el subtotal
        if (montoDescuento > consumo.subtotal) {
            montoDescuento = consumo.subtotal;
        }

        // Calcular nuevos valores
        const nuevoSubtotal = consumo.subtotal - montoDescuento;
        const nuevoIva = (nuevoSubtotal * consumo.tasa_iva) / 100;
        const nuevoTotal = nuevoSubtotal + nuevoIva;

        setVistaPrevia({
            montoDescuento: montoDescuento.toFixed(2),
            nuevoSubtotal: nuevoSubtotal.toFixed(2),
            nuevoIva: nuevoIva.toFixed(2),
            nuevoTotal: nuevoTotal.toFixed(2),
            porcentajeReal: ((montoDescuento / consumo.subtotal) * 100).toFixed(
                2,
            ),
        });
    }, [
        form.values.tipo_descuento,
        form.values.descuento,
        form.values.porcentaje_descuento,
        consumo,
    ]);

    const tipoDescuento = form.values.tipo_descuento;
    const porcentajeDescuento =
        parseFloat(form.values.porcentaje_descuento) || 0;
    const descuentoExcesivo = porcentajeDescuento > 50;

    return (
        <Box>
            <Stack gap="md">
                {/* Información del consumo */}
                <Paper p="md" withBorder style={{ background: "#f8f9fa" }}>
                    <Text size="sm" fw={600} mb="xs">
                        Información del Consumo
                    </Text>
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                            Producto:
                        </Text>
                        <Text size="sm" fw={500}>
                            {consumo?.nombre_producto}
                        </Text>
                    </Group>
                    <Group justify="space-between" mt="xs">
                        <Text size="sm" c="dimmed">
                            Cantidad:
                        </Text>
                        <Text size="sm" fw={500}>
                            {consumo?.cantidad}
                        </Text>
                    </Group>
                    <Group justify="space-between" mt="xs">
                        <Text size="sm" c="dimmed">
                            Precio unitario:
                        </Text>
                        <Text size="sm" fw={500}>
                            ${parseFloat(consumo?.precio_unitario).toFixed(2)}
                        </Text>
                    </Group>
                    <Divider my="xs" />
                    <Group justify="space-between">
                        <Text size="sm" fw={600}>
                            Subtotal:
                        </Text>
                        <Text size="sm" fw={600}>
                            ${parseFloat(consumo?.subtotal).toFixed(2)}
                        </Text>
                    </Group>
                    <Group justify="space-between" mt="xs">
                        <Text size="sm" c="dimmed">
                            IVA ({consumo?.tasa_iva}%):
                        </Text>
                        <Text size="sm">
                            ${parseFloat(consumo?.iva).toFixed(2)}
                        </Text>
                    </Group>
                    <Group justify="space-between" mt="xs">
                        <Text size="sm" fw={600} c="blue">
                            Total:
                        </Text>
                        <Text size="sm" fw={600} c="blue">
                            ${parseFloat(consumo?.total).toFixed(2)}
                        </Text>
                    </Group>
                </Paper>

                <Divider label="Configurar Descuento" labelPosition="center" />

                {/* Tipo de descuento */}
                <SegmentedControl
                    fullWidth
                    value={tipoDescuento}
                    onChange={(value) =>
                        form.setFieldValue("tipo_descuento", value)
                    }
                    data={[
                        {
                            label: "Monto Fijo ($)",
                            value: "MONTO_FIJO",
                        },
                        {
                            label: "Porcentaje (%)",
                            value: "PORCENTAJE",
                        },
                    ]}
                    disabled={cargando}
                />

                {/* Input según tipo de descuento */}
                {tipoDescuento === "MONTO_FIJO" ? (
                    <NumberInput
                        label="Monto del descuento"
                        placeholder="Ej: 5.00"
                        description="Ingrese el monto exacto a descontar"
                        prefix="$"
                        min={0}
                        max={parseFloat(consumo?.subtotal)}
                        decimalScale={2}
                        fixedDecimalScale
                        {...form.getInputProps("descuento")}
                        leftSection={<IconCurrencyDollar size={16} />}
                        //classNames={classes}
                        required
                    />
                ) : (
                    <NumberInput
                        label="Porcentaje de descuento"
                        placeholder="Ej: 15"
                        description="Ingrese el porcentaje a descontar (1-100)"
                        suffix="%"
                        min={0}
                        max={100}
                        decimalScale={2}
                        {...form.getInputProps("porcentaje_descuento")}
                        leftSection={<IconPercentage size={16} />}
                        //classNames={classes}
                        required
                    />
                )}

                {/* Motivo del descuento */}
                <Textarea
                    label="Motivo del descuento"
                    placeholder="Ej: Promoción de temporada, Cliente VIP, Cortesía..."
                    description={
                        descuentoExcesivo
                            ? "⚠️ OBLIGATORIO para descuentos mayores al 50%"
                            : "Opcional - Ayuda para auditoría y control"
                    }
                    {...form.getInputProps("motivo_descuento")}
                    minRows={2}
                    maxRows={4}
                    //classNames={classes}
                    error={
                        descuentoExcesivo &&
                        !form.values.motivo_descuento?.trim()
                            ? "Motivo obligatorio para descuentos mayores al 50%"
                            : form.errors.motivo_descuento
                    }
                    required={descuentoExcesivo}
                />

                {/* Alerta para descuentos excesivos */}
                {descuentoExcesivo && (
                    <Alert
                        color="orange"
                        icon={<IconAlertCircle />}
                        title="Descuento Alto"
                    >
                        <Text size="sm">
                            Este descuento es superior al 50%. Por favor,
                            justifique el motivo para auditoría.
                        </Text>
                    </Alert>
                )}

                {/* Vista previa del descuento */}
                {vistaPrevia &&
                    (parseFloat(vistaPrevia.montoDescuento) > 0 ||
                        porcentajeDescuento > 0) && (
                        <Paper
                            p="md"
                            withBorder
                            style={{
                                background: "#e7f5ff",
                                borderColor: "#339af0",
                            }}
                        >
                            <Group mb="sm">
                                <IconDiscount size={20} color="#339af0" />
                                <Text size="sm" fw={600} c="blue">
                                    Vista Previa del Descuento
                                </Text>
                            </Group>

                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm">Descuento:</Text>
                                    <Text size="sm" fw={600} c="red">
                                        -${vistaPrevia.montoDescuento}
                                        {tipoDescuento === "PORCENTAJE" &&
                                            ` (${vistaPrevia.porcentajeReal}%)`}
                                    </Text>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm">Nuevo subtotal:</Text>
                                    <Text size="sm" fw={500}>
                                        ${vistaPrevia.nuevoSubtotal}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm">
                                        Nuevo IVA ({consumo?.tasa_iva}%):
                                    </Text>
                                    <Text size="sm" fw={500}>
                                        ${vistaPrevia.nuevoIva}
                                    </Text>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm" fw={700} c="teal">
                                        Nuevo Total:
                                    </Text>
                                    <Text size="lg" fw={700} c="teal">
                                        ${vistaPrevia.nuevoTotal}
                                    </Text>
                                </Group>
                                <Text size="xs" c="dimmed" mt="xs">
                                    💡 El IVA se calcula sobre el subtotal
                                    después del descuento
                                </Text>
                            </Stack>
                        </Paper>
                    )}
            </Stack>
        </Box>
    );
};
