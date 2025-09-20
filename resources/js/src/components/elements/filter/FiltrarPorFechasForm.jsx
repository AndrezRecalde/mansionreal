import { Box, Fieldset, Group, SimpleGrid } from "@mantine/core";
import { BtnSubmit, TextSection } from "../../../components";
import { DateInput, YearPickerInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import classes from "../modules/LabelsInput.module.css";
import dayjs from "dayjs";

export const FiltrarPorFechasForm = ({
    titulo = "",
    cargando,
    fnHandleAction,
}) => {
    const form = useForm({
        initialValues: {
            fecha_inicio: "",
            fecha_fin: "",
            anio: new Date(),
        },
        validate: {
            anio: isNotEmpty("Por favor ingresar el año"),
        },
        transformValues: (values) => ({
            fecha_inicio: dayjs(values.fecha_inicio).isValid()
                ? dayjs(values.fecha_inicio).format("YYYY-MM-DD")
                : null,
            fecha_fin: dayjs(values.fecha_fin).isValid()
                ? dayjs(values.fecha_fin).add(1, "day").format("YYYY-MM-DD")
                : null,
            anio: values.anio.getFullYear(),
        }),
    });

    const { fecha_inicio } = form.values;

    const handleSubmit = (e) => {
        e.preventDefault();
        fnHandleAction(form.getTransformedValues());
        console.log(form.getTransformedValues());
        //form.reset();
    };

    return (
        <Fieldset
            mt={20}
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
                <Group justify="flex-end">
                    <YearPickerInput
                        required
                        placeholder="Seleccione el año"
                        {...form.getInputProps("anio")}
                    />
                </Group>
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
