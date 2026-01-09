import { useEffect } from "react";
import {
    Box,
    Select,
    SimpleGrid,
    Stack,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useHuespedStore, useUiHuesped } from "../../../hooks";
import classes from "../../../components/elements/modules/LabelsInput.module.css"

export const HuespedForm = ({ form }) => {
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
                direccion: activarHuesped.direccion || "",
                nacionalidad: activarHuesped.nacionalidad || "",
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
                    label="No. Cedula"
                    placeholder="Ingrese el numero de cedula"
                    {...form.getInputProps("dni")}
                    classNames={classes}
                />
                <SimpleGrid
                    cols={2}
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                    <TextInput
                        withAsterisk
                        label="Apellidos"
                        placeholder="Ingrese los apellidos"
                        {...form.getInputProps("apellidos")}
                        classNames={classes}
                    />
                    <TextInput
                        withAsterisk
                        label="Nombres"
                        placeholder="Ingrese los nombres"
                        {...form.getInputProps("nombres")}
                        classNames={classes}
                    />
                </SimpleGrid>
                <TextInput
                    label="Telefono"
                    placeholder="Ingrese el numero de telefono"
                    {...form.getInputProps("telefono")}
                    classNames={classes}
                />
                <TextInput
                    withAsterisk
                    label="Correo Electronico"
                    placeholder="Ingrese el correo electronico"
                    {...form.getInputProps("email")}
                    classNames={classes}
                />
                <Select
                    searchable
                    clearable
                    label="Nacionalidad"
                    placeholder="Seleccione una nacionalidad"
                    {...form.getInputProps("nacionalidad")}
                    data={[
                        { value: "ECUATORIANO", label: "ECUATORIANO" },
                        { value: "EXTRANJERO", label: "EXTRANJERO" },
                    ]}
                    classNames={classes}
                />
                <TextInput
                    label="Direccion del huesped"
                    placeholder="Ingrese la direccion de domicilio del huesped"
                    {...form.getInputProps("direccion")}
                    classNames={classes}
                />
                <BtnSubmit>Guardar Huesped</BtnSubmit>
            </Stack>
        </Box>
    );
};
