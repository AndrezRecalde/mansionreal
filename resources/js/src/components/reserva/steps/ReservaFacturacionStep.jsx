import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Textarea,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { ClienteFacturacionSelector } from "../../../components";
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
    const [solicitaDetallada, setSolicitaDetallada] = useState(false);

    // clienteSeleccionado derivado de datosFacturacion para pasarlo al selector
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const { fnLimpiarCliente } = useClienteFacturacionStore();

    // Sincronizar clienteSeleccionado con datosFacturacion al iniciar
    useEffect(() => {
        if (!datosFacturacion) {
            setClienteSeleccionado(null);
        }
    }, [datosFacturacion]);

    /**
     * Callback del ClienteFacturacionSelector.
     * Traduce el objeto cliente al formato datosFacturacion que espera el stepper.
     */
    const handleClienteChange = (cliente) => {
        setClienteSeleccionado(cliente);

        if (!cliente) {
            setDatosFacturacion(null);
            return;
        }

        setDatosFacturacion({
            cliente_id: cliente.id,
            cliente_nombres_completos:
                cliente.id === consumidorFinal?.id
                    ? "CONSUMIDOR FINAL"
                    : cliente.nombres_completos,
            cliente_identificacion: cliente.identificacion,
            solicita_detallada: solicitaDetallada,
            observaciones: datosFacturacion?.observaciones || null,
        });
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
                {/* Selector reutilizable de cliente de facturación */}
                <ClienteFacturacionSelector
                    consumidorFinal={consumidorFinal}
                    huespedId={datos_reserva?.huesped_id}
                    generarFactura={generarFactura}
                    setGenerarFactura={setGenerarFactura}
                    clienteSeleccionado={clienteSeleccionado}
                    onClienteChange={handleClienteChange}
                    solicitaDetallada={solicitaDetallada}
                    setSolicitaDetallada={setSolicitaDetallada}
                />

                {/* Opciones adicionales: checkbox detallada + observaciones */}
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

                {/* Botones de navegación del stepper */}
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
