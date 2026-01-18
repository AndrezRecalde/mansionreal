import { useEffect } from "react";
import { Box, Select, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useRoleStore, useUiUsuario, useUsuarioStore } from "../../../hooks";
import classes from "../../../components/elements/modules/LabelsInput.module.css";

export const UsuarioForm = ({ form, PAGE_TITLE }) => {
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
                    label={PAGE_TITLE.CAMPOS_MODAL.INPUT_CEDULA.LABEL}
                    placeholder={PAGE_TITLE.CAMPOS_MODAL.INPUT_CEDULA.PLACEHOLDER}
                    {...form.getInputProps("dni")}
                    classNames={classes}
                />
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 2 }}
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                    <TextInput
                        withAsterisk
                        label={PAGE_TITLE.CAMPOS_MODAL.INPUT_APELLIDOS.LABEL}
                        placeholder={PAGE_TITLE.CAMPOS_MODAL.INPUT_APELLIDOS.PLACEHOLDER}
                        {...form.getInputProps("apellidos")}
                        classNames={classes}
                    />
                    <TextInput
                        withAsterisk
                        label={PAGE_TITLE.CAMPOS_MODAL.INPUT_NOMBRES.LABEL}
                        placeholder={PAGE_TITLE.CAMPOS_MODAL.INPUT_NOMBRES.PLACEHOLDER}
                        {...form.getInputProps("nombres")}
                        classNames={classes}
                    />
                </SimpleGrid>
                <TextInput
                    withAsterisk
                    label={PAGE_TITLE.CAMPOS_MODAL.INPUT_EMAIL.LABEL}
                    placeholder={PAGE_TITLE.CAMPOS_MODAL.INPUT_EMAIL.PLACEHOLDER}
                    {...form.getInputProps("email")}
                    classNames={classes}
                />
                <Select
                    withAsterisk
                    searchable
                    clearable
                    nothingFoundMessage={PAGE_TITLE.CAMPOS_MODAL.SELECT_ROL.NOTHING_FOUND}
                    label={PAGE_TITLE.CAMPOS_MODAL.SELECT_ROL.LABEL}
                    placeholder={PAGE_TITLE.CAMPOS_MODAL.SELECT_ROL.PLACEHOLDER}
                    data={roles.map((role) => ({
                        value: role.id.toString(),
                        label: role.name,
                    }))}
                    {...form.getInputProps("role")}
                    classNames={classes}
                />
                <BtnSubmit>{PAGE_TITLE.CAMPOS_MODAL.BUTTON_GUARDAR}</BtnSubmit>
            </Stack>
        </Box>
    );
};
