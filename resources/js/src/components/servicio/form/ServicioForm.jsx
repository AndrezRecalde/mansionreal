import { useEffect } from "react";
import { Box, Stack, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useServicioStore, useUiServicio } from "../../../hooks";

export const ServicioForm = ({ form }) => {
    const { activarServicio, fnAgregarServicio, fnAsignarServicio } =
        useServicioStore();
    const { fnModalAbrirServicio } = useUiServicio();

    useEffect(() => {
        if (activarServicio !== null) {
            form.setValues({
                ...activarServicio,
                nombre_servicio: activarServicio.nombre_servicio,
                tipo_servicio: activarServicio.tipo_servicio,
            });
        }
    }, [activarServicio]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fnAgregarServicio(form.getValues());
        fnModalAbrirServicio(false);
        fnAsignarServicio(null);
        form.reset();
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
                <TextInput
                    withAsterisk
                    label="Nombre de servicio"
                    placeholder="Ingrese el nombre del servicio"
                    {...form.getInputProps("nombre_servicio")}
                />
                <TextInput
                    withAsterisk
                    label="Tipo de servicio"
                    placeholder="Ingrese el tipo de servicio"
                    {...form.getInputProps("tipo_servicio")}
                />
                <BtnSubmit>Guardar Servicio</BtnSubmit>
            </Stack>
        </Box>
    );
};
