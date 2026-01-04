import { Modal } from "@mantine/core";
import { useConsumoStore, useUiConsumo } from "../../../hooks";
import { ConsumoEditarForm, TextSection } from "../../../components";
import { useForm } from "@mantine/form";

export const ConsumoEditarModal = () => {
    const { fnAsignarConsumo } = useConsumoStore();
    const { abrirModalEditarConsumo, fnAbrirModalEditarConsumo } = useUiConsumo();

    const form = useForm({
        initialValues: {
            cantidad: ""
        },
    })

    const handleCerrarModal = () => {
        fnAbrirModalEditarConsumo(false);
        fnAsignarConsumo(null);
    }

    return (
        <Modal
            centered
            opened={abrirModalEditarConsumo}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={18} fw={300}>
                    Editar Consumo
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <ConsumoEditarForm form={form} />
        </Modal>
    );
};
