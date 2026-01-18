import { useEffect } from "react";
import { Box, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useHuespedStore, useUiHuesped } from "../../../hooks";
import classes from "../../../components/elements/modules/LabelsInput.module.css";

export const HuespedForm = ({ form, PAGE_TITLE }) => {
    const { activarHuesped, fnAgregarHuesped, fnAsignarHuesped } =
        useHuespedStore();
    const { fnModalHuesped } = useUiHuesped();

    useEffect(() => {
        if (activarHuesped !== null) {
            form.setValues({
                ...activarHuesped,
                nombres: activarHuesped.nombres,
                apellidos: activarHuesped.apellidos,
                dni: activarHuesped.dni,
                telefono: activarHuesped.telefono || "",
                email: activarHuesped.email,
            });
        }
    }, [activarHuesped]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.getTransformedValues());
        fnAgregarHuesped(form.getTransformedValues());
        fnAsignarHuesped(null);
        form.reset();
        fnModalHuesped(false);
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
                <TextInput
                    withAsterisk
                    label={PAGE_TITLE.HUESPEDES.CAMPOS_MODAL.CAMPOS_FORMULARIO.LABEL_CEDULA}
                    placeholder="Ingrese el número de cédula"
                    {...form.getInputProps("dni")}
                    classNames={classes}
                />
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 2 }}
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                    <TextInput
                        withAsterisk
                        label={PAGE_TITLE.HUESPEDES.CAMPOS_MODAL.CAMPOS_FORMULARIO.LABEL_APELLIDOS}
                        placeholder="Ingrese los apellidos"
                        {...form.getInputProps("apellidos")}
                        classNames={classes}
                    />
                    <TextInput
                        withAsterisk
                        label={PAGE_TITLE.HUESPEDES.CAMPOS_MODAL.CAMPOS_FORMULARIO.LABEL_NOMBRES}
                        placeholder="Ingrese los nombres"
                        {...form.getInputProps("nombres")}
                        classNames={classes}
                    />
                </SimpleGrid>
                <TextInput
                    label={PAGE_TITLE.HUESPEDES.CAMPOS_MODAL.CAMPOS_FORMULARIO.LABEL_TELEFONO}
                    placeholder="Ingrese el número de teléfono"
                    {...form.getInputProps("telefono")}
                    classNames={classes}
                />
                <TextInput
                    label={PAGE_TITLE.HUESPEDES.CAMPOS_MODAL.CAMPOS_FORMULARIO.LABEL_EMAIL}
                    placeholder="Ingrese el correo electrónico"
                    {...form.getInputProps("email")}
                    classNames={classes}
                />
                <BtnSubmit>{PAGE_TITLE.HUESPEDES.CAMPOS_MODAL.CAMPOS_FORMULARIO.BUTTON}</BtnSubmit>
            </Stack>
        </Box>
    );
};
