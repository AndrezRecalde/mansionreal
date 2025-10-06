import { useEffect } from "react";
import {
    Box,
    NumberInput,
    Select,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../../components";
import {
    useCategoriaStore,
    useInventarioStore,
    useStorageField,
    useUiInventario,
} from "../../../hooks";

export const InventarioForm = ({ form }) => {
    const {
        activarInventario,
        fnAgregarProductoInventario,
        fnAsignarProductoInventario,
    } = useInventarioStore();
    const { fnModalInventario } = useUiInventario();
    const { categorias } = useCategoriaStore();
    const { storageFields } = useStorageField();

    useEffect(() => {
        if (activarInventario !== null) {
            form.setValues({
                ...activarInventario,
                nombre_producto: activarInventario.nombre_producto,
                precio_unitario: activarInventario.precio_unitario,
                stock: activarInventario.stock,
                categoria_id: activarInventario.categoria_id.toString(),
            });
        }
    }, [activarInventario]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let objetoFinal = { ...form.getTransformedValues(), storageFields };
        fnAgregarProductoInventario(objetoFinal);
        fnAsignarProductoInventario(null);
        fnModalInventario(false);
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
                    label="Nombre del Producto"
                    placeholder="Ingrese el nombre del producto"
                    {...form.getInputProps("nombre_producto")}
                />
                <Textarea
                    label="Descripción del producto"
                    resize="vertical"
                    autosize
                    minRows={3}
                    maxRows={6}
                    placeholder="Ingrese una descripción del producto (opcional)"
                    {...form.getInputProps("descripcion")}
                />
                <NumberInput
                    withAsterisk
                    label="Precio unitario (s/.)"
                    placeholder="Ingrese el precio unitario"
                    min={1}
                    step={0.01}
                    precision={2}
                    {...form.getInputProps("precio_unitario")}
                />
                <NumberInput
                    withAsterisk
                    label="Stock"
                    placeholder="Ingrese el stock"
                    min={0}
                    step={1}
                    {...form.getInputProps("stock")}
                />
                <Select
                    withAsterisk
                    label="Categoria"
                    placeholder="Seleccione una categoria"
                    data={categorias.map((categoria) => ({
                        value: categoria.id.toString(),
                        label: categoria.nombre_categoria,
                    }))}
                    {...form.getInputProps("categoria_id")}
                />
                <BtnSubmit>Guardar Producto</BtnSubmit>
            </Stack>
        </Box>
    );
};
