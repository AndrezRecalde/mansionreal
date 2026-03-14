import { useState, useEffect } from "react";
import {
    Accordion,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Group,
    NumberInput,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Stepper,
    Text,
    Textarea,
    TextInput,
    ThemeIcon,
    Title,
} from "@mantine/core";
import {
    IconCheck,
    IconCoin,
    IconFileInvoice,
    IconMinus,
    IconPlus,
    IconSearch,
    IconShoppingCart,
    IconTrash,
} from "@tabler/icons-react";
import {
    useClienteFacturacionStore,
    useInventarioStore,
    useVentaMostradorStore,
} from "../../hooks";
import {
    ClienteFacturacionSelector,
    PrincipalSectionPage,
    TextSection,
    TitlePage,
} from "../../components";
import Swal from "sweetalert2";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatMoney = (v) =>
    parseFloat(v || 0).toLocaleString("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

// ─── Paso 1: Carrito ─────────────────────────────────────────────────────────

const CarritoStep = ({ onNext }) => {
    const { inventarios } = useInventarioStore();
    const {
        carrito,
        fnAgregarAlCarrito,
        fnEliminarDelCarrito,
        fnActualizarCantidad,
    } = useVentaMostradorStore();

    const [busqueda, setBusqueda] = useState("");
    const [categoriasExpandidas, setCategoriasExpandidas] = useState([]);

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

    const handleAgregar = (prod) => {
        fnAgregarAlCarrito({
            inventario_id: prod.id,
            nombre: prod.nombre_producto,
            precio_unitario: parseFloat(prod.precio_unitario),
            cantidad: 1,
            stock: prod.stock,
            sin_stock: prod.sin_stock,
        });
    };

    // Solo valida localmente — el stock se descuenta cuando se paga
    const handleConfirmar = () => {
        if (carrito.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Carrito vacío",
                text: "Agregue al menos un producto para registrar la venta.",
            });
            return;
        }
        onNext();
    };

    return (
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
                    Carrito ({carrito.length}{" "}
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
                    <Text fw={600}>Subtotal estimado:</Text>
                    <Text fw={700} size="lg">
                        {formatMoney(subtotal)}
                    </Text>
                </Group>
                <Button
                    leftSection={<IconShoppingCart size={16} />}
                    onClick={handleConfirmar}
                    disabled={carrito.length === 0}
                >
                    Confirmar Venta
                </Button>
            </Stack>
        </SimpleGrid>
    );
};

// ─── Paso 2: Pago ─────────────────────────────────────────────────────────────

// Concepto fijo para ventas de mostrador
const CONCEPTO_PAGO_CONSUMOS_ID = 3;

