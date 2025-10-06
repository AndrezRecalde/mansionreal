import { useEffect } from "react";
import { Group, Modal, Title } from "@mantine/core";
import { useConceptoPagoStore, useUiPago } from "../../../hooks";
import { IconEdit } from "@tabler/icons-react";
import { PagoEditarForm } from "../form/PagoEditarForm";
import { useForm } from "@mantine/form";

export const PagoEditarModal = ({ reservaId }) => {
    const { abrirModalEditarRegistroPago, fnAbrirModalEditarRegistroPago } =
        useUiPago();
    const { fnCargarConceptosPagos, fnLimpiarConceptosPagos } =
        useConceptoPagoStore();

    const form = useForm({
        initialValues: {
            codigo_voucher: "",
            concepto_pago_id: "",
            monto: 0,
            metodo_pago: "",
            observaciones: "",
        },
        validate: {
            codigo_voucher: (value) =>
                value.length === 0
                    ? "El codigo del voucher es requerido"
                    : null,
            monto: (value) =>
                value <= 0 ? "El monto debe ser mayor a cero" : null,
            concepto_pago_id: (value) =>
                value <= 0 ? "El concepto de pago es requerido" : null,
            metodo_pago: (value) =>
                value.length === 0 ? "El metodo de pago es requerido" : null,
        },
        transformValues: (values) => ({
            ...values,
            concepto_pago_id: Number(values.concepto_pago_id),
            monto: parseFloat(values.monto),
            reserva_id: reservaId,
        }),
    });

    useEffect(() => {
        if (abrirModalEditarRegistroPago) {
            fnCargarConceptosPagos({ activo: true });
        }
        return () => {
            fnLimpiarConceptosPagos();
        };
    }, [abrirModalEditarRegistroPago]);

    const handleCerrarModal = () => {
        fnAbrirModalEditarRegistroPago(false);
        form.reset();
    };

    return (
        <Modal
            opened={abrirModalEditarRegistroPago}
            onClose={handleCerrarModal}
            title={
                <Group>
                    <IconEdit size={25} />
                    <Title order={4} fw={700}>
                        Editar Pago
                    </Title>
                </Group>
            }
            size="lg"
            radius="md"
        >
            <PagoEditarForm form={form} handleCerrarModal={handleCerrarModal} />
        </Modal>
    );
};
