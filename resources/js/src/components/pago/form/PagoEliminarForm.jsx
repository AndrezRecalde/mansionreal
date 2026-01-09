import { useEffect } from "react";
import { Avatar, Box, Group, Stack, TextInput } from "@mantine/core";
import { BtnSubmit, TextSection } from "../../../components";
import { usePagoStore, useUiPago } from "../../../hooks";
import { IconTrash } from "@tabler/icons-react";

export const PagoEliminarForm = ({ form }) => {
    const { cargando, activarPago, fnAsignarPago, fnEliminarPago } =
        usePagoStore();
    const { fnAbrirModalEliminarRegistroPago } = useUiPago();

    useEffect(() => {
        if (activarPago !== null) {
            form.setValues({
                id: activarPago.id,
                reserva_id: activarPago.reserva_id,
            });
        }
    }, [activarPago]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.getValues());
        fnEliminarPago(form.getValues());
        fnAsignarPago(null);
        fnAbrirModalEliminarRegistroPago(false);
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
                    {activarPago?.codigo_voucher}
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
