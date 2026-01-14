import { Modal } from "@mantine/core";
import { TextSection, ReservaFinalizarForm } from "../../../components";
import { usePagoStore, useUiReservaDepartamento } from "../../../hooks";
import { useEffect } from "react";

export const ReservaFinalizarModal = ({ datos_reserva }) => {
    const { abrirModalReservaFinalizar, fnAbrirModalReservaFinalizar } =
        useUiReservaDepartamento();
    const { fnCargarTotalesPorReserva, fnLimpiarPago } = usePagoStore();

    useEffect(() => {
        if (abrirModalReservaFinalizar) {
            fnCargarTotalesPorReserva({ reserva_id: datos_reserva.reserva_id });
        }

        return () => {
            fnLimpiarPago();
        };
    }, [abrirModalReservaFinalizar]);

    const handleCerrarModal = () => {
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
            <ReservaFinalizarForm datos_reserva={datos_reserva} />
        </Modal>
    );
};
