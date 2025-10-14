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
        },
        validate: {
            nombre_estado: (value) =>
                value.length === 0 ? "Debe seleccionar un estado" : null,
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
            size="lg"
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
