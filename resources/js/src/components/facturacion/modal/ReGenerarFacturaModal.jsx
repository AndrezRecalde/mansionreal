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
    NumberInput,
    SegmentedControl,
    Textarea,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconRefresh,
    IconSearch,
    IconUserPlus,
    IconX,
    IconDiscount,
    IconPercentage,
    IconCurrencyDollar,
} from "@tabler/icons-react";
import { ClienteFacturacionForm } from "../../../components";
import {
    useReservaDepartamentoStore,
    useFacturaStore,
    useClienteFacturacionStore,
    useUiFactura,
} from "../../../hooks";
import Swal from "sweetalert2";
import {
    formatearMonto,
    formatearPorcentaje,
    normalizarNumero,
} from "../../../helpers/fnHelper";

/**
 * Modal completo para re-generar factura después de anulación
 * ✅ CON SOPORTE PARA DESCUENTOS
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

    // Estados del formulario de cliente
    const [generarFactura, setGenerarFactura] = useState(false);
    const [dniBusqueda, setDniBusqueda] = useState("");
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);

    // ✅ NUEVOS: Estados para descuento
    const [aplicarDescuento, setAplicarDescuento] = useState(false);
    const [descuento, setDescuento] = useState(0);
    const [tipoDescuento, setTipoDescuento] = useState("MONTO_FIJO");
    const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
    const [motivoDescuento, setMotivoDescuento] = useState("");

    // Cargar consumidor final al montar
    useEffect(() => {
        if (abrirModalReGenerarFactura) {
            fnCargarConsumidorFinal();
        }
    }, [abrirModalReGenerarFactura]);

    // Auto-seleccionar consumidor final si el switch está en ON
    useEffect(() => {
        if (!generarFactura && consumidorFinal && !clienteSeleccionado) {
            // Si NO genera factura → Consumidor Final
            setClienteSeleccionado({
                id: consumidorFinal.id,
                nombres_completos: "CONSUMIDOR FINAL",
                identificacion: consumidorFinal.identificacion,
            });
        } else if (generarFactura) {
            // Si genera factura → Limpiar
            setClienteSeleccionado(null);
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

        if (resultado?.existe && resultado?.cliente) {
            setClienteSeleccionado({
                id: resultado.cliente.id,
                nombres_completos: resultado.cliente.nombres_completos,
                identificacion: resultado.cliente.identificacion,
                tipo_identificacion: resultado.cliente.tipo_identificacion,
            });
        } else {
            setClienteSeleccionado(null);
        }
    };

    const handlePrellenarDesdeHuesped = async () => {
        if (!activarReserva?.huesped_id) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se encontró información del huésped",
            });
            return;
        }

        const resultado = await fnPrellenarDesdeHuesped(
            activarReserva.huesped_id,
        );

        if (resultado?.existe && resultado?.cliente_existente) {
            setDniBusqueda(resultado.cliente_existente.identificacion);
            setClienteSeleccionado({
                id: resultado.cliente_existente.id,
                nombres_completos:
                    resultado.cliente_existente.nombres_completos,
                identificacion: resultado.cliente_existente.identificacion,
                tipo_identificacion:
                    resultado.cliente_existente.tipo_identificacion,
            });
            setBusquedaRealizada(true);
            setMostrarFormulario(false);
        } else {
            setMostrarFormulario(true);
            setBusquedaRealizada(false);
        }
    };

    const handleClienteCreado = (nuevoCliente) => {
        setClienteSeleccionado({
            id: nuevoCliente.id,
            nombres_completos: nuevoCliente.nombres_completos,
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

        // Limpiar descuento
        setAplicarDescuento(false);
        setDescuento(0);
        setPorcentajeDescuento(0);
        setMotivoDescuento("");
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

        // ✅ Validar descuento si está activado
        if (aplicarDescuento) {
            const montoDescuento = normalizarNumero(descuento);
            const porcentaje = normalizarNumero(porcentajeDescuento);

            if (tipoDescuento === "MONTO_FIJO") {
                if (montoDescuento <= 0) {
                    Swal.fire({
                        icon: "warning",
                        title: "Descuento inválido",
                        text: "El monto del descuento debe ser mayor a $0",
                    });
                    return;
                }
            } else if (tipoDescuento === "PORCENTAJE") {
                if (porcentaje <= 0 || porcentaje > 100) {
                    Swal.fire({
                        icon: "warning",
                        title: "Porcentaje inválido",
                        text: "El porcentaje debe estar entre 1% y 100%",
                    });
                    return;
                }
            }

            if (porcentaje > 50 && !motivoDescuento.trim()) {
                Swal.fire({
                    icon: "warning",
                    title: "Motivo requerido",
                    text: "Los descuentos mayores al 50% requieren justificación obligatoria",
                });
                return;
            }
        }

        const result = await Swal.fire({
            icon: "question",
            title: "¿Volver a generar factura?",
            html: `
                <div style="text-align: left;">
                    <p><strong>Reserva:</strong> ${activarReserva.codigo_reserva}</p>
                    <p><strong>Cliente:</strong> ${clienteSeleccionado.nombres_completos}</p>
                    ${
                        aplicarDescuento
                            ? `<p><strong>Descuento:</strong> ${
                                  tipoDescuento === "MONTO_FIJO"
                                      ? "$" + formatearMonto(descuento)
                                      : formatearPorcentaje(
                                            porcentajeDescuento,
                                        ) + "%"
                              }</p>`
                            : ""
                    }
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

                    // ✅ NUEVO: Enviar datos de descuento
                    descuento: aplicarDescuento
                        ? tipoDescuento === "MONTO_FIJO"
                            ? normalizarNumero(descuento)
                            : 0
                        : 0,
                    tipo_descuento: aplicarDescuento ? tipoDescuento : null,
                    porcentaje_descuento:
                        aplicarDescuento && tipoDescuento === "PORCENTAJE"
                            ? normalizarNumero(porcentajeDescuento)
                            : null,
                    motivo_descuento: aplicarDescuento ? motivoDescuento : null,
                });

                if (facturaGenerada) {
                    await Swal.fire({
                        icon: "success",
                        title: "Factura Re-Generada",
                        text: `Factura ${facturaGenerada.numero_factura} generada exitosamente`,
                        timer: 3000,
                        showConfirmButton: true,
                    });

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
                    paddingBottom: 16,
                    marginBottom: 16,
                },
            }}
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            <LoadingOverlay
                visible={cargandoFactura || cargandoCliente}
                overlayProps={{ blur: 2 }}
            />

            <Stack gap="lg">
                {/* Información de la reserva */}
                <Alert
                    icon={<IconAlertCircle size={20} />}
                    title="Información de la Reserva"
                    color="orange"
                >
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                Código de Reserva:
                            </Text>
                            <Badge color="orange" size="lg">
                                {activarReserva.codigo_reserva}
                            </Badge>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>
                                Huésped:
                            </Text>
                            <Text size="sm">
                                {activarReserva.nombres_huesped}{" "}
                                {activarReserva.apellidos_huesped}
                            </Text>
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

                {/* SWITCH:  Consumidor Final vs Cliente Registrado */}
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
                        <Text size="xs" mt="sm" c="dimmed">
                            💡 Puede aplicar un descuento más abajo si lo desea
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

                        <Button
                            variant="light"
                            onClick={handlePrellenarDesdeHuesped}
                            leftSection={<IconUserPlus size={16} />}
                            fullWidth
                        >
                            Prellenar con datos del huésped
                        </Button>

                        {busquedaRealizada &&
                            clienteExistente &&
                            !mostrarFormulario && (
                                <Alert color="green" title="Cliente Encontrado">
                                    <Text size="sm" fw={600}>
                                        {clienteExistente.nombres_completos}
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

                {/* ✅ SECCIÓN DE DESCUENTO (OPCIONAL) */}
                {clienteSeleccionado && (
                    <>
                        <Divider
                            my="md"
                            label={
                                <Group gap="xs">
                                    <IconDiscount size={18} />
                                    <Text>Descuento (Opcional)</Text>
                                </Group>
                            }
                            labelPosition="center"
                        />

                        <Paper p="md" withBorder>
                            <Stack gap="md">
                                <Switch
                                    size="md"
                                    label="Aplicar descuento a esta factura"
                                    description="Agregue un descuento al total de la factura"
                                    checked={aplicarDescuento}
                                    onChange={(event) => {
                                        setAplicarDescuento(
                                            event.currentTarget.checked,
                                        );
                                        if (!event.currentTarget.checked) {
                                            setDescuento(0);
                                            setPorcentajeDescuento(0);
                                            setMotivoDescuento("");
                                        }
                                    }}
                                />

                                {aplicarDescuento && (
                                    <Stack gap="md">
                                        <SegmentedControl
                                            value={tipoDescuento}
                                            onChange={setTipoDescuento}
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
                                            fullWidth
                                        />

                                        {tipoDescuento === "MONTO_FIJO" ? (
                                            <NumberInput
                                                label="Monto del descuento"
                                                placeholder="Ej: 50. 00"
                                                description="Ingrese el monto exacto a descontar"
                                                prefix="$"
                                                min={0}
                                                decimalScale={2}
                                                fixedDecimalScale
                                                value={descuento}
                                                onChange={(val) =>
                                                    setDescuento(
                                                        normalizarNumero(val),
                                                    )
                                                }
                                                leftSection={
                                                    <IconCurrencyDollar
                                                        size={16}
                                                    />
                                                }
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
                                                value={porcentajeDescuento}
                                                onChange={(val) =>
                                                    setPorcentajeDescuento(
                                                        normalizarNumero(val),
                                                    )
                                                }
                                                leftSection={
                                                    <IconPercentage size={16} />
                                                }
                                                required
                                            />
                                        )}

                                        <Textarea
                                            label="Motivo del descuento"
                                            placeholder="Ej:  Promoción de temporada, Cliente VIP, Cortesía..."
                                            description={
                                                normalizarNumero(
                                                    porcentajeDescuento,
                                                ) > 50
                                                    ? "⚠️ Requerido para descuentos mayores al 50%"
                                                    : "Opcional - Ayuda para auditoría"
                                            }
                                            value={motivoDescuento}
                                            onChange={(e) =>
                                                setMotivoDescuento(
                                                    e.target.value,
                                                )
                                            }
                                            minRows={2}
                                            maxRows={4}
                                            error={
                                                normalizarNumero(
                                                    porcentajeDescuento,
                                                ) > 50 &&
                                                !motivoDescuento.trim()
                                                    ? "Motivo obligatorio para descuentos mayores al 50%"
                                                    : null
                                            }
                                        />

                                        {(normalizarNumero(descuento) > 0 ||
                                            normalizarNumero(
                                                porcentajeDescuento,
                                            ) > 0) && (
                                            <Alert
                                                color="blue"
                                                title="Vista previa"
                                            >
                                                <Stack gap="xs">
                                                    {tipoDescuento ===
                                                    "MONTO_FIJO" ? (
                                                        <Text size="sm">
                                                            Se descontará:{" "}
                                                            <strong>
                                                                $
                                                                {formatearMonto(
                                                                    descuento,
                                                                )}
                                                            </strong>
                                                        </Text>
                                                    ) : (
                                                        <Text size="sm">
                                                            Se descontará:{" "}
                                                            <strong>
                                                                {formatearPorcentaje(
                                                                    porcentajeDescuento,
                                                                )}
                                                                %
                                                            </strong>{" "}
                                                            del total
                                                        </Text>
                                                    )}
                                                    <Text size="xs" c="dimmed">
                                                        El descuento se aplicará
                                                        al total de la factura
                                                        antes de impuestos
                                                    </Text>
                                                </Stack>
                                            </Alert>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </Paper>
                    </>
                )}

                {/* RESUMEN:  Cliente Seleccionado */}
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
