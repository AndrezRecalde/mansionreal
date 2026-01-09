import { Modal } from "@mantine/core";
import { PagoEliminarForm, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { usePagoStore, useUiPago } from "../../../hooks";

export const PagoEliminarModal = () => {
    const { abrirModalEliminarRegistroPago, fnAbrirModalEliminarRegistroPago } =
        useUiPago();
    const { fnAsignarPago } = usePagoStore();

    const form = useForm({
        initialValues: {
            dni: "",
        },
        validate: {
            dni: isNotEmpty("Por favor ingrese el codigo administrativo"),
        },
    });

    const handleCerrarModal = () => {
        fnAbrirModalEliminarRegistroPago(false);
        fnAsignarPago(null);
    };

    return (
        <Modal
            centered
            opened={abrirModalEliminarRegistroPago}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={18} fw={300}>
                    Eliminar Pago
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="md"
            closeOnClickOutside={false}
        >
            <PagoEliminarForm form={form} />
        </Modal>
    );
};
