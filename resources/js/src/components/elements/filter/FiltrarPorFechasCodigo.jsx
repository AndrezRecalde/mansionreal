import { Box, Fieldset, SimpleGrid, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { DateInput, YearPickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import { useStorageField } from "../../../hooks";
import classes from "../modules/LabelsInput.module.css";
import dayjs from "dayjs";

export const FiltrarPorFechasCodigo = ({
    fnHandleAction = () => {},
    cargando = false,
}) => {
    const { fnSetStorageFields } = useStorageField();
    const form = useForm({
        initialValues: {
            codigo_reserva: "",
            fecha_inicio: "",
            fecha_fin: "",
            anio: null,
        },
        validate: (values) => {
            const errors = {};

            const tieneCodigo = values.codigo_reserva.trim() !== "";
            const tieneFechas =
                values.fecha_inicio !== "" && values.fecha_fin !== "";
            const tieneAnio = values.anio !== null && values.anio !== "";

            if (!tieneCodigo && !tieneFechas && !tieneAnio) {
                const msg =
                    "Debes buscar por código de reserva, rango de fechas o año";
                errors.codigo_reserva = msg;
                errors.fecha_inicio = msg;
                errors.fecha_fin = msg;
                errors.anio = msg;
            }

            return errors;
        },
        transformValues: (values) => ({
            ...values,
            fecha_inicio: dayjs(values.fecha_inicio).isValid()
                ? dayjs(values.fecha_inicio).format("YYYY-MM-DD")
                : null,
            fecha_fin: dayjs(values.fecha_fin).isValid()
                ? dayjs(values.fecha_fin).add(1, "day").format("YYYY-MM-DD")
                : null,
            anio: values.anio ? dayjs(values.anio).year() : null,
        }),
    });

    const { fecha_inicio } = form.values;

    const handleSubmit = (e) => {
        e.preventDefault();
        let objetoFinal = {
            ...form.getTransformedValues(),
            carga_pagina: "RESERVAS",
        };
        fnHandleAction(form.getTransformedValues());
        fnSetStorageFields(objetoFinal);
        //console.log(form.getTransformedValues());
    };

    return (
        <Fieldset mt={20} mb={20} legend="Filtrar por fechas, año o código">
            <Box
                component="form"
                onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            >
                <TextInput
                    withAsterisk
                    label="Código Reserva"
                    placeholder="Ingrese código de la reserva"
                    classNames={classes}
                    {...form.getInputProps("codigo_reserva")}
                />
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} mt={10}>
                    <YearPickerInput
                        withAsterisk
                        label="Año"
                        placeholder="Seleccione un año"
                        classNames={classes}
                        clearable
                        {...form.getInputProps("anio")}
                    />
                    <DateInput
                        withAsterisk
                        valueFormat="YYYY-MM-DD"
                        label="Fecha inicio"
                        placeholder="Seleccione fecha de inicio"
                        classNames={classes}
                        {...form.getInputProps("fecha_inicio")}
                    />
                    <DateInput
                        minDate={new Date(fecha_inicio)}
                        withAsterisk
                        valueFormat="YYYY-MM-DD"
                        label="Fecha final"
                        placeholder="Seleccione fecha de fin"
                        classNames={classes}
                        {...form.getInputProps("fecha_fin")}
                    />
                </SimpleGrid>

                <BtnSubmit IconSection={IconSearch} loading={cargando}>
                    Buscar
                </BtnSubmit>
            </Box>
        </Fieldset>
    );
};
