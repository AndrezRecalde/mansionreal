import { Box, Select, Stack } from "@mantine/core";
import { BtnSubmit } from "../../../components";

export const ReservaFinalizarForm = ({ form }) => {
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
                    label="Estado de la reserva"
                    placeholder="Seleccione el estado de la reserva"
                    data={[
                        { value: "PAGADO", label: "PAGADO" },
                        { value: "CANCELADO", label: "CANCELADO" },
                    ]}
                    {...form.getInputProps("estado")}
                />
                <BtnSubmit>Guardar Categoria</BtnSubmit>
            </Stack>
        </Box>
    );
};
