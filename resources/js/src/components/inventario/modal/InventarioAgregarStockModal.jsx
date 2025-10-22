import { Modal } from "@mantine/core";
import { InventarioStockForm, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useInventarioStore, useUiInventario } from "../../../hooks";

export const InventarioAgregarStockModal = () => {
    const { abrirModalAgregarStock, fnAbrirModalAgregarStock } =
        useUiInventario();
    const { activarInventario, fnAsignarProductoInventario } =
        useInventarioStore();
    const form = useForm({
        initialValues: {
            cantidad: 0,
            motivo: "",
            observaciones: "",
        },
        validate: {
            cantidad: isNotEmpty("La cantidad es obligatoria"),
            motivo: isNotEmpty("El motivo es obligatorio"),
        },
        transformValues: (values) => ({
            ...values,
            cantidad: Number(values.cantidad),
            id: Number(activarInventario.id),
        }),
    });

    const handleCerrarModal = () => {
        fnAbrirModalAgregarStock(false);
        fnAsignarProductoInventario(null);
        form.reset();
    };

    return (
        <Modal
            opened={abrirModalAgregarStock}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Agregar Stock
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <InventarioStockForm form={form} />
        </Modal>
    );
};
