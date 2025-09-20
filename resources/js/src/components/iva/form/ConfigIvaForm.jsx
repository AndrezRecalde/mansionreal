import { useEffect } from "react";
import { Box, NumberInput, Stack, Textarea } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { DateInput } from "@mantine/dates";
import {
    useConfiguracionIvaStore,
    useUiConfiguracionIva,
} from "../../../hooks";
import dayjs from "dayjs";

export const ConfigIvaForm = ({ form }) => {
    const { fecha_inicio } = form.values;
    const { fnAgregarIva, fnAsignarIva, activarIva } =
        useConfiguracionIvaStore();
    const { fnModalAbrirConfiguracionIva } = useUiConfiguracionIva();

    useEffect(() => {
        if (activarIva !== null) {
            form.setValues({
                ...activarIva,
                tasa_iva: activarIva.tasa_iva,
                descripcion: activarIva.descripcion,
                fecha_inicio: activarIva.fecha_inicio
                    ? dayjs(activarIva.fecha_inicio).toDate()
                    : null,
                fecha_fin: activarIva.fecha_fin
                    ? dayjs(activarIva.fecha_fin).toDate()
                    : null,
            });
        }
    }, [activarIva]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fnAgregarIva(form.getValues());
        fnAsignarIva(null);
        fnModalAbrirConfiguracionIva(false);
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
                <NumberInput
                    withAsterisk
                    label="Tasa Iva (%)"
                    placeholder="Ingrese la tasa del iva"
                    min={1}
                    step={0.01}
                    precision={2}
                    {...form.getInputProps("tasa_iva")}
                />
                <Textarea
                    withAsterisk
                    label="Descripción"
                    placeholder="Ingrese una descripción"
                    resize="vertical"
                    minRows={3}
                    {...form.getInputProps("descripcion")}
                />
                <DateInput
                    valueFormat="YYYY-MM-DD"
                    label="Fecha inicio"
                    placeholder="Seleccione fecha de inicio"
                    {...form.getInputProps("fecha_inicio")}
                />
                <DateInput
                    minDate={new Date(fecha_inicio)}
                    valueFormat="YYYY-MM-DD"
                    label="Fecha final"
                    placeholder="Seleccione fecha de fin"
                    {...form.getInputProps("fecha_fin")}
                />
                <BtnSubmit>Guardar Configuración Iva</BtnSubmit>
            </Stack>
        </Box>
    );
};
