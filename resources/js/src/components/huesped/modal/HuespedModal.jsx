import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { HuespedForm, TextSection } from "../../../components";
import { useHuespedStore, useUiHuesped } from "../../../hooks";

export const HuespedModal = () => {
    const { abrirModalHuesped, fnModalHuesped } = useUiHuesped();
    const { fnAsignarHuesped } = useHuespedStore();

    const form = useForm({
        initialValues: {
            nombres: "",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            provincia_id: "",
        },
        validate: {
            nombres: (value) =>
                value.length < 2
                    ? "Los nombres deben tener al menos 2 caracteres"
                    : null,
            apellidos: (value) =>
                value.length < 2
                    ? "Los apellidos deben tener al menos 2 caracteres"
                    : null,
            dni: (value) =>
                value.length < 10 || value.length > 15
                    ? "La cedula debe tener entre 10 y 15 caracteres"
                    : null,
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "El email no es valido",
            direccion: (value) =>
                value.length < 2
                    ? "La direccion debe tener al menos 2 caracteres"
                    : null,
        },
        transformValues: (values) => ({
            ...values,
            provincia_id: values.provincia_id
                ? parseInt(values.provincia_id)
                : null,
        }),
    });

    useEffect(() => {
        if (abrirModalHuesped) {
        }

        return () => {};
    }, [abrirModalHuesped]);

    const handleCerrarModal = () => {
        fnModalHuesped(false);
        fnAsignarHuesped(null);
        form.reset();
    };

    return (
        <Modal
            opened={abrirModalHuesped}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Huesped
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <HuespedForm form={form} />
        </Modal>
    );
};
