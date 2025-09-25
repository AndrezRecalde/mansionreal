import { Modal } from "@mantine/core";
import { ConsumoEliminarForm, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useConsumoStore, useUiConsumo } from "../../../hooks";

export const ConsumoEliminarModal = () => {
    const { abrirModalEliminarConsumo, fnAbrirModalEliminarConsumo } =
        useUiConsumo();
    const { fnAsignarConsumo } = useConsumoStore();

    const form = useForm({
        initialValues: {
            dni: "",
        },
        validate: {
            dni: isNotEmpty("Por favor ingrese el codigo administrativo"),
        },
    });

    const handleCerrarModal = () => {
        fnAbrirModalEliminarConsumo(false);
        fnAsignarConsumo(null);
    };

    return (
        <Modal
            centered
            opened={abrirModalEliminarConsumo}
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
            <ConsumoEliminarForm form={form} />
        </Modal>
    );
};
