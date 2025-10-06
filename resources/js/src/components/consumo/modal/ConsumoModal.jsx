import React, { useEffect } from "react";
import {
    Modal,
    Button,
    Group,
    Select,
    NumberInput,
    Stack,
    Text,
    ActionIcon,
    Card,
    Title,
    Divider,
    Box,
    Badge,
    Tooltip,
    rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    IconPlus,
    IconTrash,
    IconShoppingCart,
    IconCheck,
} from "@tabler/icons-react";
import {
    useUiConsumo,
    useCategoriaStore,
    useInventarioStore,
    useConsumoStore,
} from "../../../hooks"; // Ajusta la ruta si es necesario
import Swal from "sweetalert2";

const MAX_CONSUMOS = 4;

export function ConsumoModal({ reserva_id }) {
    const { abrirModalConsumo, fnAbrirModalConsumo } = useUiConsumo();
    const { fnCargarCategorias, fnLimpiarCategorias, categorias } =
        useCategoriaStore();
    const { fnCargarProductosInventario, fnLimpiarInventarios, inventarios } =
        useInventarioStore();
    const { fnAgregarConsumo } = useConsumoStore();

    const form = useForm({
        initialValues: {
            reserva_id: "",
            consumos: [{ categoria_id: "", inventario_id: "", cantidad: 1 }],
        },
        validate: {
            consumos: {
                categoria_id: (value) =>
                    !value ? "Seleccione una categoría" : null,
                inventario_id: (value) =>
                    !value ? "Seleccione un producto" : null,
                cantidad: (value) => (value < 1 ? "Debe ser al menos 1" : null),
            },
        },
    });

    useEffect(() => {
        if (abrirModalConsumo) {
            form.setFieldValue("reserva_id", reserva_id);
            fnCargarCategorias({ activo: 1 });
        }
        return () => {
            fnLimpiarCategorias();
            fnLimpiarInventarios();
            form.reset();
        };
        // eslint-disable-next-line
    }, [abrirModalConsumo]);

    // Carga productos al cambiar categoría
    useEffect(() => {
        const lastConsumo = form.values.consumos.at(-1);
        if (lastConsumo?.categoria_id) {
            fnCargarProductosInventario({
                categoria_id: lastConsumo.categoria_id,
            });
        } else {
            fnLimpiarInventarios();
        }
        // eslint-disable-next-line
    }, [form.values.consumos.map((c) => c.categoria_id).join(",")]);

    const handleAddConsumo = () => {
        if (form.values.consumos.length < MAX_CONSUMOS) {
            form.insertListItem("consumos", {
                categoria_id: "",
                inventario_id: "",
                cantidad: 1,
            });
        }
    };

    const handleRemoveConsumo = (idx) => {
        form.removeListItem("consumos", idx);
    };

    const handleSubmit = (values) => {
        Swal.fire({
            icon: "question",
            title: "¿Confirmar?",
            text: "¿Desea registrar estos consumos?",
            showCancelButton: true,
            confirmButtonText: "Sí, registrar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                fnAgregarConsumo(values).then(() => {
                    fnAbrirModalConsumo(false);
                    form.reset();
                });
            }
        });
    };

    return (
        <Modal
            opened={abrirModalConsumo}
            onClose={() => fnAbrirModalConsumo(false)}
            size="lg"
            overlayProps={{
                blur: 3,
                backgroundOpacity: 0.55,
            }}
            title={
                <Group>
                    <IconShoppingCart size={25} />
                    <Title order={4} fw={700}>
                        Registrar Consumo
                    </Title>
                </Group>
            }
        >
            {/* Cabecera del modal con icono y título */}
            <Box mb={rem(20)}>
                <Text mt={rem(5)} c="dimmed" size="sm">
                    Agrega hasta 4 consumos con categoría, producto y cantidad.
                </Text>
            </Box>
            <Divider mb={rem(15)} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    {form.values.consumos.map((consumo, idx) => (
                        <Card
                            key={idx}
                            shadow="sm"
                            withBorder
                            mb="xs"
                            style={{
                                borderLeft: `4px solid #8b959e`,
                                background: "#f8fafc",
                                position: "relative",
                            }}
                        >
                            <Group align="center" justify="space-between">
                                <Group>
                                    <Badge
                                        color="blue"
                                        radius="sm"
                                        variant="default"
                                    >
                                        Consumo {idx + 1}
                                    </Badge>
                                </Group>
                                {form.values.consumos.length > 1 && (
                                    <Tooltip label="Eliminar consumo" withArrow>
                                        <ActionIcon
                                            color="red"
                                            variant="light"
                                            onClick={() =>
                                                handleRemoveConsumo(idx)
                                            }
                                            aria-label="Eliminar consumo"
                                            size="lg"
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </Group>
                            <Divider my={rem(8)} />
                            <Group grow align="end">
                                <Select
                                    searchable
                                    label="Categoría"
                                    placeholder="Seleccione..."
                                    data={categorias.map((cat) => ({
                                        label: cat.nombre_categoria,
                                        value: String(cat.id),
                                    }))}
                                    value={consumo.categoria_id}
                                    onChange={(value) => {
                                        form.setFieldValue(
                                            `consumos.${idx}.categoria_id`,
                                            value || ""
                                        );
                                        form.setFieldValue(
                                            `consumos.${idx}.inventario_id`,
                                            ""
                                        );
                                        if (value) {
                                            fnCargarProductosInventario({
                                                categoria_id: value,
                                            });
                                        } else {
                                            fnLimpiarInventarios();
                                        }
                                    }}
                                    required
                                    error={
                                        form.errors.consumos?.[idx]
                                            ?.categoria_id
                                    }
                                />
                                <Select
                                    searchable
                                    label="Producto"
                                    placeholder="Seleccione..."
                                    data={inventarios.map((inv) => ({
                                        label: inv.nombre_producto,
                                        value: String(inv.id),
                                    }))}
                                    value={consumo.inventario_id}
                                    onChange={(value) =>
                                        form.setFieldValue(
                                            `consumos.${idx}.inventario_id`,
                                            value || ""
                                        )
                                    }
                                    required
                                    error={
                                        form.errors.consumos?.[idx]
                                            ?.inventario_id
                                    }
                                    disabled={!consumo.categoria_id}
                                />
                            </Group>
                            <NumberInput
                                label="Cantidad"
                                min={1}
                                value={consumo.cantidad}
                                onChange={(value) =>
                                    form.setFieldValue(
                                        `consumos.${idx}.cantidad`,
                                        Number(value) || 1
                                    )
                                }
                                required
                                error={form.errors.consumos?.[idx]?.cantidad}
                            />
                        </Card>
                    ))}
                    <Group justify="apart">
                        <Button
                            variant="light"
                            leftSection={<IconPlus size={16} />}
                            onClick={handleAddConsumo}
                            disabled={
                                form.values.consumos.length >= MAX_CONSUMOS
                            }
                            color="blue"
                            radius="sm"
                        >
                            Agregar consumo
                        </Button>
                        <Button
                            type="submit"
                            leftSection={<IconCheck size={16} />}
                            color="indigo"
                            radius="sm"
                        >
                            Guardar consumos
                        </Button>
                    </Group>
                    {form.values.consumos.length >= MAX_CONSUMOS && (
                        <Text c="indigo.6" size="xs" ta="right">
                            Máximo 4 consumos permitidos por reserva.
                        </Text>
                    )}
                </Stack>
            </form>
        </Modal>
    );
}
