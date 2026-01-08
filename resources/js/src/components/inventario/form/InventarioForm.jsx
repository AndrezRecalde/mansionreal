import { useEffect } from "react";
import {
    Box,
    NumberInput,
    Select,
    Stack,
    Switch,
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
import { IconCheck, IconX } from "@tabler/icons-react";

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
                categoria_id: activarInventario.categoria_id.toString(),
                sin_stock: activarInventario.sin_stock ? 0 : 1,
            });
        }
    }, [activarInventario]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let objetoFinal = { ...form.getTransformedValues(), storageFields };
        fnAgregarProductoInventario(objetoFinal);
        console.log(objetoFinal);
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
                    label="Precio unitario (usd/.)"
                    placeholder="Ingrese el precio unitario"
                    min={1}
                    step={0.01}
                    precision={2}
                    {...form.getInputProps("precio_unitario")}
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
                <Switch
                    {...form.getInputProps("sin_stock", { type: "checkbox" })}
                    label="¿El producto cuenta con stock?" //sin_stock = true -> No tiene stock | sin_stock = false -> Tiene stock
                    size="md"
                    thumbIcon={
                        form.values.sin_stock ? (
                            <IconCheck
                                size={12}
                                color="var(--mantine-color-indigo-6)"
                                stroke={3}
                            />
                        ) : (
                            <IconX
                                size={12}
                                color="var(--mantine-color-red-6)"
                                stroke={3}
                            />
                        )
                    }
                />
                <BtnSubmit>Guardar Producto</BtnSubmit>
            </Stack>
        </Box>
    );
};
