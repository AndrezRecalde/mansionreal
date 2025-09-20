import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TextSection, GastoForm } from "../../../components";
import { useGastoStore, useTiposDanoStore, useUiGasto } from "../../../hooks";

export const GastoModal = () => {
    const { abrirModalGasto, fnAbrirModalGasto } = useUiGasto();
    const { fnAsignarGasto } = useGastoStore();
    const { fnCargarTiposDano, fnLimpiarTiposDano } = useTiposDanoStore();

    const form = useForm({
        initialValues: {
            reserva_id: null,
            descripcion: "",
            monto: "",
            tipo_dano_id: null,
        },
        validate: {
            descripcion: (value) =>
                value.length < 5
                    ? "La descripción debe tener al menos 5 caracteres"
                    : null,
            monto: (value) =>
                isNaN(parseFloat(value)) || parseFloat(value) <= 0
                    ? "El monto debe ser un número positivo"
                    : null,
            tipo_dano_id: (value) =>
                value === null ? "Debe seleccionar un tipo de daño" : null,
        },
        transformValues: (values) => ({
            ...values,
            huesped_id: values.huesped_id ? parseInt(values.huesped_id) : null,
            monto: parseFloat(values.monto),
        }),
    });

    useEffect(() => {
        if (abrirModalGasto) {
            fnCargarTiposDano({ activo: true });
        }

        return () => {
            fnLimpiarTiposDano();
        };
    }, [abrirModalGasto]);

    const handleCerrarModal = () => {
        fnAbrirModalGasto(false);
        fnAsignarGasto(null);
        form.reset();
    };

    return (
        <Modal
            centered
            opened={abrirModalGasto}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Registrar Gastos por Daños
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <GastoForm form={form} />
        </Modal>
    );
};
