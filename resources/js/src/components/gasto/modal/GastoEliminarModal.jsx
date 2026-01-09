import { Modal } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { GastoEliminarForm, TextSection } from "../../../components";
import { useGastoStore, useUiGasto } from "../../../hooks";

export const GastoEliminarModal = () => {
    const { abrirEliminarModalGasto, fnAbrirEliminarModalGasto } =
        useUiGasto();
    const { fnAsignarGasto } = useGastoStore();

    const form = useForm({
        initialValues: {
            dni: "",
        },
        validate: {
            dni: isNotEmpty("Por favor ingrese el codigo administrativo"),
        },
    });

    const handleCerrarModal = () => {
        fnAbrirEliminarModalGasto(false);
        fnAsignarGasto(null);
    };

    return (
        <Modal
            centered
            opened={abrirEliminarModalGasto}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={18} fw={300}>
                    Eliminar Gasto
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="md"
            closeOnClickOutside={false}
        >
            <GastoEliminarForm form={form} />
        </Modal>
    );
};
