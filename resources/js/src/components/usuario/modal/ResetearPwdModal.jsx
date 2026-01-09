import { Modal } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useUiUsuario } from "../../../hooks";
import { ResetearPwdForm, TextSection } from "../../../components";

export const ResetearPwdModal = () => {
    const { abrirModalResetearPwd, fnModalResetearPwd } = useUiUsuario();
    const form = useForm({
        initialValues: {
            password: "",
            password_confirmation: "",
        },
        validate: {
            password: isNotEmpty(
                "Por favor seleccione la contraseña por defecto"
            ),
        },
    });

    const handleCloseModal = () => {
        fnModalResetearPwd(false);
        form.reset();
    };

    return (
        <Modal
            centered
            opened={abrirModalResetearPwd}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fw={700} fz={16}>
                    Resetear contraseña
                </TextSection>
            }
            size="md"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ResetearPwdForm form={form} />
        </Modal>
    );
};
