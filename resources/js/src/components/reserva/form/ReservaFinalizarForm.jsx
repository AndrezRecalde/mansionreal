import { useEffect } from "react";
import { Box, Divider, Select, Stack } from "@mantine/core";
import { BtnSubmit, ConsumosDetalleTable, ReservaInfoHuespedTable } from "../../../components";
import { useReservaDepartamentoStore, useUiReservaDepartamento } from "../../../hooks";


export const ReservaFinalizarForm = ({ form, datos_reserva }) => {
    const { fnCambiarEstadoReserva, fnExportarNotaVentaPDF } = useReservaDepartamentoStore();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();

    useEffect(() => {
      if(datos_reserva){
        form.setValues({
            id: datos_reserva.reserva_id,
            nombre_estado: "",
        });
      }

    }, [datos_reserva])


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getValues());
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
                <ConsumosDetalleTable />
                <Divider />

                <BtnSubmit>Finalizar Reserva</BtnSubmit>
            </Stack>
        </Box>
    );
};
