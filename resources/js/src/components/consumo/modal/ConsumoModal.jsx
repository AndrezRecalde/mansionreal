import React, { useState, useMemo } from "react";
import {
    Modal,
    Chip,
    Select,
    NumberInput,
    Button,
    Group,
    Text,
    Stack,
    Title,
    Card,
    Divider,
    ThemeIcon,
    Center,
    Box,
    rem,
    ActionIcon,
} from "@mantine/core";
import {
    IconBottle,
    IconCookie,
    IconSpray,
    IconShoppingCart,
    IconPlus,
    IconMinus,
} from "@tabler/icons-react";

// Helper para iconos de categoría
function getCategoriaIcon(id) {
    if (id === 1) return <IconBottle size={18} />;
    if (id === 2) return <IconCookie size={18} />;
    if (id === 3) return <IconSpray size={18} />;
    return <IconShoppingCart size={18} />;
}

export function ConsumoModal({
    opened,
    onClose,
    categorias,
    inventarios,
    iva,
    onGuardarConsumo,
}) {
    const [categoria, setCategoria] = useState(null);
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    const productosFiltrados = useMemo(
        () =>
            categoria
                ? inventarios.filter(
                      (inv) => String(inv.categoria_id) === String(categoria)
                  )
                : [],
        [categoria, inventarios]
    );

    const productoSeleccionado = useMemo(
        () => inventarios.find((inv) => String(inv.id) === String(producto)),
        [producto, inventarios]
    );

    const precioUnitario = productoSeleccionado?.precio_unitario || 0;
    const subtotal = precioUnitario * cantidad;
    const valorIva = subtotal * (iva / 100);
    const total = subtotal + valorIva;

    const sumar = () => setCantidad((c) => c + 1);
    const restar = () => setCantidad((c) => (c > 1 ? c - 1 : 1));

    const handleGuardar = () => {
        if (!productoSeleccionado) return;
        onGuardarConsumo({
            inventario_id: productoSeleccionado.id,
            cantidad,
        });
        setCategoria(null);
        setProducto(null);
        setCantidad(1);
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group spacing="xs">
                    <ThemeIcon color="gray.7" radius="xl" size={36}>
                        <IconShoppingCart size={20} />
                    </ThemeIcon>
                    <Title order={3}>Administrar Consumo</Title>
                </Group>
            }
            centered
            size="lg"
            radius="md"
            padding="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Stack gap="md">
                <Text c="dimmed" size="sm" mb={4}>
                    Selecciona una categoría para ver productos disponibles e
                    ingresa la cantidad a consumir.
                </Text>
                <Chip.Group value={categoria} onChange={setCategoria} mb={8}>
                    <Group spacing="sm">
                        {categorias.map((cat) => (
                            <Chip
                                key={cat.id}
                                value={String(cat.id)}
                                icon={getCategoriaIcon(cat.id)}
                                radius="md"
                                size="md"
                                variant={
                                    categoria === String(cat.id)
                                        ? "filled"
                                        : "light"
                                }
                                color={
                                    categoria === String(cat.id)
                                        ? "indigo"
                                        : "gray"
                                }
                                style={{
                                    minWidth: rem(120),
                                    justifyContent: "center",
                                    fontWeight: 500,
                                }}
                            >
                                {cat.nombre}
                            </Chip>
                        ))}
                    </Group>
                </Chip.Group>

                <Select
                    label="Producto"
                    data={productosFiltrados.map((p) => ({
                        label: p.nombre + " ",
                        value: String(p.id),
                        description: `$${Number(p.precio_unitario).toFixed(2)}`,
                        leftSection: (
                            <ThemeIcon color="gray" size="sm">
                                <IconShoppingCart size={14} />
                            </ThemeIcon>
                        ),
                    }))}
                    value={producto}
                    onChange={setProducto}
                    placeholder={
                        categoria
                            ? "Selecciona un producto"
                            : "Primero elige una categoría"
                    }
                    required
                    disabled={!categoria}
                    nothingFoundMessage="No hay productos"
                    searchable
                />

                <Center>
                    <Group mt="sm" spacing="xs">
                        <ActionIcon
                            onClick={restar}
                            disabled={cantidad <= 1}
                            radius="xl"
                            variant="outline"
                            size="lg"
                        >
                            <IconMinus size="1rem" />
                        </ActionIcon>
                        <NumberInput
                            value={cantidad}
                            min={1}
                            onChange={setCantidad}
                            hideControls
                            size="md"
                            styles={{
                                input: {
                                    textAlign: "center",
                                    fontSize: rem(20),
                                    width: rem(70),
                                },
                            }}
                        />
                        <ActionIcon
                            onClick={sumar}
                            radius="xl"
                            variant="filled"
                            size="lg"
                        >
                            <IconPlus size="1rem" />
                        </ActionIcon>
                    </Group>
                </Center>

                <Divider my={8} />

                <Group grow spacing="md">
                    <Card
                        shadow="xs"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ background: "#f4f7fe" }}
                    >
                        <Text size="xs" color="dimmed">
                            Precio unitario
                        </Text>
                        <Text weight={600} size="lg">
                            ${precioUnitario.toFixed(2)}
                        </Text>
                    </Card>
                    <Card
                        shadow="xs"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ background: "#f8fafc" }}
                    >
                        <Text size="xs" color="dimmed">
                            Subtotal
                        </Text>
                        <Text weight={600} size="lg">
                            ${subtotal.toFixed(2)}
                        </Text>
                    </Card>
                    <Card
                        shadow="xs"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ background: "#fef8f4" }}
                    >
                        <Text size="xs" color="dimmed">
                            IVA ({iva}%)
                        </Text>
                        <Text weight={600} size="lg" color="orange">
                            ${valorIva.toFixed(2)}
                        </Text>
                    </Card>
                    <Card
                        shadow="xs"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ background: "#f6fef4" }}
                    >
                        <Text size="xs" color="dimmed">
                            Total
                        </Text>
                        <Text weight={700} size="lg" color="green">
                            ${total.toFixed(2)}
                        </Text>
                    </Card>
                </Group>

                <Box>
                    <Button
                        mt="lg"
                        fullWidth
                        size="xl"
                        radius="md"
                        leftSection={<IconShoppingCart size={22} />}
                        onClick={handleGuardar}
                        disabled={!productoSeleccionado}
                        gradient={{ from: "indigo", to: "indigo", deg: 90 }}
                        variant="gradient"
                    >
                        Guardar consumo
                    </Button>
                </Box>
            </Stack>
        </Modal>
    );
}
