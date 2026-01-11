import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DepartamentoForm, TextSection } from "../../../components";
import { useTipoDepartamentoStore, useUiDepartamento } from "../../../hooks";
import { useForm } from "@mantine/form";

export const DepartamentoModal = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { abrirModalDepartamento, fnModalAbrirDepartamento } =
        useUiDepartamento();
    const { fnCargarTiposDepartamentos, fnLimpiarTiposDepartamentos } =
        useTipoDepartamentoStore();

    const form = useForm({
        initialValues: {
            numero_departamento: "",
            tipo_departamento_id: null,
            capacidad: 1,
            descripcion: "",
            imagenes: [],
        },
        validate: {
            numero_departamento: (value) =>
                value.length < 1 ? "Número de departamento es requerido" : null,
            tipo_departamento_id: (value) =>
                value === null ? "Tipo de departamento es requerido" : null,
            capacidad: (value) =>
                value < 1 ? "Capacidad debe ser mayor a 0" : null,
            descripcion: (value) =>
                value.length > 255
                    ? "Descripción no debe exceder los 255 caracteres"
                    : null,
            /* imagenes: (value) =>
                value.length < 1 ? "Debe seleccionar al menos una imagen" : null, */
        },
        transformValues: (values) => ({
            ...values,
            tipo_departamento_id: Number(values.tipo_departamento_id),
        }),
    });

    useEffect(() => {
        if (abrirModalDepartamento) {
            fnCargarTiposDepartamentos();
        }
        return () => {
            fnLimpiarTiposDepartamentos();
        };
    }, [abrirModalDepartamento]);

    const handleCerrarModal = () => {
        fnModalAbrirDepartamento(false);
        form.reset();
    };

    return (
        <Modal
            fullScreen={isMobile}
            opened={abrirModalDepartamento}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Departamento
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <DepartamentoForm form={form} />
        </Modal>
    );
};
