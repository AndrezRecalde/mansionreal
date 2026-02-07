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
    Textarea,
    TextInput,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconArrowRight,
    IconSearch,
    IconUserPlus,
} from "@tabler/icons-react";
import { ClienteFacturacionForm } from "../../../components";
import { useClienteFacturacionStore } from "../../../hooks";
import Swal from "sweetalert2";

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
    // Efecto: Si switch OFF, setear consumidor final automáticamente
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
            setMostrarFormulario(false);
        } else {
            setMostrarFormulario(true);
            setBusquedaRealizada(false);
        }
    };

    const handleClienteCreado = async (nuevoCliente) => {
        setDatosFacturacion({
            cliente_id: nuevoCliente.id,
            cliente_nombres_completos: nuevoCliente.nombres_completos,
            cliente_identificacion: nuevoCliente.identificacion,
            solicita_detallada: solicitaDetallada,
        });
        setMostrarFormulario(false);

        // Actualizar búsqueda para mostrar el cliente recién creado
        setDniBusqueda(nuevoCliente.identificacion);
        setBusquedaRealizada(true);

        // Buscar el cliente para actualizar el estado y mostrarlo
        await fnBuscarPorIdentificacion(nuevoCliente.identificacion);
    };

    const handleLimpiar = () => {
        setDniBusqueda("");
        setBusquedaRealizada(false);
        setMostrarFormulario(false);
        setDatosFacturacion(null);
        setSolicitaDetallada(false);
        fnLimpiarCliente();
    };

    const handleContinuar = () => {
        if (!datosFacturacion || !datosFacturacion.cliente_id) {
            Swal.fire({
                icon: "warning",
                title: "Seleccione un cliente",
                text: "Debe seleccionar o crear un cliente para continuar",
            });
            return;
        }

        // Actualizar datos de facturación con observaciones y checkbox
        setDatosFacturacion({
            ...datosFacturacion,
            solicita_detallada: solicitaDetallada,
            observaciones: datosFacturacion.observaciones || null,
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
                {!generarFactura && datosFacturacion && (
                    <Alert color="blue" title="Facturación a Consumidor Final">
                        La factura se generará a nombre de{" "}
                        <strong>CONSUMIDOR FINAL</strong>
                    </Alert>
                )}

                {/* ========================================= */}
                {/* Opción CLIENTE REGISTRADO */}
                {/* ========================================= */}
                {generarFactura && (
                    <>
                        {/* Búsqueda y prellenado */}
                        <Paper p="md" withBorder>
                            <Stack gap="md">
                                <Group align="flex-end" grow>
                                    <TextInput
                                        label="Identificación del cliente"
                                        placeholder="Ingrese DNI, RUC o Pasaporte"
                                        value={dniBusqueda}
                                        onChange={(e) =>
                                            setDniBusqueda(e.target.value)
                                        }
                                        leftSection={<IconSearch size={16} />}
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
                            </Stack>
                        </Paper>

                        {/* Resultados de búsqueda */}
                        {busquedaRealizada && !mostrarFormulario && (
                            <>
                                {clienteExistente ? (
                                    <Alert
                                        color="green"
                                        title="Cliente encontrado"
                                    >
                                        <Text size="sm">
                                            <strong>Nombre:</strong>{" "}
                                            {clienteExistente.nombres_completos}
                                        </Text>
                                        <Text size="sm">
                                            <strong>Identificación:</strong>{" "}
                                            {clienteExistente.identificacion}
                                        </Text>
                                    </Alert>
                                ) : (
                                    <Alert
                                        color="orange"
                                        title="Cliente no encontrado"
                                    >
                                        <Text size="sm" mb="sm">
                                            No se encontró un cliente con la
                                            identificación ingresada.
                                        </Text>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                setMostrarFormulario(true)
                                            }
                                            leftSection={
                                                <IconUserPlus size={16} />
                                            }
                                        >
                                            Registrar nuevo cliente
                                        </Button>
                                    </Alert>
                                )}
                            </>
                        )}

                        {/* Formulario de registro de cliente */}
                        {mostrarFormulario && (
                            <Paper p="md" withBorder>
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

                {/* ❌ REMOVIDO: Sección completa de descuentos */}

                {/* ========================================= */}
                {/* Opciones adicionales */}
                {/* ========================================= */}
                {datosFacturacion && datosFacturacion.cliente_id && (
                    <>
                        <Divider my="md" />

                        <Paper p="md" withBorder>
                            <Stack gap="md">
                                <Checkbox
                                    label="Solicitar factura detallada"
                                    description="Incluir información completa del cliente en la factura"
                                    checked={solicitaDetallada}
                                    onChange={(event) =>
                                        setSolicitaDetallada(
                                            event.currentTarget.checked,
                                        )
                                    }
                                />

                                <Textarea
                                    label="Observaciones (Opcional)"
                                    placeholder="Comentarios adicionales para la factura"
                                    value={datosFacturacion.observaciones || ""}
                                    onChange={(e) =>
                                        setDatosFacturacion({
                                            ...datosFacturacion,
                                            observaciones: e.target.value,
                                        })
                                    }
                                    minRows={2}
                                />
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
                        Continuar
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
};
