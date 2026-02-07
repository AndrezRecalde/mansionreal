import { useState, useEffect } from "react";
import {
    Modal,
    Stack,
    Alert,
    Text,
    Divider,
    Group,
    Button,
    TextInput,
    Checkbox,
    Paper,
    Badge,
    Box,
    Switch,
    LoadingOverlay,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconRefresh,
    IconSearch,
    IconUserPlus,
    IconX,
} from "@tabler/icons-react";
import { ClienteFacturacionForm } from "../../../components";
import {
    useReservaDepartamentoStore,
    useFacturaStore,
    useClienteFacturacionStore,
    useUiFactura,
    useStorageField,
} from "../../../hooks";
import Swal from "sweetalert2";

export const ReGenerarFacturaModal = () => {
    const { activarReserva, fnBuscarReservas, fnAsignarReserva } =
        useReservaDepartamentoStore();
    const { storageFields } = useStorageField();
    const { cargando: cargandoFactura, fnGenerarFactura } = useFacturaStore();
    const {
        cargando: cargandoCliente,
        clienteExistente,
        datosPrellenados,
        consumidorFinal,
        fnBuscarPorIdentificacion,
        fnPrellenarDesdeHuesped,
        fnCargarConsumidorFinal,
        fnLimpiarCliente,
    } = useClienteFacturacionStore();
    const { abrirModalReGenerarFactura, fnAbrirModalReGenerarFactura } =
        useUiFactura();

    // Estados del formulario de cliente
    const [generarFactura, setGenerarFactura] = useState(false);
    const [dniBusqueda, setDniBusqueda] = useState("");
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);

    // Cargar consumidor final al montar
    useEffect(() => {
        if (abrirModalReGenerarFactura) {
            fnCargarConsumidorFinal();
        }

        return () => {
            handleLimpiar();
        };
    }, [abrirModalReGenerarFactura]);

    // Setear consumidor final automáticamente cuando switch está OFF
    useEffect(() => {
        if (!generarFactura && consumidorFinal) {
            setClienteSeleccionado(consumidorFinal);
            setBusquedaRealizada(false);
            setMostrarFormulario(false);
        }
    }, [generarFactura, consumidorFinal]);

    const handleBuscarCliente = async () => {
        if (!dniBusqueda.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Campo vacío",
                text: "Ingrese una identificación para buscar",
            });
            return;
        }

        setBusquedaRealizada(true);
        setMostrarFormulario(false);

        const resultado = await fnBuscarPorIdentificacion(dniBusqueda);

        if (resultado.existe && resultado.cliente) {
            setClienteSeleccionado(resultado.cliente);
        } else {
            setClienteSeleccionado(null);
        }
    };

    const handlePrellenarDesdeHuesped = async () => {
        if (!activarReserva || !activarReserva.huesped_id) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo obtener información del huésped",
            });
            return;
        }

        const resultado = await fnPrellenarDesdeHuesped(
            activarReserva.huesped_id,
        );

        if (resultado.existe && resultado.cliente_existente) {
            // Cliente ya existe en la base de datos
            setDniBusqueda(resultado.cliente_existente.identificacion);
            setClienteSeleccionado(resultado.cliente_existente);
            setBusquedaRealizada(true);
            setMostrarFormulario(false);
        } else {
            // Cliente no existe, mostrar formulario para crearlo con datos prellenados
            setMostrarFormulario(true);
            setBusquedaRealizada(false);
        }
    };

    const handleClienteCreado = (nuevoCliente) => {
        setClienteSeleccionado(nuevoCliente);
        setMostrarFormulario(false);
        setBusquedaRealizada(false);
        //setDniBusqueda("");
    };

    const handleLimpiar = () => {
        setDniBusqueda("");
        setBusquedaRealizada(false);
        setMostrarFormulario(false);
        setClienteSeleccionado(null);
        setSolicitaDetallada(false);
        fnLimpiarCliente();
    };

    const handleGenerar = async () => {
        if (!clienteSeleccionado) {
            Swal.fire({
                icon: "warning",
                title: "Cliente Requerido",
                text: "Debe seleccionar un cliente para generar la factura",
            });
            return;
        }

        const result = await Swal.fire({
            icon: "question",
            title: "¿Volver a generar factura?",
            html: `
                <div style="text-align: left;">
                    <p><strong>Reserva:</strong> ${activarReserva.codigo_reserva}</p>
                    <p><strong>Cliente:</strong> ${clienteSeleccionado.nombres_completos}</p>
                    <p style="color: #ea580c; font-weight: bold;">Esta es una RE-FACTURACIÓN</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Sí, generar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ea580c",
        });

        if (result.isConfirmed) {
            try {
                const facturaGenerada = await fnGenerarFactura({
                    reserva_id: activarReserva.reserva_id,
                    cliente_facturacion_id: clienteSeleccionado.id,
                    solicita_factura_detallada: solicitaDetallada,
                });

                if (facturaGenerada) {
                    await Swal.fire({
                        icon: "success",
                        title: "Factura Re-Generada",
                        text: `Factura ${facturaGenerada.numero_factura} generada exitosamente`,
                    });

                    handleClose();

                    if (fnBuscarReservas) {
                        fnBuscarReservas(storageFields);
                    }
                }
            } catch (error) {
                console.error("Error al generar factura:", error);
            }
        }
    };

    const handleClose = () => {
        fnAbrirModalReGenerarFactura(false);
        fnAsignarReserva(null);
        handleLimpiar();
    };

    const puedeGenerar = Boolean(clienteSeleccionado && clienteSeleccionado.id);

    if (!activarReserva) return null;

    return (
        <Modal
            opened={abrirModalReGenerarFactura}
            onClose={handleClose}
            title={
                <Group>
                    <IconRefresh size={24} color="#ea580c" />
                    <Text size="lg" fw={700}>
                        Re-Generar Factura
                    </Text>
                </Group>
            }
            size="lg"
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            <LoadingOverlay
                visible={cargandoFactura || cargandoCliente}
                overlayProps={{ blur: 2 }}
            />

            <Stack gap="md">
                {/* ADVERTENCIA */}
                <Alert
                    color="orange"
                    variant="light"
                    icon={<IconAlertCircle />}
                    title="Re-Facturación"
                >
                    <Text size="sm">
                        Esta reserva ya tuvo una factura que fue anulada. Se
                        generará una <strong>nueva factura</strong> con los
                        mismos consumos.
                    </Text>
                </Alert>

                {/* INFORMACIÓN DE LA RESERVA */}
                <Paper p="md" withBorder style={{ background: "#fafafa" }}>
                    <Text size="sm" fw={600} mb="xs">
                        Información de la Reserva
                    </Text>
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                            Código:
                        </Text>
                        <Badge size="lg" variant="light">
                            {activarReserva.codigo_reserva}
                        </Badge>
                    </Group>
                    <Group justify="space-between" mt="xs">
                        <Text size="sm" c="dimmed">
                            Huésped:
                        </Text>
                        <Text size="sm" fw={500}>
                            {activarReserva.huesped}
                        </Text>
                    </Group>
                    {activarReserva.departamento && (
                        <Group justify="space-between" mt="xs">
                            <Text size="sm" c="dimmed">
                                Departamento:
                            </Text>
                            <Text size="sm" fw={500}>
                                {activarReserva.tipo_departamento} -{" "}
                                {activarReserva.numero_departamento}
                            </Text>
                        </Group>
                    )}
                </Paper>

                <Divider label="DATOS DE FACTURACIÓN" labelPosition="center" />

                {/* SWITCH: Consumidor Final vs Cliente Registrado */}
                <Paper p="md" withBorder style={{ background: "#f8f9fa" }}>
                    <Switch
                        size="md"
                        label="Generar factura con datos de cliente registrado"
                        description={
                            generarFactura
                                ? "Se generará factura con datos del cliente registrado"
                                : "Se generará factura a nombre de CONSUMIDOR FINAL"
                        }
                        checked={generarFactura}
                        onChange={(event) => {
                            const checked = event.currentTarget.checked;
                            setGenerarFactura(checked);
                            handleLimpiar();
                        }}
                        styles={{
                            label: { fontWeight: 600 },
                        }}
                    />
                </Paper>

                {/* OPCIÓN 1: Consumidor Final */}
                {!generarFactura && consumidorFinal && (
                    <Alert
                        color="blue"
                        variant="light"
                        title="Consumidor Final Seleccionado"
                    >
                        <Text size="sm">
                            La factura se generará a nombre de{" "}
                            <strong>CONSUMIDOR FINAL</strong>
                        </Text>
                        <Text size="sm" mt="xs" c="dimmed">
                            Identificación: {consumidorFinal.identificacion}
                        </Text>
                    </Alert>
                )}

                {/* OPCIÓN 2: Cliente Registrado */}
                {generarFactura && (
                    <>
                        <Divider
                            label="Buscar o Crear Cliente"
                            labelPosition="center"
                        />

                        <Group grow align="flex-end">
                            <TextInput
                                label="Identificación del Cliente"
                                placeholder="Ej: 1712345678"
                                value={dniBusqueda}
                                onChange={(e) => setDniBusqueda(e.target.value)}
                                leftSection={<IconSearch size={16} />}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleBuscarCliente();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleBuscarCliente}
                                loading={cargandoCliente}
                            >
                                Buscar
                            </Button>
                        </Group>

                        <Button
                            variant="light"
                            onClick={handlePrellenarDesdeHuesped}
                        >
                            Prellenar con datos del huésped
                        </Button>

                        {busquedaRealizada &&
                            clienteExistente &&
                            clienteSeleccionado && (
                                <Alert
                                    color="green"
                                    variant="light"
                                    title="Cliente Encontrado"
                                >
                                    <Text size="sm">
                                        {clienteSeleccionado.nombres_completos}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {
                                            clienteSeleccionado.tipo_identificacion
                                        }
                                        : {clienteSeleccionado.identificacion}
                                    </Text>
                                </Alert>
                            )}

                        {busquedaRealizada &&
                            !clienteExistente &&
                            !mostrarFormulario && (
                                <Alert
                                    color="orange"
                                    variant="light"
                                    title="Cliente No Encontrado"
                                >
                                    <Text size="sm" mb="sm">
                                        No existe un cliente con la
                                        identificación ingresada.
                                    </Text>
                                    <Button
                                        size="sm"
                                        leftSection={<IconUserPlus size={16} />}
                                        onClick={() =>
                                            setMostrarFormulario(true)
                                        }
                                    >
                                        Registrar nuevo cliente
                                    </Button>
                                </Alert>
                            )}

                        {mostrarFormulario && (
                            <Paper p="md" withBorder>
                                <Text size="sm" fw={600} mb="md">
                                    Crear nuevo cliente
                                </Text>
                                <ClienteFacturacionForm
                                    dniBusqueda={dniBusqueda}
                                    datosPrellenados={datosPrellenados}
                                    onClienteCreado={handleClienteCreado}
                                    onCancelar={() => {
                                        setMostrarFormulario(false);
                                        handleLimpiar();
                                    }}
                                />
                            </Paper>
                        )}

                        {clienteSeleccionado &&
                            clienteSeleccionado.id !== consumidorFinal?.id && (
                                <Checkbox
                                    label="Solicita factura con datos completos (para deducción de impuestos)"
                                    description="Marque esta opción si el cliente requiere factura detallada para fines tributarios"
                                    checked={solicitaDetallada}
                                    onChange={(e) =>
                                        setSolicitaDetallada(
                                            e.currentTarget.checked,
                                        )
                                    }
                                />
                            )}
                    </>
                )}

                {/* RESUMEN: Cliente Seleccionado */}
                {clienteSeleccionado && (
                    <Alert
                        color="teal"
                        title="Cliente Seleccionado"
                        variant="light"
                    >
                        <Group justify="space-between">
                            <div>
                                <Text size="sm" fw={600}>
                                    {clienteSeleccionado.nombres_completos}
                                </Text>
                                {clienteSeleccionado.identificacion && (
                                    <Text size="sm" c="dimmed">
                                        {clienteSeleccionado.tipo_identificacion ||
                                            "Identificación"}
                                        : {clienteSeleccionado.identificacion}
                                    </Text>
                                )}
                                {solicitaDetallada && (
                                    <Badge color="teal" size="sm" mt="xs">
                                        Factura Detallada
                                    </Badge>
                                )}
                            </div>
                        </Group>
                    </Alert>
                )}

                {/* BOTONES DE ACCIÓN */}
                <Group justify="space-between" mt="xl">
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={handleClose}
                        leftSection={<IconX size={18} />}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="orange"
                        onClick={handleGenerar}
                        disabled={!puedeGenerar}
                        leftSection={<IconRefresh size={18} />}
                        loading={cargandoFactura}
                    >
                        Re-Generar Factura
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};
