import { useEffect } from "react";
import { Box, Divider, Select, Stack, Textarea } from "@mantine/core";
import {
    BtnSubmit,
    PagosTotalesReserva,
    ReservaInfoHuespedTable,
} from "../../../components";
import {
    usePagoStore,
    useReservaDepartamentoStore,
    useStorageField,
    useUiReservaDepartamento,
} from "../../../hooks";
import { Estados } from "../../../helpers/getPrefix";

export const ReservaFinalizarForm = ({ form, datos_reserva }) => {
    const { nombre_estado } = form.values;
    const {
        fnCambiarEstadoReserva,
        fnCancelarReserva,
        fnExportarNotaVentaPDF,
    } = useReservaDepartamentoStore();
    const { totalesPagos } = usePagoStore();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();
    const { storageFields } = useStorageField();

    useEffect(() => {
        if (datos_reserva) {
            form.setValues({
                //id: datos_reserva.reserva_id,
                nombre_estado: "",
            });
        }
    }, [datos_reserva]);

    const round = (val) => Number(Number(val).toFixed(2));

    //TODO: Validar si se puede finalizar la reserva
    const isDisabled =
        !totalesPagos ||
        !(
            round(totalesPagos.saldo_pendiente) === 0 ||
            round(totalesPagos.total_consumos) ===
                round(totalesPagos.total_pagos) ||
            nombre_estado === Estados.CANCELADO
        );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.validate().hasErrors) return;

        const { id, nombre_estado, motivo_cancelacion, observacion } =
            form.getTransformedValues();

        try {
            if (nombre_estado === Estados.CANCELADO) {
                await fnCancelarReserva({
                    id,
                    motivo_cancelacion,
                    observacion,
                    ...(storageFields && {
                        storageFields,
                        carga_pagina:
                            storageFields.carga_pagina || "DEPARTAMENTOS",
                    }),
                });
            } else {
                await fnCambiarEstadoReserva(
                    storageFields
                        ? {
                              id,
                              nombre_estado,
                              storageFields,
                              carga_pagina:
                                  storageFields.carga_pagina || "DEPARTAMENTOS",
                          }
                        : { id, nombre_estado }
                );
            }

            await fnExportarNotaVentaPDF({
                reserva_id: datos_reserva.reserva_id,
            });
            form.reset();
            fnAbrirModalReservaFinalizar(false);
        } catch (error) {
            console.error("❌ Error en handleSubmit:", error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="center"
                gap="md"
            >
                <Select
                    withAsterisk
                    description="Seleccione el estado de la reserva, si es PAGADO o CANCELADO"
                    label="Estado de la reserva"
                    placeholder="Seleccione el estado de la reserva"
                    data={[
                        { value: "PAGADO", label: "PAGADO" },
                        { value: "CANCELADO", label: "CANCELADO" },
                    ]}
                    {...form.getInputProps("nombre_estado")}
                />
                {nombre_estado === "CANCELADO" ? (
                    <>
                        <Select
                            withAsterisk
                            description="Seleccione el motivo de la cancelación"
                            label="Motivo de cancelación"
                            placeholder="Seleccione el motivo de la cancelación"
                            data={[
                                {
                                    value: "ERROR_TIPEO",
                                    label: "Error de tipeo",
                                },
                                {
                                    value: "CAMBIO_FECHAS",
                                    label: "Cambio de fechas",
                                },
                                {
                                    value: "CAMBIO_HUESPED",
                                    label: "Cambio de huésped",
                                },
                                {
                                    value: "SOLICITUD_CLIENTE",
                                    label: "Solicitud del cliente",
                                },
                                {
                                    value: "FUERZA_MAYOR",
                                    label: "Fuerza mayor",
                                },
                                { value: "OTRO", label: "Otro" },
                            ]}
                            {...form.getInputProps("motivo_cancelacion")}
                        />
                        <Textarea
                            label="Observación"
                            placeholder="Ingrese una observación sobre la cancelación"
                            minRows={3}
                            {...form.getInputProps("observacion")}
                        />
                    </>
                ) : null}

                <ReservaInfoHuespedTable datos={datos_reserva} />
                <PagosTotalesReserva totalesPagos={totalesPagos} />
                <Divider />
                <BtnSubmit disabled={isDisabled}>Finalizar Reserva</BtnSubmit>
            </Stack>
        </Box>
    );
};
