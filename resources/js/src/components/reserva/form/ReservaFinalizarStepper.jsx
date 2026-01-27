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
    useDepartamentoStore,
    useEstadiaStore,
} from "../../../hooks";
import Swal from "sweetalert2";

export const ReservaFinalizarStepper = ({ datos_reserva }) => {
    const [active, setActive] = useState(0);
    const [datosFacturacion, setDatosFacturacion] = useState(null);
    const [generarFactura, setGenerarFactura] = useState(false);
    const [procesando, setProcesando] = useState(false);

    const { cargando, fnAsignarReserva, fnCambiarEstadoReserva } =
        useReservaDepartamentoStore();
    const { fnGenerarFactura, fnDescargarFacturaPDF } = useFacturaStore();
    const { fnCargarConsumidorFinal } = useClienteFacturacionStore();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { fnAsignarDepartamento } = useDepartamentoStore();
    const { fnAsignarEstadia } = useEstadiaStore();
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
        // Activar el estado de procesando INMEDIATAMENTE
        setProcesando(true);

        // ============================================================
        // IMPORTANTE: Capturar datos_reserva al inicio para evitar que se convierta en null
        // ============================================================
        const reservaIdCapturado = datos_reserva?.reserva_id;

        try {
            // ============================================================
            // VALIDACIÓN: Verificar que tenemos datos de facturación y reserva_id
            // ============================================================
            if (!reservaIdCapturado) {
                //console.error("Error: No se encontró el ID de la reserva");
                Swal.fire({
                    icon: "error",
                    title: "Error al finalizar reserva",
                    text: "No se encontró el ID de la reserva.",
                    showConfirmButton: true,
                });
                return;
            }

            if (!datosFacturacion || !datosFacturacion.cliente_id) {
                //console.error("Error: No se puede generar factura sin cliente");
                Swal.fire({
                    icon: "error",
                    title: "Error al generar factura",
                    text: "No se puede generar la factura sin un cliente de facturación seleccionado.",
                    showConfirmButton: true,
                });
                return;
            }

            // ============================================================
            // PASO 1: GENERAR FACTURA (sin descuentos a nivel de factura)
            // ============================================================
            const facturaGenerada = await fnGenerarFactura({
                reserva_id: reservaIdCapturado,
                cliente_facturacion_id: datosFacturacion.cliente_id,
                solicita_factura_detallada:
                    datosFacturacion.solicita_detallada || false,
                observaciones: datosFacturacion.observaciones || null,
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
                          id: reservaIdCapturado,
                          nombre_estado: "PAGADO",
                          storageFields,
                          carga_pagina:
                              storageFields.carga_pagina || "DEPARTAMENTOS",
                      }
                    : { id: reservaIdCapturado, nombre_estado: "PAGADO" },
            );
        } catch (error) {
            //console.error("Error al finalizar reserva:", error);

            // ============================================================
            // MANEJO ESPECIAL: Error code 1001 - Factura no generada
            // ============================================================
            if (error.response?.data?.code === 1001) {
                const result = await Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    html: `
                    <p>${error.response.data.msg || "No se pudo generar la factura"}</p>
                    <p><strong>¿Desea finalizar la reserva?</strong></p>
                `,
                    showCancelButton: true,
                    confirmButtonText: "Sí, finalizar reserva",
                    cancelButtonText: "Cancelar",
                    confirmButtonColor: "#228be6",
                    cancelButtonColor: "#fa5252",
                });

                // Si el usuario confirma, finalizar sin factura
                if (result.isConfirmed) {
                    try {
                        // Solo cambiar el estado de la reserva a PAGADO
                        await fnCambiarEstadoReserva(
                            storageFields
                                ? {
                                      id: reservaIdCapturado,
                                      nombre_estado: "PAGADO",
                                      storageFields,
                                      carga_pagina:
                                          storageFields.carga_pagina ||
                                          "DEPARTAMENTOS",
                                  }
                                : {
                                      id: reservaIdCapturado,
                                      nombre_estado: "PAGADO",
                                  },
                        );

                        // Mostrar mensaje de éxito
                        await Swal.fire({
                            icon: "success",
                            title: "Reserva Finalizada",
                            text: "La reserva se finalizó correctamente sin factura.",
                            showConfirmButton: true,
                            timer: 2000,
                        });
                    } catch (errorFinalizar) {
                        // Error al finalizar sin factura
                        Swal.fire({
                            icon: "error",
                            title: "Error al finalizar",
                            text:
                                errorFinalizar.response?.data?.msg ||
                                "Ocurrió un error al finalizar la reserva.",
                            showConfirmButton: true,
                        });
                    }
                }
                // Si cancela, no hacer nada (el finally limpiará los estados)
            } else {
                // ============================================================
                // OTROS ERRORES: Mostrar mensaje de error genérico
                // ============================================================
                Swal.fire({
                    icon: "error",
                    title: "Error al finalizar reserva",
                    text:
                        error.response?.data?.msg ||
                        error.message ||
                        "Ocurrió un error inesperado al finalizar la reserva.",
                    showConfirmButton: true,
                });
            }
        } finally {
            // ============================================================
            // LIMPIEZA: Siempre se ejecuta, con éxito o error
            // ============================================================
            // Limpiar estados activados
            fnAsignarDepartamento(null);
            fnAsignarReserva(null);
            fnAsignarEstadia(null);

            // Cerrar modal y drawer
            fnAbrirModalReservaFinalizar(false);
            fnAbrirDrawerConsumosDepartamento(false);

            // Desactivar estado de procesando
            setProcesando(false);
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
                    loading={cargando || procesando}
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
                    loading={cargando || procesando}
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
                        cargando={cargando || procesando}
                    />
                </Stepper.Completed>
            </Stepper>
        </Box>
    );
};
