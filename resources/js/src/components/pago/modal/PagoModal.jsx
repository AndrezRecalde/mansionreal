import { useEffect } from "react";
import { Modal, Group, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCash } from "@tabler/icons-react";
import { useConceptoPagoStore, useUiPago } from "../../../hooks";
import { PagoForm } from "../form/PagoForm";

export const PagoModal = ({ reservaId }) => {
    const { abrirModalRegistroPago, fnAbrirModalRegistroPago } = useUiPago();
    const { fnCargarConceptosPagos, fnLimpiarConceptosPagos } =
        useConceptoPagoStore();
    // Inicializamos el form
    const form = useForm({
        initialValues: {
            pagos: [
                {
                    codigo_voucher: "",
                    concepto_pago_id: "",
                    monto: 0,
                    metodo_pago: "",
                    observaciones: "",
                },
            ],
        },
        transformValues: (values) => ({
            pagos: values.pagos.map((p) => ({
                ...p,
                concepto_pago_id: Number(p.concepto_pago_id),
                monto: parseFloat(p.monto),
            })),
            reserva_id: reservaId,
        }),
    });

    // Cargar conceptos cuando se abre el modal
    useEffect(() => {
        if (abrirModalRegistroPago) {
            fnCargarConceptosPagos({ activo: true });
        }
        return () => {
            fnLimpiarConceptosPagos();
        };
    }, [abrirModalRegistroPago]);

    const handleCerrarModal = () => {
        fnAbrirModalRegistroPago(false);
        form.reset();
    };

    return (
        <Modal
            opened={abrirModalRegistroPago}
            onClose={handleCerrarModal}
            title={
                <Group>
                    <IconCash size={25} />
                    <Title order={4} fw={700}>
                        Registrar Pagos
                    </Title>
                </Group>
            }
            size="lg"
            radius="md"
        >
            <PagoForm form={form} handleCerrarModal={handleCerrarModal} />
        </Modal>
    );
};
