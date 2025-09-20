import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ServicioForm, TextSection } from "../../../components";
import { useServicioStore, useUiServicio } from "../../../hooks";

export const ServicioModal = () => {
    const { abrirModalServicio, fnModalAbrirServicio } = useUiServicio();
    const { fnAsignarServicio } = useServicioStore();

    const form = useForm({
        initialValues: {
            nombre_servicio: "",
            tipo_servicio: "",
        },
        validate: {
            nombre_servicio: (value) =>
                value.length < 3 ? "El nombre del servicio es muy corto" : null,
            tipo_servicio: (value) =>
                value.length < 3 ? "El tipo de servicio es muy corto" : null,
        },
    });

    const handleCerrarModal = () => {
        fnModalAbrirServicio(false);
        fnAsignarServicio(null);
        form.reset();
    };

    return (
        <Modal
            centered
            opened={abrirModalServicio}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Servicio
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <ServicioForm form={form} />
        </Modal>
    );
};
