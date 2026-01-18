import { useEffect } from "react";
import { Box, NumberInput, Stack, Textarea } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { DateInput } from "@mantine/dates";
import {
    useConfiguracionIvaStore,
    useUiConfiguracionIva,
} from "../../../hooks";
import dayjs from "dayjs";
import classes from "../../../components/elements/modules/LabelsInput.module.css";

export const ConfigIvaForm = ({ form, PAGE_TITLE }) => {
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
                    label={PAGE_TITLE.INPUT_TASA_IVA.LABEL}
                    placeholder={PAGE_TITLE.INPUT_TASA_IVA.PLACEHOLDER}
                    min={1}
                    step={0.01}
                    precision={2}
                    {...form.getInputProps("tasa_iva")}
                    classNames={classes}
                />
                <Textarea
                    withAsterisk
                    label={PAGE_TITLE.INPUT_DESCRIPCION_IVA.LABEL}
                    placeholder={PAGE_TITLE.INPUT_DESCRIPCION_IVA.PLACEHOLDER}
                    resize="vertical"
                    minRows={3}
                    {...form.getInputProps("descripcion")}
                    classNames={classes}
                />
                <DateInput
                    valueFormat="YYYY-MM-DD"
                    label={PAGE_TITLE.INPUT_FECHA_INICIO.LABEL}
                    placeholder={PAGE_TITLE.INPUT_FECHA_INICIO.PLACEHOLDER}
                    {...form.getInputProps("fecha_inicio")}
                    classNames={classes}
                />
                <DateInput
                    minDate={new Date(fecha_inicio)}
                    valueFormat="YYYY-MM-DD"
                    label={PAGE_TITLE.INPUT_FECHA_FIN.LABEL}
                    placeholder={PAGE_TITLE.INPUT_FECHA_FIN.PLACEHOLDER}
                    {...form.getInputProps("fecha_fin")}
                    classNames={classes}
                />
                <BtnSubmit>{PAGE_TITLE.BUTTON_GUARDAR}</BtnSubmit>
            </Stack>
        </Box>
    );
};
