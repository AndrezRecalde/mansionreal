import { useState, useEffect } from "react";
import {
    Accordion,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Group,
    Menu,
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
    Card,
    ActionIcon,
} from "@mantine/core";
import {
    IconCheck,
    IconCoin,
    IconFileInvoice,
    IconDotsVertical,
    IconMinus,
    IconPlus,
    IconSearch,
    IconShoppingCart,
    IconArrowLeft,
    IconReceipt2,
    IconPercentage,
    IconTrash,
} from "@tabler/icons-react";
import {
    useClienteFacturacionStore,
    useInventarioStore,
    useVentaMostradorStore,
    useFacturaStore,
    //useAuthStore,
} from "../../hooks";
import {
    ClienteFacturacionSelector,
    PrincipalSectionPage,
    TextSection,
    //TitlePage,
    LoadingSkeleton,
    VisorFacturaPDF,
    VentaMostradorDescuentoModal,
} from "../../components";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const formatMoney = (v) =>
    parseFloat(v || 0).toLocaleString("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

// ─── Componente Cuentas Abiertas View ────────────────────────────────────────

const CuentasView = () => {
    const {
        cuentas,
        cargando,
        fnCargarCuentas,
        fnCrearCuenta,
        fnSetCuentaActiva,
    } = useVentaMostradorStore();
    const {
        pdfUrl,
        fnPrevisualizarFacturaPDF,
        fnLimpiarPdfUrl,
        fnDescargarFacturaPDF,
    } = useFacturaStore();

    const [abrirModalPdf, setAbrirModalPdf] = useState(false);
    const [facturaActiva, setFacturaActiva] = useState(null);

    useEffect(() => {
        fnCargarCuentas();
    }, []);

    const handleNuevaCuenta = async () => {
        await fnCrearCuenta();
    };

    const handlePrevisualizarFactura = async (factura) => {
        setFacturaActiva(factura);
        setAbrirModalPdf(true);
        await fnPrevisualizarFacturaPDF(factura.id);
    };

    if (cargando && cuentas.length === 0) {
        return <LoadingSkeleton />;
    }

    const pendientes = cuentas.filter(
        (c) => c.estado?.nombre_estado === "PENDIENTE",
    );
    const pagadas = cuentas.filter((c) => c.estado?.nombre_estado === "PAGADO");

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <Text fw={600} size="lg">
                    Cuentas Abiertas ({pendientes.length})
                </Text>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={handleNuevaCuenta}
                    loading={cargando}
                >
                    Nueva Cuenta de Venta
                </Button>
            </Group>

            {pendientes.length === 0 ? (
                <Paper p="xl" ta="center" bg="gray.0">
                    <Text c="dimmed">
                        No hay cuentas abiertas. Puede crear una nueva.
                    </Text>
                </Paper>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                    {pendientes.map((cta) => (
                        <Card
                            key={cta.id}
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Card.Section withBorder inheritPadding py="xs">
                                <Group justify="space-between">
                                    <Text fw={600}>{cta.codigo}</Text>
                                    <Badge color="yellow">
                                        {cta.estado?.nombre_estado}
                                    </Badge>
                                </Group>
                            </Card.Section>

                            <Stack mt="md" mb="xs" gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Atendido por:
                                    </Text>
                                    <Text size="sm" fw={500}>
                                        {cta.usuario?.nombres}{" "}
                                        {cta.usuario?.apellidos}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Total:
                                    </Text>
                                    <Text size="sm" fw={600}>
                                        {formatMoney(cta.total)}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Pagado:
                                    </Text>
                                    <Text size="sm" fw={600} c="green">
                                        {formatMoney(cta.total_pagos)}
                                    </Text>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        {cta.saldo_pendiente < 0
                                            ? "Saldo a Favor:"
                                            : "Saldo Pendiente:"}
                                    </Text>
                                    <Text
                                        size="sm"
                                        fw={600}
                                        c={
                                            cta.saldo_pendiente < 0
                                                ? "blue"
                                                : "red"
                                        }
                                    >
                                        {formatMoney(
                                            Math.abs(cta.saldo_pendiente),
                                        )}
                                    </Text>
                                </Group>
                            </Stack>

                            <Button
                                variant="light"
                                color="blue"
                                fullWidth
                                mt="md"
                                radius="md"
                                onClick={() => fnSetCuentaActiva(cta)}
                            >
                                Ver Detalles / Cobrar
                            </Button>
                        </Card>
                    ))}
                </SimpleGrid>
            )}

            {pagadas.length > 0 && (
                <>
                    <Divider my="md" />
                    <Accordion>
                        <Accordion.Item value="historial">
                            <Accordion.Control>
                                <Text fw={600}>
                                    Últimas cuentas pagadas ({pagadas.length})
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <SimpleGrid
                                    cols={{ base: 1, sm: 2, md: 3 }}
                                    spacing="md"
                                >
                                    {pagadas.map((cta) => (
                                        <Card
                                            key={cta.id}
                                            shadow="sm"
                                            padding="sm"
                                            radius="md"
                                            withBorder
                                        >
                                            <Group
                                                justify="space-between"
                                                align="flex-start"
                                            >
                                                <Group gap="xs">
                                                    <Text fw={600}>
                                                        {cta.codigo}
                                                    </Text>
                                                    <Badge color="green">
                                                        PAGADO
                                                    </Badge>
                                                </Group>
                                                {cta.factura && (
                                                    <Menu
                                                        position="bottom-end"
                                                        withArrow
                                                    >
                                                        <Menu.Target>
                                                            <ActionIcon
                                                                variant="subtle"
                                                                color="gray"
                                                            >
                                                                <IconDotsVertical
                                                                    size={16}
                                                                />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            <Menu.Item
                                                                leftSection={
                                                                    <IconFileInvoice
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    handlePrevisualizarFactura(
                                                                        cta.factura,
                                                                    )
                                                                }
                                                            >
                                                                Ver Factura PDF
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                )}
                                            </Group>
                                            <Text size="xs" mt="xs" c="dimmed">
                                                Total pagado:{" "}
                                                {formatMoney(cta.total_pagos)}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Cajero: {cta.usuario?.nombres}{" "}
                                                {cta.usuario?.apellidos}
                                            </Text>
                                            {cta.factura && (
                                                <Text size="xs" c="dimmed">
                                                    Factura:{" "}
                                                    {cta.factura.numero_factura}
                                                </Text>
                                            )}
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </>
            )}

            <VisorFacturaPDF
                opened={abrirModalPdf}
                onClose={() => {
                    setAbrirModalPdf(false);
                    setFacturaActiva(null);
                    fnLimpiarPdfUrl();
                }}
                pdfUrl={pdfUrl}
                facturaNumero={facturaActiva?.numero_factura}
                onDownload={() => {
                    if (facturaActiva) {
                        fnDescargarFacturaPDF(facturaActiva.id);
                    }
                }}
            />
        </Stack>
    );
};

// ─── Paso 1: Carrito ─────────────────────────────────────────────────────────

const CarritoStep = ({ onNext }) => {
    const usuario = JSON.parse(localStorage.getItem("service_user")) || {};
    const isGerencia = usuario?.roles?.some((r) =>
        ["ADMINISTRADOR", "GERENTE"].includes(r),
    );

    const { inventarios, fnCargarProductosInventario } = useInventarioStore();
    const {
        cuentaActiva,
        fnAgregarConsumo,
        fnEliminarConsumo,
        fnActualizarConsumo,
        fnAsignarConsumoDescuento,
    } = useVentaMostradorStore();

    const [busqueda, setBusqueda] = useState("");
    const [categoriasExpandidas, setCategoriasExpandidas] = useState([]);

    useEffect(() => {
        fnCargarProductosInventario({ solo_venta: true, activo: 1 });
    }, []);

    const productosFiltrados = inventarios.filter((p) => {
        if (!p.activo) return false;
        if (busqueda.trim() === "") return true;

        const termino = busqueda.toLowerCase();
        const nomProd = (p.nombre_producto || "").toLowerCase();
        const nomCat = (p.nombre_categoria || "").toLowerCase();

        return nomProd.includes(termino) || nomCat.includes(termino);
    });

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

    const consumos = cuentaActiva?.consumos || [];
    const total = cuentaActiva?.total || 0;

    const handleAgregar = (prod) => {
        fnAgregarConsumo(cuentaActiva.id, {
            inventario_id: prod.id,
            cantidad: 1,
        });
    };

    const handleConfirmar = () => {
        if (consumos.length === 0) {
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

            <Stack gap="sm">
                <Text fw={600} size="sm" c="dimmed">
                    Consumos Cuenta {cuentaActiva.codigo} ({consumos.length}{" "}
                    items)
                </Text>
                <ScrollArea h={300}>
                    {consumos.length === 0 ? (
                        <Text c="dimmed" size="sm" ta="center" mt="xl">
                            Seleccione productos del catálogo
                        </Text>
                    ) : (
                        <Stack gap="xs">
                            {consumos.map((item) => (
                                <Paper key={item.id} p="sm" withBorder>
                                    <Group
                                        justify="space-between"
                                        wrap="nowrap"
                                    >
                                        <Text size="sm" flex={1} lineClamp={1}>
                                            {item.inventario?.nombre_producto}
                                        </Text>
                                        <Group gap="xs" wrap="nowrap">
                                            <NumberInput
                                                value={item.cantidad}
                                                onChange={(v) =>
                                                    fnActualizarConsumo(
                                                        cuentaActiva.id,
                                                        item.id,
                                                        Math.max(
                                                            1,
                                                            parseInt(v) || 1,
                                                        ),
                                                    )
                                                }
                                                min={1}
                                                max={
                                                    item.inventario?.sin_stock
                                                        ? 9999
                                                        : item.inventario
                                                              ?.stock +
                                                          item.cantidad
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
                                                {formatMoney(item.total)}
                                                {item.tipo_descuento &&
                                                    item.tipo_descuento !==
                                                        "SIN_DESCUENTO" && (
                                                        <Badge
                                                            color="teal"
                                                            size="xs"
                                                            display="block"
                                                        >
                                                            -
                                                            {item.tipo_descuento ===
                                                            "MONTO_FIJO"
                                                                ? formatMoney(
                                                                      item.descuento,
                                                                  )
                                                                : `${item.porcentaje_descuento}%`}
                                                        </Badge>
                                                    )}
                                            </Text>
                                            {isGerencia && (
                                                <Button
                                                    size="xs"
                                                    color="teal"
                                                    variant={
                                                        item.tipo_descuento &&
                                                        item.tipo_descuento !==
                                                            "SIN_DESCUENTO"
                                                            ? "filled"
                                                            : "subtle"
                                                    }
                                                    p={4}
                                                    onClick={() =>
                                                        fnAsignarConsumoDescuento(
                                                            item,
                                                        )
                                                    }
                                                >
                                                    <IconPercentage size={14} />
                                                </Button>
                                            )}
                                            <Button
                                                size="xs"
                                                color="red"
                                                variant="subtle"
                                                p={4}
                                                onClick={() =>
                                                    fnEliminarConsumo(
                                                        cuentaActiva.id,
                                                        item.id,
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
                    <Text fw={600}>Total Cuenta (con IVA):</Text>
                    <Text fw={700} size="lg">
                        {formatMoney(total)}
                    </Text>
                </Group>
                <Button
                    leftSection={<IconShoppingCart size={16} />}
                    onClick={handleConfirmar}
                    disabled={consumos.length === 0}
                >
                    Ir a Pagos
                </Button>
            </Stack>
        </SimpleGrid>
    );
};

// ─── Paso 2: Pago ─────────────────────────────────────────────────────────────

const CONCEPTO_PAGO_CONSUMOS_ID = 3;

const PagoStep = ({ onNext, onBack }) => {
    const { cuentaActiva, cargando, fnRegistrarPago } =
        useVentaMostradorStore();

    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [codigoVoucher, setCodigoVoucher] = useState("");
    const [monto, setMonto] = useState(
        Math.max(
            0,
            Number(parseFloat(cuentaActiva?.saldo_pendiente || 0).toFixed(2)),
        ),
    );
    const [observaciones, setObservaciones] = useState("");

    const requiereVoucher = ["TARJETA", "TRANSFERENCIA", "OTRO"].includes(
        metodoPago,
    );

    useEffect(() => {
        setMonto(
            Math.max(
                0,
                Number(
                    parseFloat(cuentaActiva?.saldo_pendiente || 0).toFixed(2),
                ),
            ),
        );
    }, [cuentaActiva?.saldo_pendiente]);

    const handlePagar = async () => {
        if (monto <= 0) return;
        if (requiereVoucher && !codigoVoucher.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Código de voucher requerido",
                text: "Por favor ingrese el código del voucher para completar el pago.",
            });
            return;
        }

        await fnRegistrarPago(cuentaActiva.id, {
            concepto_pago_id: CONCEPTO_PAGO_CONSUMOS_ID,
            monto,
            metodo_pago: metodoPago,
            codigo_voucher: codigoVoucher || null,
            observaciones,
        });

        setObservaciones("");
        setCodigoVoucher("");
    };

    const puedeCerrar = cuentaActiva?.saldo_pendiente <= 0.01; // margen flotante

    const METODOS = [
        { value: "EFECTIVO", label: "💵 Efectivo" },
        { value: "TARJETA", label: "💳 Tarjeta" },
        { value: "TRANSFERENCIA", label: "🏦 Transferencia" },
        { value: "OTRO", label: "Otro" },
    ];

    return (
        <Stack gap="lg">
            <Paper p="md" withBorder>
                <Text fw={600} mb="sm">
                    Pagos de la Cuenta
                </Text>

                {cuentaActiva?.pagos?.length > 0 && (
                    <Box mb="sm">
                        {cuentaActiva.pagos.map((p) => (
                            <Group justify="space-between" key={p.id} mt={5}>
                                <Text size="sm">
                                    {p.metodo_pago} -{" "}
                                    {dayjs(p.fecha_pago).format(
                                        "DD/MM/YYYY HH:mm",
                                    )}
                                </Text>
                                <Text size="sm" c="green" fw={600}>
                                    {formatMoney(p.monto)}
                                </Text>
                            </Group>
                        ))}
                        <Divider my="sm" />
                    </Box>
                )}

                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Total:
                    </Text>
                    <Text size="sm">{formatMoney(cuentaActiva?.total)}</Text>
                </Group>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Total Pagado:
                    </Text>
                    <Text size="sm" c="green">
                        {formatMoney(cuentaActiva?.total_pagos)}
                    </Text>
                </Group>
                <Divider my="xs" />
                <Group justify="space-between">
                    <Text fw={700}>
                        {cuentaActiva?.saldo_pendiente < 0
                            ? "Saldo a Favor:"
                            : "Saldo Pendiente:"}
                    </Text>
                    <Text
                        fw={700}
                        size="lg"
                        c={cuentaActiva?.saldo_pendiente < 0 ? "blue" : "red"}
                    >
                        {formatMoney(Math.abs(cuentaActiva?.saldo_pendiente))}
                    </Text>
                </Group>
            </Paper>

            {!puedeCerrar ? (
                <>
                    <Box>
                        <Text size="sm" fw={500} mb="xs">
                            Registrar Nuevo Pago
                        </Text>
                        <Group>
                            {METODOS.map((m) => (
                                <Button
                                    key={m.value}
                                    variant={
                                        metodoPago === m.value
                                            ? "filled"
                                            : "light"
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

                    {requiereVoucher && (
                        <TextInput
                            label="Código de Voucher *"
                            value={codigoVoucher}
                            onChange={(e) =>
                                setCodigoVoucher(e.currentTarget.value)
                            }
                            placeholder="Ej: TXN-00123456"
                            required
                            maxLength={100}
                        />
                    )}

                    <NumberInput
                        label="Monto a pagar"
                        value={monto}
                        onChange={setMonto}
                        min={0.01}
                        max={cuentaActiva?.saldo_pendiente + 0.01} // margen de float
                        precision={2}
                        prefix="$ "
                    />

                    <Textarea
                        label="Observaciones (opcional)"
                        value={observaciones}
                        onChange={(e) =>
                            setObservaciones(e.currentTarget.value)
                        }
                        placeholder="Ej: Pago parcial"
                        maxLength={500}
                        autosize
                        minRows={2}
                    />
                </>
            ) : (
                <Paper p="md" bg="blue.0" mt="md" radius="md">
                    <Text ta="center" fw={600} c="blue.7">
                        {cuentaActiva?.saldo_pendiente < 0
                            ? "Existe un saldo a favor. Ya puede facturar y cerrar la cuenta devolviendo la diferencia en caja."
                            : "El saldo pendiente ha sido cubierto por completo. Ya puede facturar y cerrar la cuenta."}
                    </Text>
                </Paper>
            )}

            <Group justify="space-between" mt="md">
                <Button variant="default" onClick={onBack}>
                    Volver a Consumos
                </Button>

                {!puedeCerrar ? (
                    <Button
                        leftSection={<IconCoin size={16} />}
                        onClick={handlePagar}
                        loading={cargando}
                    >
                        Registrar Pago
                    </Button>
                ) : (
                    <Button
                        rightSection={<IconReceipt2 size={16} />}
                        onClick={onNext}
                        color="blue"
                    >
                        Facturar / Cerrar
                    </Button>
                )}
            </Group>
        </Stack>
    );
};

// ─── Paso 3: Facturación ──────────────────────────────────────────────────────

const FacturacionStep = ({ onBack, onReset }) => {
    // Nota: 'generarFactura' aquí significa realmente 'usarClienteRegistrado'
    // false = Consumidor Final, true = Buscar Cliente
    const [usarClienteRegistrado, setUsarClienteRegistrado] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);
    const [observaciones, setObservaciones] = useState("");

    const { consumidorFinal, fnCargarConsumidorFinal } =
        useClienteFacturacionStore();
    const {
        cuentaActiva,
        cargando,
        fnGenerarFactura,
        fnCerrarCuenta,
        fnDescargarFacturaPDF,
    } = useVentaMostradorStore();
    const { fnCargarProductosInventario } = useInventarioStore();

    useEffect(() => {
        fnCargarConsumidorFinal();
    }, []);

    useEffect(() => {
        if (!usarClienteRegistrado && consumidorFinal) {
            setClienteSeleccionado(consumidorFinal);
        }
    }, [consumidorFinal, usarClienteRegistrado, clienteSeleccionado]);

    const handleCerrarProceso = async () => {
        if (!clienteSeleccionado?.id) {
            Swal.fire({
                icon: "warning",
                title: "Seleccione el tipo de facturación",
                text: "Debe seleccionar Consumidor Final o un Cliente Registrado.",
            });
            return;
        }

        const ids = cuentaActiva.consumos.map((c) => c.id);
        const fac = await fnGenerarFactura({
            consumoIds: ids,
            clienteFacturacionId: clienteSeleccionado.id,
            observaciones,
            solicitaFacturaDetallada: solicitaDetallada,
        });

        if (!fac) return; // Si falla la generación, nos detenemos

        const cerrada = await fnCerrarCuenta(cuentaActiva.id, fac?.id);
        if (cerrada) {
            // Actualizar inventario local si hace falta
            fnCargarProductosInventario({ solo_venta: true, activo: 1 });
        }
    };

    if (cuentaActiva?.estado?.nombre_estado === "PAGADO") {
        return (
            <Stack align="center" gap="lg" py="xl">
                <ThemeIcon size={64} radius="xl" color="teal">
                    <IconCheck size={36} />
                </ThemeIcon>
                <Title order={3}>¡Cuenta Cerrada!</Title>

                {cuentaActiva.factura ? (
                    <>
                        <Text c="dimmed">
                            Factura N°{" "}
                            <strong>
                                {cuentaActiva.factura.numero_factura}
                            </strong>{" "}
                            emitido por {formatMoney(cuentaActiva.total_pagos)}
                        </Text>
                        <Button
                            variant="light"
                            leftSection={<IconFileInvoice size={16} />}
                            onClick={() =>
                                fnDescargarFacturaPDF(cuentaActiva.factura.id)
                            }
                            loading={cargando}
                        >
                            Descargar PDF
                        </Button>
                    </>
                ) : (
                    <Text c="dimmed">
                        La cuenta fue cerrada sin emitir factura.
                    </Text>
                )}
                <Button onClick={onReset} mt="md">
                    Regresar al Listado de Cuentas
                </Button>
            </Stack>
        );
    }

    return (
        <Stack gap="lg">
            <ClienteFacturacionSelector
                consumidorFinal={consumidorFinal}
                huespedId={null}
                generarFactura={usarClienteRegistrado}
                setGenerarFactura={setUsarClienteRegistrado}
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
                <Button
                    leftSection={<IconFileInvoice size={16} />}
                    onClick={handleCerrarProceso}
                    loading={cargando}
                    color="blue"
                >
                    Generar Factura y Cerrar
                </Button>
            </Group>
        </Stack>
    );
};

// ─── Página Principal ─────────────────────────────────────────────────────────

const StepperView = () => {
    const { cuentaActiva, fnLimpiarCuentaActiva } = useVentaMostradorStore();
    const [active, setActive] = useState(0);

    const handleNext = () => setActive((cur) => Math.min(cur + 1, 2));
    const handleBack = () => setActive((cur) => Math.max(cur - 1, 0));

    const handleReset = () => {
        setActive(0);
        fnLimpiarCuentaActiva();
    };

    return (
        <>
            <Group mb="md">
                <ActionIcon variant="light" size="lg" onClick={handleReset}>
                    <IconArrowLeft size={20} />
                </ActionIcon>
                <Title order={4}>Cuenta Activa: {cuentaActiva.codigo}</Title>
                <Badge color="yellow">
                    {cuentaActiva.estado?.nombre_estado}
                </Badge>
            </Group>

            <Paper p="xl" withBorder>
                <Stepper
                    active={active}
                    onStepClick={() => {}} // bloqueo de navegacion manual
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
        </>
    );
};

const VentaMostradorPage = () => {
    const { cuentaActiva } = useVentaMostradorStore();

    return (
        <Container size="xl" my={20}>
            {!cuentaActiva && (
                <PrincipalSectionPage
                    title="Cuentas de Venta"
                    description="Gestión de cuentas abiertas y pagos para ventas sin reserva"
                    icon={<IconShoppingCart size={22} />}
                />
            )}

            {cuentaActiva ? <StepperView /> : <CuentasView />}

            {/* Modal de Descuentos para Venta Mostrador */}
            <VentaMostradorDescuentoModal />
        </Container>
    );
};

export default VentaMostradorPage;
