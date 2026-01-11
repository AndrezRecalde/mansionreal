import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { TextSection, UsuarioForm } from "../../../components";
import { useUiUsuario, useUsuarioStore } from "../../../hooks";
import { isNotEmpty, useForm } from "@mantine/form";

export const UsuarioModal = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { abrirModalUsuario, fnModalUsuario } = useUiUsuario();
    const { fnAsignarUsuario } = useUsuarioStore();

    const form = useForm({
        initialValues: {
            apellidos: "",
            nombres: "",
            dni: "",
            email: "",
            role: null,
        },
        validate: {
            apellidos: isNotEmpty("Los apellidos son obligatorios"),
            nombres: isNotEmpty("Los nombres son obligatorios"),
            dni: isNotEmpty("El DNI es obligatorio"),
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "El email no es válido",
            role: isNotEmpty("El rol es obligatorio"),
        },
        transformValues: (values) => ({
            ...values,
            dni: values.dni.trim(),
            email: values.email.trim().toLowerCase(),
            role: Number(values.role),
        }),
    });

    const handleCerrarModal = () => {
        fnModalUsuario(false);
        fnAsignarUsuario(null);
        form.reset();
    };

    return (
        <Modal
            fullScreen={isMobile}
            opened={abrirModalUsuario}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Usuario
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <UsuarioForm form={form} />
        </Modal>
    );
};
