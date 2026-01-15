import { useState } from "react";
import { Box, Button, Group, Stepper } from "@mantine/core";
import { IconCheck, IconFileText, IconCash } from "@tabler/icons-react";
import {
    ReservaValidacionStep,
    ReservaFacturacionStep,
    ReservaConfirmacionStep,
} from "../../../components";
import {
    useReservaDepartamentoStore,
    useFacturaStore,
    useUiReservaDepartamento,
    useUiConsumo,
    useStorageField,
} from "../../../hooks";

export const ReservaFinalizarStepper = ({ datos_reserva }) => {
    const [active, setActive] = useState(0);
    const [datosFacturacion, setDatosFacturacion] = useState(null);
    const [generarFactura, setGenerarFactura] = useState(false);

    const { cargando, fnCambiarEstadoReserva, fnExportarNotaVentaPDF } =
        useReservaDepartamentoStore();
    const { fnGenerarFactura } = useFacturaStore();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { storageFields } = useStorageField();

    const nextStep = () => {
        setActive((current) => (current < 2 ? current + 1 : current));
    };

    const prevStep = () => {
        setActive((current) => (current > 0 ? current - 1 : current));
    };

    const handleFinalizarReserva = async () => {
        try {
            const { id } = datos_reserva;

            // 1. Cambiar estado de reserva a PAGADO
            await fnCambiarEstadoReserva(
                storageFields
                    ? {
                          id,
                          nombre_estado: "PAGADO",
                          storageFields,
                          carga_pagina:
                              storageFields.carga_pagina || "DEPARTAMENTOS",
                      }
                    : { id, nombre_estado: "PAGADO" }
            );

            // 2. Generar factura si corresponde
            if (generarFactura && datosFacturacion) {
                await fnGenerarFactura({
                    reserva_id: datos_reserva.reserva_id,
                    cliente_facturacion_id: datosFacturacion.cliente_id,
                    solicita_factura_detallada:
                        datosFacturacion.solicita_detallada || false,
                    observaciones: datosFacturacion.observaciones || null,
                    descuento: datosFacturacion.descuento || 0,
                });
            }

            // 3. Exportar nota de venta (PDF)
            await fnExportarNotaVentaPDF({
                reserva_id: datos_reserva.reserva_id,
            });

            // 4. Cerrar modal y drawer
            fnAbrirModalReservaFinalizar(false);
            fnAbrirDrawerConsumosDepartamento(false);
        } catch (error) {
            console.error("Error al finalizar reserva:", error);
        }
    };

    return (
        <Box>
            <Stepper
                active={active}
                onStepClick={setActive}
                breakpoint="sm"
                allowNextStepsSelect={false}
            >
                {/* PASO 1: VALIDACIÓN DE PAGOS */}
                <Stepper.Step
                    label="Validación"
                    description="Verificar pagos"
                    icon={<IconCash size={18} />}
                    loading={cargando}
                >
                    <ReservaValidacionStep
                        datos_reserva={datos_reserva}
                        onNext={nextStep}
                    />
                </Stepper.Step>

                {/* PASO 2: FACTURACIÓN */}
                <Stepper.Step
                    label="Facturación"
                    description="Datos del cliente"
                    icon={<IconFileText size={18} />}
                    loading={cargando}
                >
                    <ReservaFacturacionStep
                        datos_reserva={datos_reserva}
                        generarFactura={generarFactura}
                        setGenerarFactura={setGenerarFactura}
                        datosFacturacion={datosFacturacion}
                        setDatosFacturacion={setDatosFacturacion}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                </Stepper.Step>

                {/* PASO 3: CONFIRMACIÓN */}
                <Stepper.Completed>
                    <ReservaConfirmacionStep
                        datos_reserva={datos_reserva}
                        generarFactura={generarFactura}
                        datosFacturacion={datosFacturacion}
                        onBack={prevStep}
                        onConfirm={handleFinalizarReserva}
                        cargando={cargando}
                    />
                </Stepper.Completed>
            </Stepper>
        </Box>
    );
};
