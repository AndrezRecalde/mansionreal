import { useEffect } from "react";
import { Modal, Group, Button, Stack } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { IconX, IconCheck } from "@tabler/icons-react";
import { TextSection, ConsumoDescuentoForm } from "../../../components";
import { useConsumoStore, useUiConsumo } from "../../../hooks";
import Swal from "sweetalert2";

export const ConsumoAplicarDescuentoModal = () => {
    const {
        activarConsumo,
        cargando,
        fnAplicarDescuentoConsumo,
        fnAsignarConsumo,
    } = useConsumoStore();
    const { abrirModalAplicarDescuento, fnAbrirModalAplicarDescuento } =
        useUiConsumo();

    const form = useForm({
        initialValues: {
            tipo_descuento: "MONTO_FIJO",
            descuento: 0,
            porcentaje_descuento: 0,
            motivo_descuento: "",
        },
        validate: {
            descuento: (value, values) => {
                if (values.tipo_descuento === "MONTO_FIJO") {
                    const monto = parseFloat(value) || 0;
                    if (monto <= 0) {
                        return "El monto debe ser mayor a 0";
                    }
                    if (activarConsumo && monto > activarConsumo.subtotal) {
                        return "El descuento no puede ser mayor al subtotal";
                    }
                }
                return null;
            },
            porcentaje_descuento: (value, values) => {
                if (values.tipo_descuento === "PORCENTAJE") {
                    const porcentaje = parseFloat(value) || 0;
                    if (porcentaje <= 0) {
                        return "El porcentaje debe ser mayor a 0";
                    }
                    if (porcentaje > 100) {
                        return "El porcentaje no puede ser mayor a 100";
                    }
                }
                return null;
            },
            motivo_descuento: (value, values) => {
                // ✅ ACTUALIZADO: Calcular porcentaje real
                if (!activarConsumo) return null;

                let porcentajeReal = 0;

                if (values.tipo_descuento === "PORCENTAJE") {
                    porcentajeReal =
                        parseFloat(values.porcentaje_descuento) || 0;
                } else if (values.tipo_descuento === "MONTO_FIJO") {
                    const descuento = parseFloat(values.descuento) || 0;
                    porcentajeReal =
                        (descuento / activarConsumo.subtotal) * 100;
                }

                // Solo obligatorio si el descuento es > 50%
                if (porcentajeReal > 50 && !value?.trim()) {
                    return "El motivo es obligatorio para descuentos mayores al 50%";
                }
                return null;
            },
        },
    });

    useEffect(() => {
        if (abrirModalAplicarDescuento && activarConsumo) {
            // Reset form cuando se abre el modal
            form.reset();
        }
    }, [abrirModalAplicarDescuento, activarConsumo]);

    const handleCerrarModal = () => {
        fnAbrirModalAplicarDescuento(false);
        fnAsignarConsumo(null);
        form.reset();
    };

    const handleSubmit = async (values) => {
        // Validar formulario
        if (!form.isValid()) {
            return;
        }

        // Validar consumo activo
        if (!activarConsumo) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se ha seleccionado un consumo",
            });
            return;
        }

        // Preparar datos según tipo de descuento
        let datosDescuento = {
            motivo_descuento: values.motivo_descuento?.trim() || null,
        };

        if (values.tipo_descuento === "MONTO_FIJO") {
            datosDescuento.descuento = parseFloat(values.descuento);
            datosDescuento.tipo_descuento = "MONTO_FIJO";
            datosDescuento.porcentaje_descuento = null;
        } else {
            datosDescuento.descuento = parseFloat(values.porcentaje_descuento);
            datosDescuento.tipo_descuento = "PORCENTAJE";
            datosDescuento.porcentaje_descuento = parseFloat(
                values.porcentaje_descuento,
            );
        }

        // Confirmar antes de aplicar
        const result = await Swal.fire({
            icon: "question",
            title: "¿Aplicar descuento?",
            html: `
                <div style="text-align: left;">
                    <p><strong>Producto:</strong> ${activarConsumo.nombre_producto}</p>
                    <p><strong>Descuento:</strong> ${
                        values.tipo_descuento === "MONTO_FIJO"
                            ? `$${parseFloat(values.descuento).toFixed(2)}`
                            : `${parseFloat(values.porcentaje_descuento).toFixed(2)}%`
                    }</p>
                    ${
                        values.motivo_descuento
                            ? `<p><strong>Motivo:</strong> ${values.motivo_descuento}</p>`
                            : ""
                    }
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Sí, aplicar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#12b886",
        });

        if (result.isConfirmed) {
            //console.log(datosDescuento);
            const resultado = await fnAplicarDescuentoConsumo(
                activarConsumo.id,
                datosDescuento,
            );

            if (resultado) {
                handleCerrarModal();
            }
        }
    };

    return (
        <Modal
            opened={abrirModalAplicarDescuento}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={18} fw={500}>
                    Aplicar Descuento al Consumo
                </TextSection>
            }
            size="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            closeOnClickOutside={false}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <ConsumoDescuentoForm
                        form={form}
                        consumo={activarConsumo}
                    />

                    {/* Botones de acción */}
                    <Group justify="flex-end" mt="xl">
                        <Button
                            variant="default"
                            onClick={handleCerrarModal}
                            leftSection={<IconX size={16} />}
                            disabled={cargando}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="teal"
                            leftSection={<IconCheck size={16} />}
                            loading={cargando}
                        >
                            Aplicar Descuento
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
