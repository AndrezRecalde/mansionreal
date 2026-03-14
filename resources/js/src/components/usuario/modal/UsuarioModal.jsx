import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { TextSection, UsuarioForm } from "../../../components";
import { useUiUsuario, useUsuarioStore } from "../../../hooks";
import { isNotEmpty, useForm } from "@mantine/form";

export const UsuarioModal = ({ PAGE_TITLE }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { abrirModalUsuario, fnModalUsuario } = useUiUsuario();
    const { fnAsignarUsuario } = useUsuarioStore();

    const form = useForm({
        initialValues: {
            apellidos: "",
            nombres: "",
            dni: "",
            email: "",
            roles: [],
        },
        validate: {
            apellidos: isNotEmpty("Los apellidos son obligatorios"),
            nombres: isNotEmpty("Los nombres son obligatorios"),
            dni: isNotEmpty("El DNI es obligatorio"),
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "El email no es válido",
            roles: isNotEmpty("Debe seleccionar al menos un rol"),
        },
        transformValues: (values) => ({
            ...values,
            dni: values.dni.trim(),
            email: values.email.trim().toLowerCase(),
            roles: values.roles.map(Number),
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
                    {PAGE_TITLE.CAMPOS_MODAL.TITULO_MODAL}
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <UsuarioForm form={form} PAGE_TITLE={PAGE_TITLE} />
        </Modal>
    );
};
