import { useState, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    Loader,
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
    onNext,
    onBack,
}) => {
    const [dniBusqueda, setDniBusqueda] = useState("");
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);

    const {
        cargando,
        consumidorFinal,
        clienteExistente,
        datosPrellenados,
        fnCargarConsumidorFinal,
        fnBuscarPorIdentificacion,
        fnPrellenarDesdeHuesped,
        fnLimpiarCliente,
    } = useClienteFacturacionStore();

    // Cargar consumidor final al montar
    useEffect(() => {
        fnCargarConsumidorFinal();
    }, []);

    // Si no genera factura, usar consumidor final automáticamente
    useEffect(() => {
        if (!generarFactura && consumidorFinal) {
            setDatosFacturacion({
                cliente_id: consumidorFinal.id,
                cliente_nombre: "CONSUMIDOR FINAL",
                solicita_detallada: false,
            });
        }
    }, [generarFactura, consumidorFinal]);

    const handleBuscarCliente = async () => {
        if (!dniBusqueda.trim()) return;

        setBusquedaRealizada(true);
        setMostrarFormulario(false);

        const resultado = await fnBuscarPorIdentificacion(dniBusqueda);

        if (resultado.existe && resultado.cliente) {
            setDatosFacturacion({
                cliente_id: resultado.cliente.id,
                cliente_nombre: `${resultado.cliente.nombres} ${resultado.cliente.apellidos}`,
                solicita_detallada: solicitaDetallada,
            });
        }
    };

    const handlePrellenarDesdeHuesped = async () => {
        const resultado = await fnPrellenarDesdeHuesped(
            datos_reserva.huesped_id
        );

        if (resultado.existe && resultado.cliente_existente) {
            // Ya existe el cliente
            setDniBusqueda(resultado.cliente_existente.identificacion);
            setDatosFacturacion({
                cliente_id: resultado.cliente_existente.id,
                cliente_nombre: `${resultado.cliente_existente.nombres} ${resultado.cliente_existente.apellidos}`,
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
            cliente_nombre: `${nuevoCliente.nombres} ${nuevoCliente.apellidos}`,
            solicita_detallada: solicitaDetallada,
        });
        setMostrarFormulario(false);
    };

    const handleLimpiar = () => {
        fnLimpiarCliente();
        setDniBusqueda("");
        setBusquedaRealizada(false);
        setMostrarFormulario(false);
        setDatosFacturacion(null);
    };

    const puedeAvanzar =
        !generarFactura || (generarFactura && datosFacturacion?.cliente_id);

    return (
        <Box mt="xl">
            <Stack gap="lg">
                {/* Switch para generar factura */}
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
                            setGenerarFactura(event.currentTarget.checked);
                            handleLimpiar();
                        }}
                    />
                </Paper>

                {/* Opción CONSUMIDOR FINAL */}
                {!generarFactura && consumidorFinal && (
                    <Alert color="blue" title="Consumidor Final">
                        <Text size="sm">
                            La factura se generará a nombre de{" "}
                            <strong>CONSUMIDOR FINAL</strong>
                        </Text>
                        <Text size="sm" mt="xs">
                            Identificación: {consumidorFinal.identificacion}
                        </Text>
                    </Alert>
                )}

                {/* Opción CLIENTE REGISTRADO */}
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
                                placeholder="Ej:   1712345678"
                                value={dniBusqueda}
                                onChange={(e) => setDniBusqueda(e.target.value)}
                                leftSection={<IconSearch size={16} />}
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
                            <Alert color="green" title="✅ Cliente Encontrado">
                                <Text size="sm" fw={600}>
                                    {clienteExistente.nombres}{" "}
                                    {clienteExistente.apellidos}
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
                                                cliente_nombre: `${clienteExistente.nombres} ${clienteExistente.apellidos}`,
                                                solicita_detallada:
                                                    solicitaDetallada,
                                            });
                                        }}
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
                                    title="❌ Cliente No Encontrado"
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
                                    Crear Nuevo Cliente
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
                        {datosFacturacion?.cliente_id && (
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
