import { useEffect } from "react";
import { Avatar, Box, Group, Stack, TextInput } from "@mantine/core";
import { BtnSubmit, TextSection } from "../../../components";
import { useConsumoStore, useUiConsumo } from "../../../hooks";
import { IconTrash } from "@tabler/icons-react";

export const ConsumoEliminarForm = ({ form }) => {
    const { activarConsumo, fnAsignarConsumo, fnEliminarConsumo } =
        useConsumoStore();
    const { fnAbrirModalEliminarConsumo } = useUiConsumo();

    useEffect(() => {
        if (activarConsumo !== null) {
            form.setValues({
                id: activarConsumo.id,
            });
        }
    }, [activarConsumo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getValues());
        //fnEliminarConsumo(form.getValues());
        fnAsignarConsumo(null);
        fnAbrirModalEliminarConsumo(false);
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
                <TextSection tt="" fw={500}>Usted va a eliminar el consumo: {activarConsumo?.nombre_producto}</TextSection>
                <TextInput
                    label="Codigo Administrativo"
                    description="Para eliminar el consumo debe ingresar el codigo administrativo"
                    placeholder="Ingrese el codigo de la administracion"
                    {...form.getInputProps("dni")}
                />
                <BtnSubmit>Eliminar</BtnSubmit>
            </Stack>
        </Box>
    );
};
