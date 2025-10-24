import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TextSection, ReservaFinalizarForm } from "../../../components";
import { usePagoStore, useUiReservaDepartamento } from "../../../hooks";
import { useEffect } from "react";

export const ReservaFinalizarModal = ({ datos_reserva }) => {
    const { abrirModalReservaFinalizar, fnAbrirModalReservaFinalizar } =
        useUiReservaDepartamento();
    const { fnCargarTotalesPorReserva, fnLimpiarPago } = usePagoStore();

    const form = useForm({
        initialValues: {
            nombre_estado: "",
            motivo_cancelacion: "",
            observacion: "",
        },
        validate: {
            nombre_estado: (value) =>
                value.length === 0 ? "Debe seleccionar un estado" : null,
            motivo_cancelacion: (value, values) =>
                values.nombre_estado === "CANCELADO" && value.length === 0
                    ? "Debe ingresar un motivo de cancelación"
                    : null,
        },
        transformValues: (values) => {
            const transformed = {
                id: datos_reserva.reserva_id,
                nombre_estado: values.nombre_estado,
            };

            // Solo agregar campos de cancelación si el estado es CANCELADO
            if (values.nombre_estado === "CANCELADO") {
                transformed.motivo_cancelacion = values.motivo_cancelacion;
                transformed.observacion = values.observacion || null;
            }

            return transformed;
        },
    });

    useEffect(() => {
        if (abrirModalReservaFinalizar) {
            fnCargarTotalesPorReserva({ reserva_id: datos_reserva.reserva_id });
        }

        return () => {
            fnLimpiarPago();
        };
    }, [abrirModalReservaFinalizar]);

    const handleCerrarModal = () => {
        form.reset();
        fnAbrirModalReservaFinalizar(false);
    };

    return (
        <Modal
            size="xl"
            opened={abrirModalReservaFinalizar}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={18} fw={300}>
                    Finalizar Reserva
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ReservaFinalizarForm form={form} datos_reserva={datos_reserva} />
        </Modal>
    );
};
