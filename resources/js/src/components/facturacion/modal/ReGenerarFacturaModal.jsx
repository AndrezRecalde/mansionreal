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
    IconCheck,
    IconX,
} from "@tabler/icons-react";
import { ClienteFacturacionForm } from "../../../components";
import {
    useReservaDepartamentoStore,
    useFacturaStore,
    useClienteFacturacionStore,
    useUiFactura,
} from "../../../hooks";
import Swal from "sweetalert2";

/**
 * Modal completo para re-generar factura después de anulación
 */
export const ReGenerarFacturaModal = () => {
    const { activarReserva, fnBuscarReservas, fnAsignarReserva } =
        useReservaDepartamentoStore();
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

    // Estados del formulario
    const [usarConsumidorFinal, setUsarConsumidorFinal] = useState(true);
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
    }, [abrirModalReGenerarFactura]);

    // Auto-seleccionar consumidor final si el switch está en ON
    useEffect(() => {
        if (usarConsumidorFinal && consumidorFinal && !clienteSeleccionado) {
            setClienteSeleccionado({
                id: consumidorFinal.id,
                nombre: "CONSUMIDOR FINAL",
                identificacion: consumidorFinal.identificacion,
            });
        } else if (!usarConsumidorFinal) {
            setClienteSeleccionado(null);
        }
    }, [usarConsumidorFinal, consumidorFinal]);

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

        const resultado = await fnBuscarPorIdentificacion(dniBusqueda);

        if (resultado?.existe && resultado?.cliente) {
            // Cliente encontrado
            setClienteSeleccionado({
                id: resultado.cliente.id,
                nombre: `${resultado.cliente.apellidos} ${resultado.cliente.nombres}`,
                identificacion: resultado.cliente.identificacion,
                tipo_identificacion: resultado.cliente.tipo_identificacion,
            });
            setMostrarFormulario(false);
        } else {
            // No existe, mostrar formulario
            setClienteSeleccionado(null);
            setMostrarFormulario(true);
        }
    };

    const handlePrellenarDesdeHuesped = async () => {
        if (!activarReserva?.huesped_id) return;

        const resultado = await fnPrellenarDesdeHuesped(
            activarReserva.huesped_id
        );

        if (resultado?.existe && resultado?.cliente_existente) {
            // Cliente ya existe
            setDniBusqueda(resultado.cliente_existente.identificacion);
            setClienteSeleccionado({
                id: resultado.cliente_existente.id,
                nombre: `${resultado.cliente_existente.apellidos} ${resultado.cliente_existente.nombres}`,
                identificacion: resultado.cliente_existente.identificacion,
                tipo_identificacion:
                    resultado.cliente_existente.tipo_identificacion,
            });
            setBusquedaRealizada(true);
            setMostrarFormulario(false);
        } else {
            // No existe, mostrar formulario prellenado
            setMostrarFormulario(true);
            setBusquedaRealizada(false);
        }
    };

    const handleClienteCreado = (nuevoCliente) => {
        setClienteSeleccionado({
            id: nuevoCliente.id,
            nombre: `${nuevoCliente.apellidos} ${nuevoCliente.nombres}`,
            identificacion: nuevoCliente.identificacion,
            tipo_identificacion: nuevoCliente.tipo_identificacion,
        });
        setMostrarFormulario(false);
        setBusquedaRealizada(false);
    };

    const handleLimpiar = () => {
        fnLimpiarCliente();
        setDniBusqueda("");
        setBusquedaRealizada(false);
        setMostrarFormulario(false);
        setClienteSeleccionado(null);
        setSolicitaDetallada(false);
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
                    <p><strong>Cliente:</strong> ${clienteSeleccionado.nombre}</p>
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
                        title: "✅ Factura Re-Generada",
                        text: `Factura ${facturaGenerada.numero_factura} generada exitosamente`,
                        timer: 3000,
                        showConfirmButton: true,
                    });

                    // Recargar reservas y cerrar modal
                    await fnBuscarReservas({
                        codigo_reserva: activarReserva.codigo_reserva,
                    });
                    handleClose();
                    fnAsignarReserva(null);
                }
            } catch (error) {
                console.error("Error al re-generar factura:", error);
            }
        }
    };

    const handleClose = () => {
        handleLimpiar();
        fnAsignarReserva(null);
        fnAbrirModalReGenerarFactura(false);
    };

    if (!activarReserva) return null;

    const puedeGenerar = clienteSeleccionado !== null;

    return (
        <Modal
            opened={abrirModalReGenerarFactura}
            onClose={handleClose}
            title={
                <Group>
                    <IconRefresh size={24} color="#ea580c" />
                    <Text fw={700} size="lg">
                        Volver a Generar Factura
                    </Text>
                </Group>
            }
            size="xl"
            padding="xl"
            styles={{
                header: {
                    borderBottom: "1px solid #e9ecef",
                    paddingBottom: "1rem",
                },
            }}
        >
            <LoadingOverlay
                visible={cargandoFactura || cargandoCliente}
                overlayProps={{ blur: 2 }}
            />

            <Stack gap="lg">
                {/* ================================================ */}
                {/* ALERTA:  Información de la factura anulada */}
                {/* ================================================ */}
                <Alert
                    icon={<IconAlertCircle size={18} />}
                    title="Re-Facturación de Reserva"
                    color="orange"
                    variant="light"
                >
                    <Stack gap="xs">
                        <Text size="sm">
                            Esta reserva tuvo una factura{" "}
                            <strong>ANULADA</strong> anteriormente.
                        </Text>
                        <Divider />
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                Reserva:
                            </Text>
                            <Badge color="blue" size="lg">
                                {activarReserva.codigo_reserva}
                            </Badge>
                        </Group>
                        {activarReserva.factura && (
                            <>
                                <Group justify="space-between">
                                    <Text size="sm" fw={500}>
                                        Factura Anulada:
                                    </Text>
                                    <Text size="sm" c="red" fw={600}>
                                        {activarReserva.factura.numero_factura}
                                    </Text>
                                </Group>
                                {activarReserva.factura.motivo_anulacion && (
                                    <Box>
                                        <Text size="xs" c="dimmed">
                                            <strong>Motivo:</strong>{" "}
                                            {
                                                activarReserva.factura
                                                    .motivo_anulacion
                                            }
                                        </Text>
                                    </Box>
                                )}
                            </>
                        )}
                    </Stack>
                </Alert>

                <Divider label="DATOS DE FACTURACIÓN" labelPosition="center" />

                {/* ================================================ */}
                {/* SWITCH: Consumidor Final vs Cliente Registrado */}
                {/* ================================================ */}
                <Paper p="md" withBorder style={{ background: "#f8f9fa" }}>
                    <Switch
                        size="md"
                        label="¿Usar CONSUMIDOR FINAL?"
                        description={
                            usarConsumidorFinal
                                ? "Se generará factura genérica"
                                : "Se generará factura con datos del cliente"
                        }
                        checked={usarConsumidorFinal}
                        onChange={(e) => {
                            setUsarConsumidorFinal(e.currentTarget.checked);
                            handleLimpiar();
                        }}
                        styles={{
                            label: { fontWeight: 600 },
                        }}
                    />
                </Paper>

                {/* ================================================ */}
                {/* OPCIÓN 1: Consumidor Final */}
                {/* ================================================ */}
                {usarConsumidorFinal && consumidorFinal && (
                    <Alert
                        color="blue"
                        variant="light"
                        title="✅ Consumidor Final Seleccionado"
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

                {/* ================================================ */}
                {/* OPCIÓN 2: Cliente Registrado */}
                {/* ================================================ */}
                {!usarConsumidorFinal && (
                    <>
                        <Divider
                            label="Buscar o Crear Cliente"
                            labelPosition="center"
                        />

                        {/* Buscar por identificación */}
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
                                disabled={cargandoCliente}
                            />
                            <Button
                                onClick={handleBuscarCliente}
                                leftSection={<IconSearch size={16} />}
                                loading={cargandoCliente}
                            >
                                Buscar
                            </Button>
                        </Group>

                        {/* Botón prellenar desde huésped */}
                        <Button
                            variant="light"
                            onClick={handlePrellenarDesdeHuesped}
                            leftSection={<IconUserPlus size={16} />}
                            fullWidth
                        >
                            Prellenar con datos del huésped
                        </Button>

                        {/* Cliente encontrado */}
                        {busquedaRealizada &&
                            clienteExistente &&
                            !mostrarFormulario && (
                                <Alert
                                    color="green"
                                    title="✅ Cliente Encontrado"
                                >
                                    <Text size="sm" fw={600}>
                                        {clienteExistente.apellidos}{" "}
                                        {clienteExistente.nombres}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {clienteExistente.tipo_identificacion}:{" "}
                                        {clienteExistente.identificacion}
                                    </Text>
                                    <Group mt="md">
                                        <Button
                                            size="xs"
                                            variant="light"
                                            onClick={handleLimpiar}
                                        >
                                            Buscar otro
                                        </Button>
                                    </Group>
                                </Alert>
                            )}

                        {/* Formulario para crear nuevo cliente */}
                        {mostrarFormulario && (
                            <Paper p="md" withBorder>
                                <Text size="sm" fw={600} mb="md">
                                    Crear nuevo cliente
                                </Text>
                                <ClienteFacturacionForm
                                    datosPrellenados={datosPrellenados}
                                    onClienteCreado={handleClienteCreado}
                                    onCancelar={() => {
                                        setMostrarFormulario(false);
                                        handleLimpiar();
                                    }}
                                />
                            </Paper>
                        )}

                        {/* Checkbox:  Factura detallada */}
                        {clienteSeleccionado &&
                            clienteSeleccionado.id !== consumidorFinal?.id && (
                                <Checkbox
                                    label="Solicita factura con datos completos (para deducción de impuestos)"
                                    description="Marque esta opción si el cliente requiere factura detallada para fines tributarios"
                                    checked={solicitaDetallada}
                                    onChange={(e) =>
                                        setSolicitaDetallada(
                                            e.currentTarget.checked
                                        )
                                    }
                                />
                            )}
                    </>
                )}

                {/* ================================================ */}
                {/* RESUMEN:  Cliente Seleccionado */}
                {/* ================================================ */}
                {clienteSeleccionado && (
                    <Alert
                        color="teal"
                        title="Cliente Seleccionado"
                        variant="light"
                    >
                        <Group justify="space-between">
                            <div>
                                <Text size="sm" fw={600}>
                                    {clienteSeleccionado.nombre}
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

                {/* ================================================ */}
                {/* BOTONES DE ACCIÓN */}
                {/* ================================================ */}
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
