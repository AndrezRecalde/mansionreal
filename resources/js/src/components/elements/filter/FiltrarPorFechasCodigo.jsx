import { Box, Fieldset, SimpleGrid, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { DateInput } from "@mantine/dates";
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
        },
        validate: (values) => {
            const errors = {};

            const tieneCodigo = values.codigo_reserva.trim() !== "";
            const tieneFechas =
                values.fecha_inicio !== "" && values.fecha_fin !== "";

            if (!tieneCodigo && !tieneFechas) {
                errors.codigo_reserva =
                    "Debes buscar por código de reserva o por rango de fechas";
                errors.fecha_inicio =
                    "Debes buscar por código de reserva o por rango de fechas";
                errors.fecha_fin =
                    "Debes buscar por código de reserva o por rango de fechas";
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
        <Fieldset
            mt={20}
            mb={20}
            legend="Filtrar por fechas y código"
        >
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
                <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }} mt={10}>
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
