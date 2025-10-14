import { useEffect } from "react";
import { Box, Divider, Select, Stack } from "@mantine/core";
import {
    BtnSubmit,
    ConsumosDetalleTable,
    PagosTotalesReserva,
    ReservaInfoHuespedTable,
} from "../../../components";
import {
    usePagoStore,
    useReservaDepartamentoStore,
    useStorageField,
    useUiReservaDepartamento,
} from "../../../hooks";

export const ReservaFinalizarForm = ({ form, datos_reserva }) => {
    const { fnCambiarEstadoReserva, fnExportarNotaVentaPDF } =
        useReservaDepartamentoStore();
    const { totalesPagos } = usePagoStore();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();
    const { storageFields } = useStorageField();

    useEffect(() => {
        if (datos_reserva) {
            form.setValues({
                id: datos_reserva.reserva_id,
                nombre_estado: "",
            });
        }
    }, [datos_reserva]);

    const round = (val) => Number(Number(val).toFixed(2));

    const isDisabled =
        !totalesPagos ||
        !(
            round(totalesPagos.saldo_pendiente) === 0 ||
            round(totalesPagos.total_consumos) ===
                round(totalesPagos.total_pagos)
        );

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getValues());
        if (storageFields) {
            fnCambiarEstadoReserva({
                id: form.values.id,
                nombre_estado: form.values.nombre_estado,
                storageFields,
                carga_pagina: storageFields.carga_pagina,
            });
        }
        fnCambiarEstadoReserva(form.getValues());
        fnExportarNotaVentaPDF({ reserva_id: datos_reserva.reserva_id });
        form.reset();
        fnAbrirModalReservaFinalizar(false);
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
                <ReservaInfoHuespedTable datos={datos_reserva} />
                <PagosTotalesReserva totalesPagos={totalesPagos} />
                {/* <ConsumosDetalleTable /> */}
                <Divider />

                <BtnSubmit disabled={isDisabled}>Finalizar Reserva</BtnSubmit>
            </Stack>
        </Box>
    );
};
