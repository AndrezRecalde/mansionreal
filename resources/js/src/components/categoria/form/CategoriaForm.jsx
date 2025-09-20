import { useEffect } from "react";
import { Box, Stack, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useCategoriaStore, useUiCategoria } from "../../../hooks";

export const CategoriaForm = ({ form }) => {
    const { fnAgregarCategoria, fnAsignarCategoria, activarCategoria } = useCategoriaStore();
    const { fnModalAbrirCategoria } = useUiCategoria();

    useEffect(() => {
        if (activarCategoria !== null) {
            form.setValues({
                ...activarCategoria,
                nombre_categoria: activarCategoria.nombre_categoria,
            });
        }
    }, [activarCategoria]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fnAgregarCategoria(form.getValues());
        fnAsignarCategoria(null);
        fnModalAbrirCategoria(false);
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
                    label="Nombre de categoria"
                    placeholder="Ingrese el nombre de la categoria"
                    {...form.getInputProps("nombre_categoria")}
                />
                <BtnSubmit>Guardar Categoria</BtnSubmit>
            </Stack>
        </Box>
    );
};
