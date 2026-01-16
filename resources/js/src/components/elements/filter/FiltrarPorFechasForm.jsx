import { Box, Fieldset, Group } from "@mantine/core";
import { BtnSubmit, TextSection } from "../../../components";
import { DateInput, YearPickerInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import classes from "../modules/LabelsInput.module.css";
import dayjs from "dayjs";
import { useEffect } from "react";

export const FiltrarPorFechasForm = ({
    titulo = "",
    cargando,
    fnHandleAction,
}) => {
    const form = useForm({
        initialValues: {
            p_fecha_inicio: "",
            p_fecha_fin: "",
            p_anio: new Date(),
        },
        validate: {
            p_anio: isNotEmpty("Por favor ingresar el año"),
        },
        transformValues: (values) => ({
            p_fecha_inicio: dayjs(values.p_fecha_inicio).isValid()
                ? dayjs(values.p_fecha_inicio).format("YYYY-MM-DD")
                : null,
            p_fecha_fin: dayjs(values.p_fecha_fin).isValid()
                ? dayjs(values.p_fecha_fin).add(1, "day").format("YYYY-MM-DD")
                : null,
            p_anio: dayjs(values.p_anio).year(),
        }),
    });

    const { p_fecha_inicio } = form.values;

    useEffect(() => {
        if (p_fecha_inicio && dayjs(p_fecha_inicio).isValid()) {
            const yearFromFecha = dayjs(p_fecha_inicio).year();
            const currentYear = dayjs(form.values.p_anio).year();

            // Solo actualiza si el año es diferente para evitar loops
            if (yearFromFecha !== currentYear) {
                form.setFieldValue("p_anio", dayjs(p_fecha_inicio).toDate());
            }
        } else if (!p_fecha_inicio) {
            const currentYear = new Date().getFullYear();
            const formYear = dayjs(form.values.p_anio).year();

            // Solo resetea al año actual si es diferente
            if (formYear !== currentYear) {
                form.setFieldValue("p_anio", new Date());
            }
        }
    }, [p_fecha_inicio]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fnHandleAction(form.getTransformedValues());
    };

    return (
        <Fieldset
            mb={20}
            legend={
                <TextSection tt="" fw={500} fz={16}>
                    {titulo}
                </TextSection>
            }
        >
            <Box
                component="form"
                onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            >
                <Group gap="xs" align="flex-end" wrap="wrap">
                    <YearPickerInput
                        required
                        label="Año"
                        placeholder="Año"
                        w={{ base: "100%", xs: 100 }}
                        size="sm"
                        classNames={classes}
                        {...form.getInputProps("p_anio")}
                    />
                    <DateInput
                        clearable
                        valueFormat="YYYY-MM-DD"
                        label="Fecha inicio"
                        placeholder="Ingresar fecha de inicio"
                        classNames={classes}
                        size="sm"
                        flex={{ base: "1 1 100%", xs: "1 1 auto" }}
                        miw={{ xs: 140 }}
                        {...form.getInputProps("p_fecha_inicio")}
                    />
                    <DateInput
                        clearable
                        minDate={
                            p_fecha_inicio
                                ? new Date(p_fecha_inicio)
                                : undefined
                        }
                        valueFormat="YYYY-MM-DD"
                        label="Fecha final"
                        placeholder="Ingresar fecha final"
                        classNames={classes}
                        size="sm"
                        flex={{ base: "1 1 100%", xs: "1 1 auto" }}
                        miw={{ xs: 140 }}
                        {...form.getInputProps("p_fecha_fin")}
                    />
                    <BtnSubmit IconSection={IconSearch} loading={cargando}>
                        Buscar
                    </BtnSubmit>
                </Group>
            </Box>
        </Fieldset>
    );
};
