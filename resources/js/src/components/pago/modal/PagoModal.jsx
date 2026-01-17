import { useEffect } from "react";
import { Modal, Group, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useConceptoPagoStore, useUiPago } from "../../../hooks";
import { PagoForm } from "../../../components";

export const PagoModal = ({ reservaId }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
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
        validate: {
            pagos: {
                concepto_pago_id: (value) =>
                    !value || value === ""
                        ? "El concepto de pago es obligatorio"
                        : null,
                monto: (value) => {
                    if (!value || value === 0) {
                        return "El monto es obligatorio";
                    }
                    if (value < 0) {
                        return "El monto debe ser mayor a 0";
                    }
                    return null;
                },
                metodo_pago: (value) =>
                    !value || value === ""
                        ? "El método de pago es obligatorio"
                        : null,
                codigo_voucher: (value, values, path) => {
                    // Extraer el índice del array desde el path
                    const index = parseInt(path.split(".")[1]);
                    const metodo_pago = values.pagos[index]?.metodo_pago;

                    // El código voucher es obligatorio solo si el método NO es EFECTIVO
                    if (
                        metodo_pago !== "EFECTIVO" &&
                        (!value || value === "")
                    ) {
                        return "El código de voucher es obligatorio para este método de pago";
                    }

                    return null;
                },
            },
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
            fnCargarConceptosPagos({ activo: 1 });
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
            fullScreen={isMobile}
            opened={abrirModalRegistroPago}
            onClose={handleCerrarModal}
            title={
                <Group>
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
