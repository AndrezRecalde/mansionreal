import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TextSection, ReservaFinalizarForm } from "../../../components";
import { useUiReservaDepartamento } from "../../../hooks";

export const ReservaFinalizarModal = () => {
    const { abrirModalReservaFinalizar, fnAbrirModalReservaFinalizar } =
        useUiReservaDepartamento();
    const form = useForm({
        initialValues: {
            estado: "",
        },
        validate: {
            estado: (value) =>
                value.length === 0 ? "Debe seleccionar un estado" : null,
        },
    });

    const handleCerrarModal = () => {
        form.reset();
        fnAbrirModalReservaFinalizar(false);
    };

    return (
        <Modal
            size="md"
            opened={abrirModalReservaFinalizar}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Finalizar Reserva
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ReservaFinalizarForm form={form} />
        </Modal>
    );
};
