import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Badge,
    Divider,
    Group,
    Stack,
    Stepper,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import {
    IconFileText,
    IconCash,
    IconCheck,
    IconDownload,
    IconCircleCheck,
} from "@tabler/icons-react";
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
    const [facturaFinalizada, setFacturaFinalizada] = useState(null); // datos de la factura generada (paso éxito)

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
                Swal.fire({
                    icon: "error",
                    title: "Error al finalizar reserva",
                    text: "No se encontró el ID de la reserva.",
                    showConfirmButton: true,
                });
                return;
            }

            if (!datosFacturacion || !datosFacturacion.cliente_id) {
                Swal.fire({
                    icon: "error",
                    title: "Error al generar factura",
                    text: "No se puede generar la factura sin un cliente de facturación seleccionado.",
                    showConfirmButton: true,
                });
                return;
            }

            // ============================================================
            // PASO 1: GENERAR FACTURA
            // ============================================================
            const facturaGenerada = await fnGenerarFactura({
                reserva_id: reservaIdCapturado,
                cliente_facturacion_id: datosFacturacion.cliente_id,
                solicita_factura_detallada:
                    datosFacturacion.solicita_detallada || false,
                observaciones: datosFacturacion.observaciones || null,
            });

            // ============================================================
            // PASO 2: Cambiar estado de reserva a PAGADO
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

            // ============================================================
            // ÉXITO: Guardar factura para mostrar el paso final
            // ============================================================
            setFacturaFinalizada(facturaGenerada || { sin_factura: false });

        } catch (error) {
            // ============================================================
            // MANEJO ESPECIAL: Error code 1001 - Factura no generada
            // ============================================================
            if (error.response?.data?.code === 1001) {
                const result = await Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    html: `
                    <p>${error.response.data.msg || "No se pudo generar la factura"}</p>
                    <p><strong>¿Desea finalizar la reserva sin factura?</strong></p>
                `,
                    showCancelButton: true,
                    confirmButtonText: "Sí, finalizar reserva",
                    cancelButtonText: "Cancelar",
                    confirmButtonColor: "#228be6",
                    cancelButtonColor: "#fa5252",
                });

                if (result.isConfirmed) {
                    try {
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
                        // Sin factura: mostrar paso final sin datos de factura
                        setFacturaFinalizada({ sin_factura: true });
                    } catch (errorFinalizar) {
                        Swal.fire({
                            icon: "error",
                            title: "Error al finalizar",
                            text:
                                errorFinalizar.response?.data?.msg ||
                                "Ocurrió un error al finalizar la reserva.",
                            showConfirmButton: true,
                        });
                        // En error: limpiar y cerrar
                        fnAsignarDepartamento(null);
                        fnAsignarReserva(null);
                        fnAsignarEstadia(null);
                        fnAbrirModalReservaFinalizar(false);
                        fnAbrirDrawerConsumosDepartamento(false);
                    }
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al finalizar reserva",
                    text:
                        error.response?.data?.msg ||
                        error.message ||
                        "Ocurrió un error inesperado al finalizar la reserva.",
                    showConfirmButton: true,
                });
                // En error: limpiar y cerrar
                fnAsignarDepartamento(null);
                fnAsignarReserva(null);
                fnAsignarEstadia(null);
                fnAbrirModalReservaFinalizar(false);
                fnAbrirDrawerConsumosDepartamento(false);
            }
        } finally {
            setProcesando(false);
        }
    };

    // Llamado cuando el usuario cierra el paso de éxito manualmente
    const handleCerrarExito = () => {
        fnAsignarDepartamento(null);
        fnAsignarReserva(null);
        fnAsignarEstadia(null);
        fnAbrirModalReservaFinalizar(false);
        fnAbrirDrawerConsumosDepartamento(false);
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

                {/* PASO 3: CONFIRMACIÓN / ÉXITO */}
                <Stepper.Completed>
                    {facturaFinalizada ? (
                        // ── Panel de éxito ───────────────────────────────
                        <Stack align="center" gap="lg" py="xl">
                            <ThemeIcon size={72} radius="xl" color="teal">
                                <IconCircleCheck size={42} />
                            </ThemeIcon>

                            <Stack align="center" gap={4}>
                                <Title order={3}>¡Reserva Finalizada!</Title>
                                <Text c="dimmed" size="sm" ta="center">
                                    La reserva ha pasado a estado
                                </Text>
                                <Badge color="teal" variant="light" size="sm">
                                    PAGADO
                                </Badge>
                            </Stack>

                            {!facturaFinalizada.sin_factura &&
                            facturaFinalizada.numero_factura ? (
                                <>
                                    <Divider w="80%" />
                                    <Stack align="center" gap={4}>
                                        <Text fw={600} size="sm">
                                            Factura Generada
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            N°{" "}
                                            <strong>
                                                {facturaFinalizada.numero_factura}
                                            </strong>
                                        </Text>
                                    </Stack>
                                </>
                            ) : facturaFinalizada.sin_factura ? (
                                <Text size="sm" c="dimmed" ta="center">
                                    La reserva se finalizó sin factura.
                                </Text>
                            ) : null}

                            <Group justify="center" mt="sm">
                                {!facturaFinalizada.sin_factura &&
                                    facturaFinalizada?.id && (
                                        <Button
                                            variant="light"
                                            color="blue"
                                            leftSection={
                                                <IconDownload size={16} />
                                            }
                                            onClick={() =>
                                                fnDescargarFacturaPDF(
                                                    facturaFinalizada.id,
                                                )
                                            }
                                            loading={procesando}
                                        >
                                            Descargar Factura
                                        </Button>
                                    )}
                                <Button
                                    variant="filled"
                                    color="teal"
                                    leftSection={<IconCheck size={16} />}
                                    onClick={handleCerrarExito}
                                >
                                    Cerrar
                                </Button>
                            </Group>
                        </Stack>
                    ) : (
                        // ── Paso de confirmación normal ──────────────────
                        <ReservaConfirmacionStep
                            datos_reserva={datos_reserva}
                            generarFactura={generarFactura}
                            datosFacturacion={datosFacturacion}
                            onBack={prevStep}
                            onConfirm={handleFinalizarReserva}
                            cargando={cargando || procesando}
                        />
                    )}
                </Stepper.Completed>
            </Stepper>
        </Box>
    );
};