const PagoStep = ({ onNext, onBack }) => {
    const { carrito, cargando, fnRegistrarVenta, fnRegistrarPago, pagos } =
        useVentaMostradorStore();

    // Calcular totales localmente desde el carrito (sin backend aún)
    const subtotal = carrito.reduce(
        (acc, item) => acc + item.precio_unitario * item.cantidad,
        0,
    );
    const tasa = 0.15; // Se calcula definitivo en el backend
    const iva = subtotal * tasa;
    const total = subtotal + iva;

    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [codigoVoucher, setCodigoVoucher] = useState("");
    const [monto, setMonto] = useState(parseFloat(total.toFixed(2)));
    const [observaciones, setObservaciones] = useState("");

    const requiereVoucher = ["TARJETA", "TRANSFERENCIA", "OTRO"].includes(
        metodoPago,
    );

    // Recalcular monto cuando cambia el total estimado
    useEffect(() => {
        setMonto(parseFloat(total.toFixed(2)));
    }, [carrito.length]);

    const handlePagar = async () => {
        if (requiereVoucher && !codigoVoucher.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Código de voucher requerido",
                text: "Por favor ingrese el código del voucher para completar el pago.",
            });
            return;
        }

        // 1. Registrar consumos y descontar stock
        const consumos = await fnRegistrarVenta();
        if (!consumos) return; // fnRegistrarVenta ya muestra el error

        // 2. Registrar el pago
        const result = await fnRegistrarPago({
            concepto_pago_id: CONCEPTO_PAGO_CONSUMOS_ID,
            monto,
            metodo_pago: metodoPago,
            codigo_voucher: codigoVoucher || null,
            observaciones,
        });
        if (result) onNext();
    };

    const METODOS = [
        { value: "EFECTIVO", label: "💵 Efectivo" },
        { value: "TARJETA", label: "💳 Tarjeta" },
        { value: "TRANSFERENCIA", label: "🏦 Transferencia" },
        { value: "OTRO", label: "Otro" },
    ];

    return (
        <Stack gap="lg">
            {/* Resumen de totales (calculado localmente) */}
            <Paper p="md" withBorder>
                <Text fw={600} mb="sm">
                    Resumen de la Venta
                </Text>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Subtotal:
                    </Text>
                    <Text size="sm">{formatMoney(subtotal)}</Text>
                </Group>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        IVA (15%):
                    </Text>
                    <Text size="sm">{formatMoney(iva)}</Text>
                </Group>
                <Divider my="xs" />
                <Group justify="space-between">
                    <Text fw={700}>Total estimado:</Text>
                    <Text fw={700} size="lg" c="blue">
                        {formatMoney(total)}
                    </Text>
                </Group>
            </Paper>

            {/* Método de pago */}
            <Box>
                <Text size="sm" fw={500} mb="xs">
                    Método de Pago
                </Text>
                <Group>
                    {METODOS.map((m) => (
                        <Button
                            key={m.value}
                            variant={
                                metodoPago === m.value ? "filled" : "light"
                            }
                            size="sm"
                            onClick={() => {
                                setMetodoPago(m.value);
                                setCodigoVoucher("");
                            }}
                        >
                            {m.label}
                        </Button>
                    ))}
                </Group>
            </Box>

            {/* Voucher — solo cuando no es efectivo */}
            {requiereVoucher && (
                <TextInput
                    label="Código de Voucher *"
                    value={codigoVoucher}
                    onChange={(e) => setCodigoVoucher(e.currentTarget.value)}
                    placeholder="Ej: TXN-00123456"
                    required
                    maxLength={100}
                />
            )}

            {/* Monto */}
            <NumberInput
                label="Monto recibido"
                value={monto}
                onChange={setMonto}
                min={0}
                precision={2}
                prefix="$ "
            />

            <Textarea
                label="Observaciones (opcional)"
                value={observaciones}
                onChange={(e) => setObservaciones(e.currentTarget.value)}
                placeholder="Ej: Pago en efectivo con vuelto"
                maxLength={500}
                autosize
                minRows={2}
            />

            <Group justify="space-between" mt="md">
                <Button variant="default" onClick={onBack}>
                    Atrás
                </Button>
                <Button
                    leftSection={<IconCoin size={16} />}
                    onClick={handlePagar}
                    loading={cargando}
                >
                    Confirmar y Pagar
                </Button>
            </Group>
        </Stack>
    );
};

// ─── Paso 3: Facturación ──────────────────────────────────────────────────────

