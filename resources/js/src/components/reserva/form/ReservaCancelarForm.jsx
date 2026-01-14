import { Box, Divider, Select, Stack, Textarea } from "@mantine/core";
import { BtnSubmit, ReservaInfoHuespedTable } from "../..";
import {
    useReservaDepartamentoStore,
    useStorageField,
    useUiConsumo,
    useUiReservaDepartamento,
} from "../../../hooks";
import classes from "../../../components/elements/modules/LabelsInput.module.css";

export const ReservaCancelarForm = ({ form, datos_reserva }) => {
    const { cargando, fnCancelarReserva } = useReservaDepartamentoStore();
    const { fnAbrirModalCancelarReserva } = useUiReservaDepartamento();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { storageFields } = useStorageField();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.validate().hasErrors) return;

        const { id, motivo_cancelacion, observacion } =
            form.getTransformedValues();

        await fnCancelarReserva({
            id,
            motivo_cancelacion,
            observacion,
            ...(storageFields && {
                storageFields,
                carga_pagina: storageFields.carga_pagina || "DEPARTAMENTOS",
            }),
        });
        form.reset();
        fnAbrirModalCancelarReserva(false);
        fnAbrirDrawerConsumosDepartamento(false);
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
                    classNames={classes}
                />
                <Textarea
                    label="Observación"
                    placeholder="Ingrese una observación sobre la cancelación"
                    minRows={3}
                    {...form.getInputProps("observacion")}
                />

                <ReservaInfoHuespedTable datos={datos_reserva} />
                <Divider />
                <BtnSubmit loading={cargando}>Cancelar Reserva</BtnSubmit>
            </Stack>
        </Box>
    );
};
