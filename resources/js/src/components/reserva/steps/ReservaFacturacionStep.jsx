import { useState, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    NumberInput,
    Paper,
    SegmentedControl,
    Stack,
    Switch,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconArrowRight,
    IconSearch,
    IconUserPlus,
    IconDiscount,
    IconPercentage,
    IconCurrencyDollar,
} from "@tabler/icons-react";
import { ClienteFacturacionForm } from "../../../components";
import { useClienteFacturacionStore } from "../../../hooks";
import Swal from "sweetalert2";
import { formatearMonto, formatearPorcentaje, normalizarNumero } from "../../../helpers/fnHelper";

export const ReservaFacturacionStep = ({
    datos_reserva,
    generarFactura,
    setGenerarFactura,
    datosFacturacion,
    setDatosFacturacion,
    consumidorFinal,
    onNext,
    onBack,
}) => {
    const [dniBusqueda, setDniBusqueda] = useState("");
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);

    // ✅ NUEVOS:  Estados para descuento
    const [aplicarDescuento, setAplicarDescuento] = useState(false);
    const [descuento, setDescuento] = useState(0);
    const [tipoDescuento, setTipoDescuento] = useState("MONTO_FIJO");
    const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
    const [motivoDescuento, setMotivoDescuento] = useState("");

    const {
        cargando,
        clienteExistente,
        datosPrellenados,
        fnBuscarPorIdentificacion,
        fnPrellenarDesdeHuesped,
        fnLimpiarCliente,
    } = useClienteFacturacionStore();

    // ================================================================
    // Efecto:  Si switch OFF, setear consumidor final automáticamente
    // ================================================================
    useEffect(() => {
        if (!generarFactura && consumidorFinal) {
            setDatosFacturacion({
                cliente_id: consumidorFinal.id,
                cliente_nombres_completos: "CONSUMIDOR FINAL",
                cliente_identificacion: consumidorFinal.identificacion,
                solicita_detallada: false,
            });
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
            setDatosFacturacion({
                cliente_id: resultado.cliente.id,
                cliente_nombres_completos: resultado.cliente.nombres_completos,
                cliente_identificacion: resultado.cliente.identificacion,
                solicita_detallada: solicitaDetallada,
            });
        } else {
            setDatosFacturacion(null);
        }
    };

    const handlePrellenarDesdeHuesped = async () => {
        const resultado = await fnPrellenarDesdeHuesped(
            datos_reserva.huesped_id,
        );

        if (resultado.existe && resultado.cliente_existente) {
            setDniBusqueda(resultado.cliente_existente.identificacion);
            setDatosFacturacion({
                cliente_id: resultado.cliente_existente.id,
                cliente_nombres_completos:
                    resultado.cliente_existente.nombres_completos,
                cliente_identificacion:
                    resultado.cliente_existente.identificacion,
                solicita_detallada: solicitaDetallada,
            });
            setBusquedaRealizada(true);
        } else {
            setMostrarFormulario(true);
            setBusquedaRealizada(true);
        }
    };

    const handleClienteCreado = (nuevoCliente) => {
        setDatosFacturacion({
            cliente_id: nuevoCliente.id,
            cliente_nombres_completos: nuevoCliente.nombres_completos,
            cliente_identificacion: nuevoCliente.identificacion,
            solicita_detallada: solicitaDetallada,
        });
        setMostrarFormulario(false);
    };

    const handleLimpiar = () => {
        setDniBusqueda("");
        setBusquedaRealizada(false);
        setMostrarFormulario(false);
        setDatosFacturacion(null);
        setSolicitaDetallada(false);

        // Limpiar descuento
        setAplicarDescuento(false);
        setDescuento(0);
        setPorcentajeDescuento(0);
        setMotivoDescuento("");

        fnLimpiarCliente();
    };

    // ✅ NUEVO: Validar y continuar al siguiente paso
    const handleContinuar = () => {
        if (!datosFacturacion || !datosFacturacion.cliente_id) {
            Swal.fire({
                icon: "warning",
                title: "Seleccione un cliente",
                text: "Debe seleccionar o crear un cliente para continuar",
            });
            return;
        }

        // Validar descuento si está activado
        if (aplicarDescuento) {
            if (tipoDescuento === "MONTO_FIJO") {
                if (descuento <= 0) {
                    Swal.fire({
                        icon: "warning",
                        title: "Descuento inválido",
                        text: "El monto del descuento debe ser mayor a $0",
                    });
                    return;
                }
            } else if (tipoDescuento === "PORCENTAJE") {
                if (porcentajeDescuento <= 0 || porcentajeDescuento > 100) {
                    Swal.fire({
                        icon: "warning",
                        title: "Porcentaje inválido",
                        text: "El porcentaje debe estar entre 1% y 100%",
                    });
                    return;
                }
            }

            // Validar motivo para descuentos grandes
            if (porcentajeDescuento > 50 && !motivoDescuento.trim()) {
                Swal.fire({
                    icon: "warning",
                    title: "Motivo requerido",
                    text: "Los descuentos mayores al 50% requieren justificación obligatoria",
                });
                return;
            }
        }

        // Actualizar datosFacturacion con descuento
        setDatosFacturacion({
            ...datosFacturacion,
            solicita_detallada: solicitaDetallada,
            descuento: aplicarDescuento
                ? tipoDescuento === "MONTO_FIJO"
                    ? descuento
                    : 0
                : 0,
            tipo_descuento: aplicarDescuento ? tipoDescuento : null,
            porcentaje_descuento:
                aplicarDescuento && tipoDescuento === "PORCENTAJE"
                    ? porcentajeDescuento
                    : null,
            motivo_descuento: aplicarDescuento ? motivoDescuento : null,
        });

        onNext();
    };

    return (
        <Box mt="xl">
            <Stack gap="lg">
                {/* Switch para decidir tipo de facturación */}
                <Paper p="md" withBorder>
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
                    />
                </Paper>

                {/* ========================================= */}
                {/* Opción CONSUMIDOR FINAL */}
                {/* ========================================= */}
                {!generarFactura && consumidorFinal && (
                    <Alert
                        color="blue"
                        title="✅ Consumidor Final Seleccionado"
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

                {/* ========================================= */}
                {/* Opción CLIENTE REGISTRADO */}
                {/* ========================================= */}
                {generarFactura && (
                    <>
                        <Divider label="Buscar o Crear Cliente" />

                        {/* Búsqueda por DNI */}
                        <Paper p="md" withBorder>
                            <Stack gap="md">
                                <Text size="sm" fw={500}>
                                    Buscar cliente existente por identificación
                                </Text>
                                <Group>
                                    <TextInput
                                        placeholder="Ingrese cédula, RUC o pasaporte"
                                        value={dniBusqueda}
                                        onChange={(e) =>
                                            setDniBusqueda(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleBuscarCliente();
                                            }
                                        }}
                                        style={{ flex: 1 }}
                                        leftSection={<IconSearch size={16} />}
                                    />
                                    <Button
                                        onClick={handleBuscarCliente}
                                        loading={cargando}
                                        leftSection={<IconSearch size={16} />}
                                    >
                                        Buscar
                                    </Button>
                                </Group>

                                <Button
                                    variant="light"
                                    onClick={handlePrellenarDesdeHuesped}
                                    leftSection={<IconUserPlus size={16} />}
                                >
                                    Usar datos del huésped de esta reserva
                                </Button>
                            </Stack>
                        </Paper>

                        {/* Resultado de búsqueda:  Cliente encontrado */}
                        {busquedaRealizada &&
                            clienteExistente &&
                            !mostrarFormulario && (
                                <Alert
                                    color="teal"
                                    title="✅ Cliente Encontrado"
                                >
                                    <Stack gap="xs">
                                        <Text size="sm">
                                            <strong>Nombre: </strong>{" "}
                                            {clienteExistente.nombres_completos}
                                        </Text>
                                        <Text size="sm">
                                            <strong>Identificación:</strong>{" "}
                                            {clienteExistente.identificacion}
                                        </Text>
                                        <Checkbox
                                            label="Solicita factura detallada (con desglose tributario)"
                                            checked={solicitaDetallada}
                                            onChange={(e) =>
                                                setSolicitaDetallada(
                                                    e.currentTarget.checked,
                                                )
                                            }
                                        />
                                        <Button
                                            size="xs"
                                            variant="subtle"
                                            onClick={handleLimpiar}
                                        >
                                            Buscar otro cliente
                                        </Button>
                                    </Stack>
                                </Alert>
                            )}

                        {/* Resultado de búsqueda: Cliente NO encontrado */}
                        {busquedaRealizada &&
                            !clienteExistente &&
                            !mostrarFormulario && (
                                <Alert
                                    color="yellow"
                                    title="Cliente no encontrado"
                                >
                                    <Text size="sm" mb="sm">
                                        No se encontró ningún cliente con esa
                                        identificación.
                                    </Text>
                                    <Group>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                setMostrarFormulario(true)
                                            }
                                            leftSection={
                                                <IconUserPlus size={16} />
                                            }
                                        >
                                            Crear nuevo cliente
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="subtle"
                                            onClick={handleLimpiar}
                                        >
                                            Buscar otro
                                        </Button>
                                    </Group>
                                </Alert>
                            )}

                        {/* Formulario de creación de cliente */}
                        {mostrarFormulario && (
                            <Paper p="md" withBorder>
                                <Text size="sm" fw={500} mb="md">
                                    Crear nuevo cliente
                                </Text>
                                <ClienteFacturacionForm
                                    dniBusqueda={dniBusqueda}
                                    datosPrellenados={datosPrellenados}
                                    onClienteCreado={handleClienteCreado}
                                    onCancelar={() => {
                                        setMostrarFormulario(false);
                                        setBusquedaRealizada(false);
                                    }}
                                />
                            </Paper>
                        )}
                    </>
                )}

                {/* ========================================= */}
                {/* ✅ SECCIÓN DE DESCUENTO (OPCIONAL) */}
                {/* ========================================= */}
                {datosFacturacion && datosFacturacion.cliente_id && (
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
                                        {/* Selector de tipo de descuento */}
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

                                        {/* Input según tipo de descuento */}
                                        {tipoDescuento === "MONTO_FIJO" ? (
                                            <NumberInput
                                                label="Monto del descuento"
                                                placeholder="Ej: 50.00"
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

                                        {/* Motivo del descuento */}
                                        <Textarea
                                            label="Motivo del descuento"
                                            placeholder="Ej: Promoción de temporada, Cliente VIP, Cortesía..."
                                            description={
                                                porcentajeDescuento > 50
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
                                                porcentajeDescuento > 50 &&
                                                !motivoDescuento.trim()
                                                    ? "Motivo obligatorio para descuentos mayores al 50%"
                                                    : null
                                            }
                                        />

                                        {/* Vista previa del descuento */}
                                        {(descuento > 0 ||
                                            porcentajeDescuento > 0) && (
                                            <Alert
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
                                                            </strong>{" "}
                                                            {/* ✅ USAR HELPER */}
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
                                                            {/* ✅ USAR HELPER */}
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

                {/* Botones de navegación */}
                <Group justify="space-between" mt="xl">
                    <Button
                        variant="default"
                        onClick={onBack}
                        leftSection={<IconArrowLeft size={16} />}
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={handleContinuar}
                        rightSection={<IconArrowRight size={16} />}
                        disabled={
                            !datosFacturacion || !datosFacturacion.cliente_id
                        }
                    >
                        Continuar a Confirmación
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
};
