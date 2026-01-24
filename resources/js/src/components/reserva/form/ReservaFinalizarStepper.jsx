import { useState, useEffect } from "react";
import { Box, Stepper } from "@mantine/core";
import { IconFileText, IconCash } from "@tabler/icons-react";
import {
    ReservaValidacionStep,
    ReservaFacturacionStep,
    ReservaConfirmacionStep,
} from "../../../components";
import {
    useReservaDepartamentoStore,
    useFacturaStore,
    useClienteFacturacionStore,
    useUiReservaDepartamento,
    useUiConsumo,
    useStorageField,
} from "../../../hooks";

export const ReservaFinalizarStepper = ({ datos_reserva }) => {
    const [active, setActive] = useState(0);
    const [datosFacturacion, setDatosFacturacion] = useState(null);
    const [generarFactura, setGenerarFactura] = useState(false);

    const { cargando, fnCambiarEstadoReserva } = useReservaDepartamentoStore();
    const { fnGenerarFactura, fnDescargarFacturaPDF } = useFacturaStore();
    const { fnCargarConsumidorFinal } = useClienteFacturacionStore();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { storageFields } = useStorageField();

    const [consumidorFinal, setConsumidorFinal] = useState(null);

    useEffect(() => {
        const cargarConsumidorFinal = async () => {
            const cf = await fnCargarConsumidorFinal();
            setConsumidorFinal(cf);
        };

        cargarConsumidorFinal();
    }, []);

    const nextStep = () => {
        setActive((current) => (current < 2 ? current + 1 : current));
    };

    const prevStep = () => {
        setActive((current) => (current > 0 ? current - 1 : current));
    };

    const handleFinalizarReserva = async () => {
        try {
            const { reserva_id } = datos_reserva;

            // ============================================================
            // VALIDACIÓN: Verificar que tenemos datos de facturación
            // ============================================================
            if (!datosFacturacion || !datosFacturacion.cliente_id) {
                console.error("Error: No se puede generar factura sin cliente");
                return;
            }

            // ============================================================
            // PASO 1: GENERAR FACTURA (sin descuentos a nivel de factura)
            // ============================================================
            const facturaGenerada = await fnGenerarFactura({
                reserva_id: reserva_id,
                cliente_facturacion_id: datosFacturacion.cliente_id,
                solicita_factura_detallada:
                    datosFacturacion.solicita_detallada || false,
                observaciones: datosFacturacion.observaciones || null,
                // ❌ REMOVIDO: Ya no enviamos descuentos a nivel de factura
                // Los descuentos están a nivel de consumos individuales
            });

            // ============================================================
            // PASO 2: DESCARGAR PDF DE LA FACTURA GENERADA
            // ============================================================
            if (facturaGenerada && facturaGenerada.id) {
                await fnDescargarFacturaPDF(facturaGenerada.id);
            }

            // ============================================================
            // PASO 3: Cambiar estado de reserva a PAGADO
            // ============================================================
            await fnCambiarEstadoReserva(
                storageFields
                    ? {
                          id: reserva_id,
                          nombre_estado: "PAGADO",
                          storageFields,
                          carga_pagina:
                              storageFields.carga_pagina || "DEPARTAMENTOS",
                      }
                    : { id: reserva_id, nombre_estado: "PAGADO" },
            );

            // ============================================================
            // PASO 4: Cerrar modal y drawer
            // ============================================================
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

                {/* PASO 2: FACTURACIÓN (sin descuentos) */}
                <Stepper.Step
                    label="Facturación"
                    description="Seleccionar cliente"
                    icon={<IconFileText size={18} />}
                    loading={cargando}
                >
                    <ReservaFacturacionStep
                        datos_reserva={datos_reserva}
                        generarFactura={generarFactura}
                        setGenerarFactura={setGenerarFactura}
                        datosFacturacion={datosFacturacion}
                        setDatosFacturacion={setDatosFacturacion}
                        consumidorFinal={consumidorFinal}
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
