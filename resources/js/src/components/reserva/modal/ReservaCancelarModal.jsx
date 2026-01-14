import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ReservaCancelarForm, TextSection } from "../../../components";
import { useUiReservaDepartamento } from "../../../hooks";

export const ReservaCancelarModal = ({ datos_reserva }) => {
    const { abrirModalCancelarReserva, fnAbrirModalCancelarReserva } =
        useUiReservaDepartamento();

    const form = useForm({
        initialValues: {
            motivo_cancelacion: "",
            observacion: "",
        },
        validate: {
            motivo_cancelacion: (value) =>
                value.length === 0
                    ? "Debe ingresar un motivo de cancelación"
                    : null,
        },
        transformValues: (values) => ({
            id: datos_reserva.reserva_id,
            motivo_cancelacion: values.motivo_cancelacion,
            observacion: values.observacion || null,
        }),
    });

    const handleCerrarModal = () => {
        form.reset();
        fnAbrirModalCancelarReserva(false);
    };

    return (
        <Modal
            size="xl"
            opened={abrirModalCancelarReserva}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={18} fw={300}>
                    Cancelar Reserva
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ReservaCancelarForm form={form} datos_reserva={datos_reserva} />
        </Modal>
    );
};
