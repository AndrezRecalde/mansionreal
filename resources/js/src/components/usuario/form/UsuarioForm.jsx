import { Box, Select, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useRoleStore, useUiUsuario, useUsuarioStore } from "../../../hooks";
import { useEffect } from "react";

export const UsuarioForm = ({ form }) => {
    const { roles } = useRoleStore();
    const { activarUsuario, fnAgregarUsuario, fnAsignarUsuario } =
        useUsuarioStore();
    const { fnModalUsuario } = useUiUsuario();

    useEffect(() => {
        if (activarUsuario !== null) {
            form.setValues({
                ...activarUsuario,
                role: activarUsuario.roles[0].id.toString(),
            });
        }
    }, [activarUsuario]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fnAgregarUsuario(form.getTransformedValues());
        fnAsignarUsuario(null);
        fnModalUsuario(false);
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
                    withAsterisk
                    label="Correo Electronico"
                    placeholder="Ingrese el correo electronico"
                    {...form.getInputProps("email")}
                />
                <Select
                    withAsterisk
                    searchable
                    clearable
                    nothingFoundMessage="No hay datos"
                    label="Role"
                    placeholder="Seleccione un role"
                    data={roles.map((role) => ({
                        value: role.id.toString(),
                        label: role.name,
                    }))}
                    {...form.getInputProps("role")}
                />
                <BtnSubmit>Guardar Usuario</BtnSubmit>
            </Stack>
        </Box>
    );
};
