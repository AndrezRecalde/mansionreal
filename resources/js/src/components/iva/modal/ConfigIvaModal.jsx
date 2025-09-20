import { Modal } from "@mantine/core";
import { ConfigIvaForm, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import {
    useConfiguracionIvaStore,
    useUiConfiguracionIva,
} from "../../../hooks";

export const ConfigIvaModal = () => {
    const { abrirModalConfiguracionIva, fnModalAbrirConfiguracionIva } =
        useUiConfiguracionIva();
    const { fnAsignarIva } = useConfiguracionIvaStore();

    const form = useForm({
        initialValues: {
            tasa_iva: 0,
            descripcion: "",
            fecha_inicio: null,
            fecha_fin: null,
        },
        validate: {
            tasa_iva: isNotEmpty("La tasa del iva es requerida"),
            descripcion: isNotEmpty("La descripcion es requerida"),
        },
    });

    const handleCerrarModal = () => {
        fnModalAbrirConfiguracionIva(false);
        fnAsignarIva(null);
        form.reset();
    };

    return (
        <Modal
            opened={abrirModalConfiguracionIva}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Configuración Iva
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <ConfigIvaForm form={form} />
        </Modal>
    );
};
