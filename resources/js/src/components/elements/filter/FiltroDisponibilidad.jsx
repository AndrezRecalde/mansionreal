import { Box, Fieldset, SimpleGrid, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { BtnSubmit } from "../buttons/BtnServices";
import { IconSearch } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import classes from "../modules/LabelsInput.module.css";

export const FiltroDisponibilidad = ({
    titulo = "",
    fnHandleAction = () => {},
    cargando = false,
}) => {
    const form = useForm({
        initialValues: {
            numero_departamento: "",
            fecha: "",
        },
        transformValues: (values) => ({
            ...values,
            fecha: dayjs(values.fecha).isValid()
                ? dayjs(values.fecha).format("YYYY-MM-DD")
                : null,
        }),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { fecha } = form.getTransformedValues();
        fnHandleAction(fecha);
        console.log(form.getTransformedValues());
    };

    return (
        <Fieldset legend={titulo} variant="filled" mb={20}>
            <Box
                component="form"
                onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            >
                <SimpleGrid cols={{ base: 1, sm: 1, md: 1, lg: 1 }} mt={10}>
                    {/* <TextInput
                        label="Numero de departamento"
                        placeholder="Buscar..."
                        classNames={classes}
                        {...form.getInputProps("numero_departamento")}
                    /> */}
                    <DateInput
                        clearable
                        withAsterisk
                        valueFormat="YYYY-MM-DD"
                        label="Fecha"
                        placeholder="Seleccione fecha de busqueda"
                        classNames={classes}
                        {...form.getInputProps("fecha")}
                    />
                </SimpleGrid>
                <BtnSubmit fontSize={14} IconSection={IconSearch}>
                    Buscar
                </BtnSubmit>
            </Box>
        </Fieldset>
    );
};
