import { useEffect } from "react";
import { Box, NumberInput, Stack } from "@mantine/core";
import { TextSection } from "../../elements/titles/TextSection";
import { BtnSubmit } from "../../elements/buttons/BtnServices";
import { useConsumoStore, useUiConsumo } from "../../../hooks";

export const ConsumoEditarForm = ({ form }) => {

    const { activarConsumo, fnAgregarConsumo } = useConsumoStore();
    const { fnAbrirModalEditarConsumo } = useUiConsumo();

    useEffect(() => {
      if (activarConsumo !== null) {
        form.setValues({
            id: activarConsumo.id,
            reserva_id: activarConsumo.reserva_id,
            inventario_id: activarConsumo.inventario_id,
            cantidad: activarConsumo.cantidad
        })
      }

    }, [activarConsumo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getValues());
        fnAgregarConsumo(form.getValues());
        form.reset();
        fnAbrirModalEditarConsumo(false);
    }


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
                <TextSection tt="" fz={16} fw={500}>
                    Nombre Producto: {activarConsumo?.nombre_producto}
                </TextSection>
                <NumberInput label="Cantidad" min={1} required {...form.getInputProps("cantidad")} />
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
