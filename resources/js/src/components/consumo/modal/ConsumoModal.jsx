import { useEffect, useState } from "react";
import {
    Modal,
    Group,
    Stack,
    Text,
    Title,
    Divider,
    Box,
    rem,
    SimpleGrid,
    TextInput,
    ScrollArea,
    Accordion,
    Paper,
    Badge,
    ThemeIcon,
    NumberInput,
    Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { BtnSubmit, TextSection } from "../../../components";
import { IconSearch, IconPlus, IconMinus, IconTrash, IconShoppingCart } from "@tabler/icons-react";
import {
    useUiConsumo,
    useInventarioStore,
    useConsumoStore,
    useConfiguracionIvaStore,
    MODAL_CONFIG,
} from "../../../hooks";
import Swal from "sweetalert2";

const formatMoney = (v) =>
    parseFloat(v || 0).toLocaleString("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

export function ConsumoModal({ reserva_id }) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { abrirModalConsumo, fnAbrirModalConsumo } = useUiConsumo();
    const { fnCargarProductosInventario, fnLimpiarInventarios, inventarios } = useInventarioStore();
    const { fnAgregarConsumo } = useConsumoStore();
    const { activarIva, fnCargarConfiguracionIvaActiva } = useConfiguracionIvaStore();

    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoriasExpandidas, setCategoriasExpandidas] = useState([]);

    useEffect(() => {
        if (abrirModalConsumo) {
            // Cargar todos los productos activos y el IVA activo
            fnCargarProductosInventario({ activo: 1 });
            fnCargarConfiguracionIvaActiva();
        }
        return () => {
            fnLimpiarInventarios();
            setCarrito([]);
            setBusqueda("");
            setCategoriasExpandidas([]);
        };
    }, [abrirModalConsumo]);

    // Filtrar por búsqueda y activos
    const productosFiltrados = inventarios.filter((p) => {
        if (!p.activo) return false;
        if (busqueda.trim() === "") return true;

        const termino = busqueda.toLowerCase();
        const nomProd = (p.nombre_producto || "").toLowerCase();
        const nomCat = (p.nombre_categoria || "").toLowerCase();

        return nomProd.includes(termino) || nomCat.includes(termino);
    });

    // Agrupar por categoría
    const productosPorCategoria = productosFiltrados.reduce((acc, prod) => {
        const catName = prod.nombre_categoria || "Otros";
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(prod);
        return acc;
    }, {});

    useEffect(() => {
        if (busqueda.trim() !== "") {
            setCategoriasExpandidas(Object.keys(productosPorCategoria));
        } else {
            setCategoriasExpandidas([]);
        }
    }, [busqueda]);

    // Subtotal local
    const subtotal = carrito.reduce(
        (acc, item) => acc + item.precio_unitario * item.cantidad,
        0,
    );

    // IVA y total
    const tasaIva = parseFloat(activarIva || 0) / 100;
    const valorIva = subtotal * tasaIva;
    const total = subtotal + valorIva;

    const handleAgregar = (prod) => {
        const existe = carrito.find((item) => item.inventario_id === prod.id);
        if (existe) {
            setCarrito(
                carrito.map((item) =>
                    item.inventario_id === prod.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCarrito([
                ...carrito,
                {
                    categoria_id: prod.categoria_id, // Importante para el backend 
                    inventario_id: prod.id,
                    nombre: prod.nombre_producto,
                    precio_unitario: parseFloat(prod.precio_unitario),
                    cantidad: 1,
                    stock: prod.stock,
                    sin_stock: prod.sin_stock,
                },
            ]);
        }
    };

    const fnActualizarCantidad = (id, cantidad) => {
        setCarrito(
            carrito.map((item) =>
                item.inventario_id === id ? { ...item, cantidad } : item
            )
        );
    };

    const fnEliminarDelCarrito = (id) => {
        setCarrito(carrito.filter((item) => item.inventario_id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (carrito.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Carrito vacío",
                text: "Agregue al menos un producto.",
            });
            return;
        }

        Swal.fire({
            icon: "question",
            title: "¿Confirmar? ",
            text: "¿Desea registrar estos consumos para la reserva?",
            showCancelButton: true,
            confirmButtonText: "Sí, registrar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Preparar payload
                const payload = {
                    reserva_id,
                    consumos: carrito.map((item) => ({
                        categoria_id: item.categoria_id,
                        inventario_id: item.inventario_id,
                        cantidad: item.cantidad,
                        precio_unitario: item.precio_unitario,
                    }))
                };

                fnAgregarConsumo(payload).then(() => {
                    fnAbrirModalConsumo(false);
                    setCarrito([]);
                });
            }
        });
    };

    const handleCloseModal = () => {
        fnAbrirModalConsumo(false);
        setCarrito([]);
    };

    return (
        <Modal
            fullScreen={isMobile}
            opened={abrirModalConsumo}
            onClose={handleCloseModal}
            closeOnClickOutside={false}
            size="xl" // Usar un tamaño más grande o MODAL_CONFIG.size si era grande
            overlayProps={MODAL_CONFIG.overlayProps}
            title={
                <Group>
                    <Title order={4} fw={700}>
                        Registrar Consumo a Reserva
                    </Title>
                </Group>
            }
        >
            <Box mb={rem(15)}>
                <Text mt={rem(5)} c="dimmed" size="sm">
                    Busque y seleccione los productos a agregar como consumo de la reserva.
                </Text>
            </Box>
            <Divider mb={rem(15)} />

            <form onSubmit={handleSubmit}>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    {/* Catálogo */}
                    <Stack gap="sm">
                        <Text fw={600} size="sm" c="dimmed">
                            Catálogo de Productos
                        </Text>
                        <TextInput
                            placeholder="Buscar producto o categoría..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.currentTarget.value)}
                            leftSection={<IconSearch size={16} />}
                        />
                        <ScrollArea h={400}>
                            {Object.keys(productosPorCategoria).length === 0 ? (
                                <Text c="dimmed" size="sm" ta="center" mt="md">
                                    No se encontraron productos
                                </Text>
                            ) : (
                                <Accordion
                                    multiple
                                    variant="contained"
                                    value={categoriasExpandidas}
                                    onChange={setCategoriasExpandidas}
                                >
                                    {Object.entries(productosPorCategoria).map(
                                        ([categoria, productos]) => (
                                            <Accordion.Item
                                                key={categoria}
                                                value={categoria}
                                            >
                                                <Accordion.Control>
                                                    <TextSection fw={500}>
                                                        {categoria} ({productos.length})
                                                    </TextSection>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    <Stack gap="xs">
                                                        {productos.map((prod) => (
                                                            <Paper
                                                                key={prod.id}
                                                                p="sm"
                                                                withBorder
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    handleAgregar(prod)
                                                                }
                                                            >
                                                                <Group justify="space-between">
                                                                    <Stack gap={2}>
                                                                        <Text
                                                                            size="sm"
                                                                            fw={500}
                                                                        >
                                                                            {
                                                                                prod.nombre_producto
                                                                            }
                                                                        </Text>
                                                                        <Text
                                                                            size="xs"
                                                                            c="dimmed"
                                                                        >
                                                                            {prod.sin_stock
                                                                                ? "Sin control de stock"
                                                                                : `Stock: ${prod.stock}`}
                                                                        </Text>
                                                                    </Stack>
                                                                    <Group gap="xs">
                                                                        <Badge variant="light">
                                                                            {formatMoney(
                                                                                prod.precio_unitario,
                                                                            )}
                                                                        </Badge>
                                                                        <ThemeIcon
                                                                            size="sm"
                                                                            variant="light"
                                                                        >
                                                                            <IconPlus
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                        </ThemeIcon>
                                                                    </Group>
                                                                </Group>
                                                            </Paper>
                                                        ))}
                                                    </Stack>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        ),
                                    )}
                                </Accordion>
                            )}
                        </ScrollArea>
                    </Stack>

                    {/* Carrito */}
                    <Stack gap="sm">
                        <Text fw={600} size="sm" c="dimmed">
                            Consumos a registrar ({carrito.length}{" "}
                            {carrito.length === 1 ? "item" : "items"})
                        </Text>
                        <ScrollArea h={300}>
                            {carrito.length === 0 ? (
                                <Text c="dimmed" size="sm" ta="center" mt="xl">
                                    Seleccione productos del catálogo
                                </Text>
                            ) : (
                                <Stack gap="xs">
                                    {carrito.map((item) => (
                                        <Paper
                                            key={item.inventario_id}
                                            p="sm"
                                            withBorder
                                        >
                                            <Group
                                                justify="space-between"
                                                wrap="nowrap"
                                            >
                                                <Text size="sm" flex={1} lineClamp={1}>
                                                    {item.nombre}
                                                </Text>
                                                <Group gap="xs" wrap="nowrap">
                                                    <NumberInput
                                                        value={item.cantidad}
                                                        onChange={(v) =>
                                                            fnActualizarCantidad(
                                                                item.inventario_id,
                                                                Math.max(
                                                                    1,
                                                                    parseInt(v) || 1,
                                                                ),
                                                            )
                                                        }
                                                        min={1}
                                                        max={
                                                            item.sin_stock
                                                                ? 9999
                                                                : item.stock
                                                        }
                                                        style={{ width: 70 }}
                                                        size="xs"
                                                        leftSection={
                                                            <IconMinus size={10} />
                                                        }
                                                    />
                                                    <Text
                                                        size="xs"
                                                        fw={600}
                                                        w={70}
                                                        ta="right"
                                                    >
                                                        {formatMoney(
                                                            item.precio_unitario *
                                                                item.cantidad,
                                                        )}
                                                    </Text>
                                                    <Button
                                                        size="xs"
                                                        color="red"
                                                        variant="subtle"
                                                        p={4}
                                                        onClick={() =>
                                                            fnEliminarDelCarrito(
                                                                item.inventario_id,
                                                            )
                                                        }
                                                    >
                                                        <IconTrash size={14} />
                                                    </Button>
                                                </Group>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </ScrollArea>
                        <Divider />
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Subtotal:</Text>
                            <Text size="sm" c="dimmed">
                                {formatMoney(subtotal)}
                            </Text>
                        </Group>
                        {activarIva > 0 && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">IVA ({activarIva}%):</Text>
                                <Text size="sm" c="dimmed">
                                    {formatMoney(valorIva)}
                                </Text>
                            </Group>
                        )}
                        <Divider variant="dashed" />
                        <Group justify="space-between">
                            <Text fw={700}>Total{activarIva > 0 ? ` (IVA ${activarIva}% incl.)` : ""}:</Text>
                            <Text fw={700} size="lg" c="blue">
                                {formatMoney(activarIva > 0 ? total : subtotal)}
                            </Text>
                        </Group>
                        <Group justify="flex-end" mt="md">
                            <BtnSubmit fullwidth={false} height={40} fontSize={14} disabled={carrito.length === 0} leftSection={<IconShoppingCart size={16} />}>
                                Guardar consumos
                            </BtnSubmit>
                        </Group>
                    </Stack>
                </SimpleGrid>
            </form>
        </Modal>
    );
}

