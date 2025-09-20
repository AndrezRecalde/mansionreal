import { useEffect } from "react";
import {
    Box,
    Loader,
    Select,
    SimpleGrid,
    Stack,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../../components";
import {
    useHuespedStore,
    useProvinciaStore,
    useUiHuesped,
} from "../../../hooks";

export const HuespedForm = ({ form }) => {
    const { activarHuesped, fnAgregarHuesped, fnAsignarHuesped } =
        useHuespedStore();
    const { fnModalHuesped } = useUiHuesped();
    const { cargando: cargandoProvincias, provincias } = useProvinciaStore();

    useEffect(() => {
        if (activarHuesped !== null) {
            form.setValues({
                nombres: activarHuesped.nombres,
                apellidos: activarHuesped.apellidos,
                dni: activarHuesped.dni,
                telefono: activarHuesped.telefono || "",
                email: activarHuesped.email,
                provincia_id: activarHuesped.provincia
                    ? activarHuesped.provincia_id.toString()
                    : null,
            });
        }
    }, [activarHuesped]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fnAgregarHuesped(form.getValues());
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
                    />
                    <TextInput
                        withAsterisk
                        label="Nombres"
                        placeholder="Ingrese los nombres"
                        {...form.getInputProps("nombres")}
                    />
                </SimpleGrid>
                <TextInput
                    label="Telefono"
                    placeholder="Ingrese el numero de telefono"
                    {...form.getInputProps("telefono")}
                />
                <TextInput
                    withAsterisk
                    label="Correo Electronico"
                    placeholder="Ingrese el correo electronico"
                    {...form.getInputProps("email")}
                />
                <Select
                    searchable
                    clearable
                    label="Provincia (Opcional)"
                    placeholder="Seleccione una provincia"
                    {...form.getInputProps("provincia_id")}
                    data={provincias.map((provincia) => ({
                        value: provincia.id.toString(),
                        label: provincia.nombre_provincia,
                    }))}
                    rightSection={
                        cargandoProvincias ? <Loader size={18} /> : null
                    }
                />
                <BtnSubmit>Guardar Huesped</BtnSubmit>
            </Stack>
        </Box>
    );
};
