import { Box, Fieldset, Select, SimpleGrid, TextInput } from "@mantine/core";
import { TextSection } from "../../elements/titles/TextSection";
import { BtnSubmit } from "../../elements/buttons/BtnServices";
import { IconSearch } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useCategoriaStore, useInventarioStore, useStorageField } from "../../../hooks";

export const InventarioBusquedaForm = () => {
    const { categorias } = useCategoriaStore();
    const { fnCargarProductosInventario } = useInventarioStore();
    const { fnSetStorageFields } = useStorageField();

    const form = useForm({
        initialValues: {
            categoria: "",
            nombre_producto: "",
        },
        transformValues: (values) => ({
            categoria_id: values.categoria ? parseInt(values.categoria) : null,
            nombre_producto: values.nombre_producto
                ? values.nombre_producto.trim()
                : null,
        }),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        fnCargarProductosInventario(form.getTransformedValues());
        fnSetStorageFields(form.getTransformedValues());
    };

    return (
        <Fieldset
            mt={20}
            mb={20}
            legend={
                <TextSection tt="" fw={500} fz={16}>
                    Filtrar Busqueda
                </TextSection>
            }
        >
            <Box
                component="form"
                onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            >
                <SimpleGrid cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 2 }}>
                    <Select
                        searchable
                        clearable
                        label="Categoria"
                        placeholder="Selecciona una categoria"
                        data={categorias.map((categoria) => ({
                            value: categoria.id.toString(),
                            label: categoria.nombre_categoria,
                        }))}
                        {...form.getInputProps("categoria")}
                    />
                    <TextInput
                        label="Nombre del producto"
                        placeholder="Escribe el nombre del producto"
                        {...form.getInputProps("nombre_producto")}
                    />
                </SimpleGrid>
                <BtnSubmit IconSection={IconSearch}>Buscar</BtnSubmit>
            </Box>
        </Fieldset>
    );
};