const FacturacionStep = ({ onBack, onReset }) => {
    const [generarFactura, setGenerarFactura] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);
    const [observaciones, setObservaciones] = useState("");

    const { consumidorFinal, fnCargarConsumidorFinal } =
        useClienteFacturacionStore();
    const {
        consumosConfirmados,
        factura,
        cargando,
        fnGenerarFactura,
        fnLimpiarCarrito,
        fnDescargarFacturaPDF,
    } = useVentaMostradorStore();
    const { fnCargarProductosInventario } = useInventarioStore();

    useEffect(() => {
        fnCargarConsumidorFinal();
    }, []);

    const handleGenerar = async () => {
        if (!clienteSeleccionado?.id) {
            Swal.fire({
                icon: "warning",
                title: "Seleccione el tipo de facturación",
            });
            return;
        }
        const ids = consumosConfirmados.map((c) => c.id);
        await fnGenerarFactura({
            consumoIds: ids,
            clienteFacturacionId: clienteSeleccionado.id,
            observaciones,
            solicitaFacturaDetallada: solicitaDetallada,
        });
    };

    const handleNuevaVenta = () => {
        fnLimpiarCarrito();
        fnCargarProductosInventario(); // Refrescar stock actualizado
        onReset();
    };

    if (factura) {
        return (
            <Stack align="center" gap="lg" py="xl">
                <ThemeIcon size={64} radius="xl" color="teal">
                    <IconCheck size={36} />
                </ThemeIcon>
                <Title order={3}>¡Factura Generada!</Title>
                <Text c="dimmed">
                    Factura N° <strong>{factura.numero_factura}</strong> —{" "}
                    {formatMoney(factura.total_factura)}
                </Text>
                <Group>
                    <Button
                        variant="light"
                        leftSection={<IconFileInvoice size={16} />}
                        onClick={() => fnDescargarFacturaPDF(factura.id)}
                        loading={cargando}
                    >
                        Descargar PDF
                    </Button>
                    <Button onClick={handleNuevaVenta}>Nueva Venta</Button>
                </Group>
            </Stack>
        );
    }

    return (
        <Stack gap="lg">
            <ClienteFacturacionSelector
                consumidorFinal={consumidorFinal}
                huespedId={null}
                generarFactura={generarFactura}
                setGenerarFactura={setGenerarFactura}
                clienteSeleccionado={clienteSeleccionado}
                onClienteChange={setClienteSeleccionado}
                solicitaDetallada={solicitaDetallada}
                setSolicitaDetallada={setSolicitaDetallada}
            />

            {clienteSeleccionado && (
                <Textarea
                    label="Observaciones en la factura (opcional)"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.currentTarget.value)}
                    placeholder="Ej: Pago correspondiente a servicio de restaurante"
                    maxLength={500}
                    autosize
                    minRows={2}
                />
            )}

            <Group justify="space-between" mt="md">
                <Button variant="default" onClick={onBack}>
                    Atrás
                </Button>
                <Group>
                    <Button
                        variant="light"
                        color="gray"
                        onClick={handleNuevaVenta}
                    >
                        Finalizar sin factura
                    </Button>
                    <Button
                        leftSection={<IconFileInvoice size={16} />}
                        onClick={handleGenerar}
                        loading={cargando}
                        disabled={!clienteSeleccionado?.id}
                    >
                        Generar Factura
                    </Button>
                </Group>
            </Group>
        </Stack>
    );
};

// ─── Página Principal ─────────────────────────────────────────────────────────

const VentaMostradorPage = () => {
    const [active, setActive] = useState(0);
    const { fnLimpiarCarrito } = useVentaMostradorStore();
    const { fnCargarProductosInventario } = useInventarioStore();

    useEffect(() => {
        fnCargarProductosInventario();
    }, []);

    const handleNext = () => setActive((cur) => Math.min(cur + 1, 2));

    const handleBack = () => setActive((cur) => Math.max(cur - 1, 0));

    const handleReset = () => {
        setActive(0);
        fnLimpiarCarrito();
    };

    return (
        <Container size="xl" my={20}>
            <PrincipalSectionPage
                title="Venta de Mostrador"
                description="Registro de consumos para clientes sin reserva"
                icon={<IconShoppingCart size={22} />}
            />

            <Paper p="xl" withBorder>
                <Stepper
                    active={active}
                    onStepClick={() => {}} // no navigation manual
                    mb="xl"
                >
                    <Stepper.Step
                        label="Carrito"
                        description="Seleccionar productos"
                        icon={<IconShoppingCart size={18} />}
                    />
                    <Stepper.Step
                        label="Pago"
                        description="Registrar cobro"
                        icon={<IconCoin size={18} />}
                    />
                    <Stepper.Step
                        label="Facturación"
                        description="Emitir factura"
                        icon={<IconFileInvoice size={18} />}
                    />
                </Stepper>

                {active === 0 && <CarritoStep onNext={handleNext} />}
                {active === 1 && (
                    <PagoStep onNext={handleNext} onBack={handleBack} />
                )}
                {active === 2 && (
                    <FacturacionStep
                        onBack={handleBack}
                        onReset={handleReset}
                    />
                )}
            </Paper>
        </Container>
    );
};

export default VentaMostradorPage;
