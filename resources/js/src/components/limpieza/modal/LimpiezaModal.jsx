import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDepartamentoStore, useUiLimpieza } from "../../../hooks";
import { LimpiezaForm, TextSection } from "../../../components";

export const LimpiezaModal = () => {
    const { abrirModalLimpieza, fnAbrirModalLimpieza } = useUiLimpieza();
    const { activarDepartamento } = useDepartamentoStore();
    const form = useForm({
        initialValues: {
            departamento_id: activarDepartamento?.id || "",
            personal_limpieza: "",
        },
        validate: {
            personal_limpieza: (value) =>
                value.length < 3
                    ? "El nombre del personal de limpieza es muy corto"
                    : null,
        },
        transformValues: (values) => ({
            ...values,
            departamento_id: activarDepartamento?.id
                ? Number(activarDepartamento.id)
                : null,
        }),
    });
    const handleCerrarModal = () => {
        form.reset();
        fnAbrirModalLimpieza(false);
    };

    return (
        <Modal
            centered
            opened={abrirModalLimpieza}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Limpieza
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <LimpiezaForm form={form} />
        </Modal>
    );
};
