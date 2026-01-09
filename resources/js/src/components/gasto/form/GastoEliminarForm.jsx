import { useEffect } from "react";
import { Avatar, Box, Group, Stack, TextInput } from "@mantine/core";
import { BtnSubmit, TextSection } from "../..";
import { useGastoStore, useUiGasto } from "../../../hooks";
import { IconTrash } from "@tabler/icons-react";

export const GastoEliminarForm = ({ form }) => {
    const { cargando, activarGasto, fnAsignarGasto, fnEliminarGasto } =
        useGastoStore();
    const { fnAbrirEliminarModalGasto } = useUiGasto();

    useEffect(() => {
        if (activarGasto !== null) {
            form.setValues({
                id: activarGasto.id,
                reserva_id: activarGasto.reserva_id,
            });
        }
    }, [activarGasto]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.getValues());
        fnEliminarGasto(form.getValues());
        fnAsignarGasto(null);
        fnAbrirEliminarModalGasto(false);
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
                <Group justify="center">
                    <Avatar color="red.7" size="xl" radius="xl">
                        <IconTrash size={45} />
                    </Avatar>
                </Group>
                <TextSection tt="" fw={500}>
                    Usted va a eliminar el Registro:{" "}
                    {activarGasto?.descripcion}
                </TextSection>
                <TextInput
                    label="Codigo Administrativo"
                    description="Para eliminar el consumo debe ingresar el codigo administrativo"
                    placeholder="Ingrese el codigo de la administracion"
                    {...form.getInputProps("dni")}
                />
                <BtnSubmit loading={cargando}>Eliminar</BtnSubmit>
            </Stack>
        </Box>
    );
};
