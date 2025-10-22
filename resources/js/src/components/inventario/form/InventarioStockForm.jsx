import { Box, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { AlertSection, BtnSubmit } from "../../../components";
import { useInventarioStore, useUiInventario } from "../../../hooks";
import { IconInfoCircle } from "@tabler/icons-react";

export const InventarioStockForm = ({ form }) => {
    const { fnAgregarStock, fnAsignarProductoInventario } =
        useInventarioStore();
    const { fnAbrirModalAgregarStock } = useUiInventario();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getTransformedValues());
        fnAsignarProductoInventario(null);
        fnAgregarStock(form.getTransformedValues());
        form.reset();
        fnAbrirModalAgregarStock(false);
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
                <AlertSection
                    variant="light"
                    color="indigo"
                    title="Información"
                    icon={IconInfoCircle}
                >
                    <strong>Nota:</strong> El stock se agregará al inventario
                    del producto seleccionado. Y tambien se formará un registro
                    en el historial de movimientos.
                </AlertSection>
                <NumberInput
                    withAsterisk
                    label="Cantidad"
                    placeholder="Ingrese la cantidad"
                    min={1}
                    step={1}
                    precision={0}
                    {...form.getInputProps("cantidad")}
                />
                <TextInput
                    withAsterisk
                    label="Motivo"
                    placeholder="Ingrese el motivo"
                    {...form.getInputProps("motivo")}
                />
                <Textarea
                    label="Observaciones"
                    resize="vertical"
                    autosize
                    minRows={3}
                    maxRows={6}
                    placeholder="Ingrese observaciones (opcional)"
                    {...form.getInputProps("observaciones")}
                />
                <BtnSubmit>Guardar Stock</BtnSubmit>
            </Stack>
        </Box>
    );
};
