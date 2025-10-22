import { Modal } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { InventarioForm, TextSection } from "../../../components";
import { useInventarioStore, useUiInventario } from "../../../hooks";

export const InventarioModal = () => {
    const { abrirModalInventario, fnModalInventario } = useUiInventario();
    const { fnAsignarProductoInventario } = useInventarioStore();

    const form = useForm({
        initialValues: {
            nombre_producto: "",
            descripcion: "",
            precio_unitario: "",
            categoria_id: "",
        },
        validate: {
            nombre_producto: isNotEmpty(
                "El nombre del producto es obligatorio"
            ),
            precio_unitario: isNotEmpty("El precio unitario es obligatorio"),
            categoria_id: isNotEmpty("La categoría es obligatoria"),
        },
        transformValues: (values) => ({
            ...values,
            precio_unitario: Number(values.precio_unitario),
            categoria_id: Number(values.categoria_id),
        }),
    });

    const handleCerrarModal = () => {
        fnModalInventario(false);
        fnAsignarProductoInventario(null);
        form.reset();
    };

    return (
        <Modal
            opened={abrirModalInventario}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Producto
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <InventarioForm form={form} />
        </Modal>
    );
};
