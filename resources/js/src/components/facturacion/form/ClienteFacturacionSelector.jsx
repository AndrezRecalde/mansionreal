import { useState, useEffect } from "react";
import {
    Alert,
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
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { ClienteFacturacionForm } from "../../../components";
import { useClienteFacturacionStore } from "../../../hooks";
import Swal from "sweetalert2";

/**
 * ClienteFacturacionSelector
 *
 * Componente reutilizable que encapsula la lógica de selección de cliente
 * para facturación (Switch consumidor final / cliente registrado, búsqueda,
 * prellenado desde huésped y creación de nuevo cliente).
 *
 * Props:
 * @param {object|null}  consumidorFinal        - Objeto del consumidor final cargado desde el store.
 * @param {number|null}  huespedId              - ID del huésped activo (para prellenar).
 * @param {boolean}      generarFactura         - Estado controlado del Switch externo.
 * @param {function}     setGenerarFactura      - Setter del Switch externo.
 * @param {object|null}  clienteSeleccionado    - Cliente actualmente seleccionado (controlado desde fuera).
 * @param {function}     onClienteChange        - Callback invocado con el cliente seleccionado (o null al limpiar).
 *                                               Signature: (cliente: object|null) => void
 * @param {boolean}      solicitaDetallada      - Estado controlado del checkbox de factura detallada.
 * @param {function}     setSolicitaDetallada   - Setter del checkbox.
 */
export const ClienteFacturacionSelector = ({
    consumidorFinal,
    huespedId,
    generarFactura,
    setGenerarFactura,
    clienteSeleccionado,
    onClienteChange,
    solicitaDetallada,
    setSolicitaDetallada,
}) => {
    const [dniBusqueda, setDniBusqueda] = useState("");
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const {
        cargando,
        clienteExistente,
        datosPrellenados,
        fnBuscarPorIdentificacion,
        fnPrellenarDesdeHuesped,
        fnLimpiarCliente,
    } = useClienteFacturacionStore();

    // Cuando el switch se pone en OFF → setear consumidor final automáticamente
    useEffect(() => {
        if (!generarFactura && consumidorFinal) {
            onClienteChange(consumidorFinal);
            setBusquedaRealizada(false);
            setMostrarFormulario(false);
        }
    }, [generarFactura, consumidorFinal]);

    // ----------------------------------------------------------------
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
            onClienteChange(resultado.cliente);
        } else {
            onClienteChange(null);
        }
    };

    const handlePrellenarDesdeHuesped = async () => {
        if (!huespedId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo obtener información del huésped",
            });
            return;
        }

        const resultado = await fnPrellenarDesdeHuesped(huespedId);

        if (resultado.existe && resultado.cliente_existente) {
            setDniBusqueda(resultado.cliente_existente.identificacion);
            onClienteChange(resultado.cliente_existente);
            setBusquedaRealizada(true);
            setMostrarFormulario(false);
        } else {
            setMostrarFormulario(true);
            setBusquedaRealizada(false);
        }
    };

    const handleClienteCreado = async (nuevoCliente) => {
        onClienteChange(nuevoCliente);
        setMostrarFormulario(false);
        setDniBusqueda(nuevoCliente.identificacion);
        setBusquedaRealizada(true);
        await fnBuscarPorIdentificacion(nuevoCliente.identificacion);
    };

    const handleLimpiarInterno = () => {
        setDniBusqueda("");
        setBusquedaRealizada(false);
        setMostrarFormulario(false);
        onClienteChange(null);
        if (setSolicitaDetallada) setSolicitaDetallada(false);
        fnLimpiarCliente();
    };

    // ----------------------------------------------------------------
    return (
        <Stack gap="md">
            {/* Switch: Consumidor Final vs Cliente Registrado */}
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
                        handleLimpiarInterno();
                    }}
                    styles={{ label: { fontWeight: 600 } }}
                />
            </Paper>

            {/* Consumidor final seleccionado */}
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

            {/* Opción: Cliente Registrado */}
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
                                if (e.key === "Enter") handleBuscarCliente();
                            }}
                        />
                        <Button
                            onClick={handleBuscarCliente}
                            loading={cargando}
                        >
                            Buscar
                        </Button>
                    </Group>

                    <Button
                        variant="light"
                        leftSection={<IconUserPlus size={16} />}
                        onClick={handlePrellenarDesdeHuesped}
                    >
                        Prellenar con datos del huésped
                    </Button>

                    {/* Resultado: cliente encontrado */}
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
                                    {clienteSeleccionado.tipo_identificacion}:{" "}
                                    {clienteSeleccionado.identificacion}
                                </Text>
                            </Alert>
                        )}

                    {/* Resultado: cliente NO encontrado */}
                    {busquedaRealizada &&
                        !clienteExistente &&
                        !mostrarFormulario && (
                            <Alert
                                color="orange"
                                variant="light"
                                title="Cliente No Encontrado"
                            >
                                <Text size="sm" mb="sm">
                                    No existe un cliente con la identificación
                                    ingresada.
                                </Text>
                                <Button
                                    size="sm"
                                    leftSection={<IconUserPlus size={16} />}
                                    onClick={() => setMostrarFormulario(true)}
                                >
                                    Registrar nuevo cliente
                                </Button>
                            </Alert>
                        )}

                    {/* Formulario crear nuevo cliente */}
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
                                    handleLimpiarInterno();
                                }}
                            />
                        </Paper>
                    )}

                    {/* Checkbox: factura detallada */}
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
        </Stack>
    );
};
