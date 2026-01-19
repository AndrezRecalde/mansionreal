import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { TextSection } from "../../../components";
import { ReservaFinalizarStepper } from "../../../components";
import {
    usePagoStore,
    useUiReservaDepartamento,
    useFacturaStore,
    useClienteFacturacionStore,
} from "../../../hooks";

export const ReservaFinalizarModal = ({ datos_reserva }) => {
    const { abrirModalReservaFinalizar, fnAbrirModalReservaFinalizar } =
        useUiReservaDepartamento();
    const { fnCargarTotalesPorReserva } = usePagoStore();
    const { fnLimpiarFacturas } = useFacturaStore();
    const { fnLimpiarCliente } = useClienteFacturacionStore();

    useEffect(() => {
        if (abrirModalReservaFinalizar) {
            fnCargarTotalesPorReserva({ reserva_id: datos_reserva.reserva_id });
        }

        return () => {
            //fnLimpiarPago();
            fnLimpiarFacturas();
            fnLimpiarCliente();
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
                <TextSection tt="" fz={18} fw={500}>
                    Finalizar Reserva y Facturación
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            <ReservaFinalizarStepper datos_reserva={datos_reserva} />
        </Modal>
    );
};
