import { useState, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    Paper,
    Stack,
    Switch,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconCheck,
    IconSearch,
    IconUserPlus,
} from "@tabler/icons-react";
import { ClienteFacturacionForm } from "../../../components";
import { useClienteFacturacionStore } from "../../../hooks";

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
            //setMostrarFormulario(true);
        }
    };

    const handlePrellenarDesdeHuesped = async () => {
        const resultado = await fnPrellenarDesdeHuesped(
            datos_reserva.huesped_id,
        );

        if (resultado.existe && resultado.cliente_existente) {
            // Cliente ya existe
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
            // No existe, mostrar formulario prellenado
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
        fnLimpiarCliente();
        setDniBusqueda("");
        setBusquedaRealizada(false);
        setMostrarFormulario(false);

        // Volver a consumidor final si está OFF
        if (!generarFactura && consumidorFinal) {
            setDatosFacturacion({
                cliente_id: consumidorFinal.id,
                cliente_nombre: "CONSUMIDOR FINAL",
                cliente_identificacion: consumidorFinal.identificacion,
                solicita_detallada: false,
            });
        } else {
            setDatosFacturacion(null);
        }
    };

    // ================================================================
    // VALIDACIÓN: Siempre debe haber un cliente seleccionado
    // ================================================================
    const puedeAvanzar = datosFacturacion && datosFacturacion.cliente_id;

    return (
        <Box mt="xl">
            <Stack gap="lg">
                {/* ========================================= */}
                {/* Switch para elegir tipo de factura */}
                {/* ========================================= */}
                <Paper p="md" withBorder>
                    <Switch
                        size="md"
                        label="¿Generar factura con datos específicos del cliente?"
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
                            Esta opción es ideal para clientes que no requieren
                            datos específicos en la factura.
                        </Text>
                    </Alert>
                )}

                {/* ========================================= */}
                {/* Opción CLIENTE REGISTRADO */}
                {/* ========================================= */}
                {generarFactura && (
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
                            />
                            <Button
                                onClick={handleBuscarCliente}
                                leftSection={<IconSearch size={16} />}
                                loading={cargando}
                            >
                                Buscar
                            </Button>
                        </Group>

                        {/* Botón prellenar desde huésped */}
                        <Button
                            variant="light"
                            onClick={handlePrellenarDesdeHuesped}
                            leftSection={<IconUserPlus size={16} />}
                            loading={cargando}
                        >
                            Prellenar desde huésped de la reserva
                        </Button>

                        {/* Cliente encontrado */}
                        {busquedaRealizada && clienteExistente && (
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
                                        onClick={() => {
                                            setDatosFacturacion({
                                                cliente_id: clienteExistente.id,
                                                cliente_nombres_completos:
                                                    clienteExistente.nombres_completos,
                                                cliente_identificacion:
                                                    clienteExistente.identificacion,
                                                solicita_detallada:
                                                    solicitaDetallada,
                                            });
                                        }}
                                        leftSection={<IconCheck size={14} />}
                                    >
                                        Usar este cliente
                                    </Button>
                                    <Button
                                        size="xs"
                                        variant="subtle"
                                        onClick={handleLimpiar}
                                    >
                                        Buscar otro
                                    </Button>
                                </Group>
                            </Alert>
                        )}

                        {/* Cliente NO encontrado */}
                        {busquedaRealizada &&
                            !clienteExistente &&
                            !mostrarFormulario && (
                                <Alert
                                    color="yellow"
                                    title="Cliente No Encontrado"
                                >
                                    <Text size="sm">
                                        No se encontró un cliente con la
                                        identificación{" "}
                                        <strong>{dniBusqueda}</strong>
                                    </Text>
                                    <Group mt="md">
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

                        {/* Formulario para crear nuevo cliente */}
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

                        {/* Checkbox:  Factura detallada */}
                        {datosFacturacion?.cliente_id &&
                            datosFacturacion.cliente_id !==
                                consumidorFinal?.id && (
                                <Checkbox
                                    label="Solicita factura con datos completos (para deducción de impuestos)"
                                    description="Marque esta opción si el cliente requiere factura con todos sus datos para fines tributarios"
                                    checked={solicitaDetallada}
                                    onChange={(e) => {
                                        const checked = e.currentTarget.checked;
                                        setSolicitaDetallada(checked);
                                        setDatosFacturacion({
                                            ...datosFacturacion,
                                            solicita_detallada: checked,
                                        });
                                    }}
                                />
                            )}

                        {/* Resumen del cliente seleccionado */}
                        {datosFacturacion?.cliente_id && (
                            <Alert color="teal" title="Cliente Seleccionado">
                                <Text size="sm" fw={600}>
                                    {datosFacturacion.cliente_nombres_completos}
                                </Text>
                                {datosFacturacion.cliente_identificacion && (
                                    <Text size="sm" c="dimmed">
                                        Identificación:{" "}
                                        {
                                            datosFacturacion.cliente_identificacion
                                        }
                                    </Text>
                                )}
                            </Alert>
                        )}
                    </>
                )}

                {/* ========================================= */}
                {/* Botones de navegación */}
                {/* ========================================= */}
                <Group justify="space-between" mt="xl">
                    <Button
                        variant="default"
                        onClick={onBack}
                        leftSection={<IconArrowLeft size={16} />}
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={!puedeAvanzar}
                        rightSection={<IconCheck size={16} />}
                    >
                        Siguiente: Confirmación
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
};
