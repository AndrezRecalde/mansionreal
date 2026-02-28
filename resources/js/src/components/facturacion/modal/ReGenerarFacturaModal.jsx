import { useState, useEffect } from "react";
import {
    Modal,
    Stack,
    Alert,
    Text,
    Divider,
    Group,
    Button,
    Paper,
    Badge,
    Box,
    LoadingOverlay,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh, IconX } from "@tabler/icons-react";
import { ClienteFacturacionSelector } from "../../../components";
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
        consumidorFinal,
        fnCargarConsumidorFinal,
        fnLimpiarCliente,
    } = useClienteFacturacionStore();
    const { abrirModalReGenerarFactura, fnAbrirModalReGenerarFactura } =
        useUiFactura();

    const [generarFactura, setGenerarFactura] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);

    // Cargar consumidor final al abrir el modal
    useEffect(() => {
        if (abrirModalReGenerarFactura) {
            fnCargarConsumidorFinal();
        }

        return () => {
            handleLimpiar();
        };
    }, [abrirModalReGenerarFactura]);

    const handleLimpiar = () => {
        setGenerarFactura(false);
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

                {/* SELECTOR DE CLIENTE (componente reutilizable) */}
                <ClienteFacturacionSelector
                    consumidorFinal={consumidorFinal}
                    huespedId={activarReserva?.huesped_id}
                    generarFactura={generarFactura}
                    setGenerarFactura={setGenerarFactura}
                    clienteSeleccionado={clienteSeleccionado}
                    onClienteChange={setClienteSeleccionado}
                    solicitaDetallada={solicitaDetallada}
                    setSolicitaDetallada={setSolicitaDetallada}
                />

                {/* RESUMEN: Cliente Seleccionado */}
                {clienteSeleccionado && (
                    <Alert
                        color="teal"
                        title="Cliente Seleccionado"
                        variant="light"
                    >
                        <Group justify="space-between">
                            <Box>
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
                            </Box>
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
