import { useEffect } from "react";
import { Group, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useConceptoPagoStore, useUiPago } from "../../../hooks";
import { PagoEditarForm, TitlePage } from "../../../components";

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
                    : "",
            monto: (value) =>
                value <= 0 ? "El monto debe ser mayor a cero" : 0,
            concepto_pago_id: (value) =>
                value <= 0 ? "El concepto de pago es requerido" : "",
            metodo_pago: (value) =>
                value.length === 0 ? "El metodo de pago es requerido" : "",
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
                    <TitlePage order={4}>
                        Editar Pago
                    </TitlePage>
                </Group>
            }
            size="lg"
            radius="md"
        >
            <PagoEditarForm form={form} handleCerrarModal={handleCerrarModal} />
        </Modal>
    );
};
