import { useEffect } from "react";
import {
    Box,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../elements/buttons/BtnServices";
import { useConceptoPagoStore, usePagoStore } from "../../../hooks";

export const PagoEditarForm = ({ form, handleCerrarModal }) => {
    const { conceptosPagos } = useConceptoPagoStore();
    const { fnAgregarPago, activarPago } = usePagoStore();

    useEffect(() => {
        if (activarPago !== null) {
            form.setValues({
                id: activarPago.id,
                codigo_voucher: activarPago.codigo_voucher,
                concepto_pago_id: activarPago.concepto_pago_id.toString(),
                monto: activarPago.monto,
                metodo_pago: activarPago.metodo_pago,
                observaciones: activarPago.observaciones || "",
            });
            return;
        }
    }, [activarPago]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.getTransformedValues());
        fnAgregarPago(form.getTransformedValues());
        handleCerrarModal();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack
                p="md"
                style={{
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                }}
            >
                <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }}>
                    <TextInput
                        label="Código Voucher"
                        placeholder="Ej: VCH-001"
                        withAsterisk
                        {...form.getInputProps("codigo_voucher")}
                    />
                    <NumberInput
                        label="Monto"
                        withAsterisk
                        min={0}
                        {...form.getInputProps("monto")}
                    />

                    <Select
                        label="Concepto de pago"
                        placeholder="Seleccionar concepto"
                        data={conceptosPagos.map((c) => ({
                            value: c.id.toString(),
                            label: c.nombre_concepto,
                        }))}
                        withAsterisk
                        {...form.getInputProps("concepto_pago_id")}
                    />
                    <Select
                        label="Método de pago"
                        placeholder="Seleccionar método"
                        data={[
                            {
                                value: "EFECTIVO",
                                label: "EFECTIVO",
                            },
                            {
                                value: "TRANSFERENCIA",
                                label: "TRANSFERENCIA",
                            },
                            { value: "TARJETA", label: "TARJETA" },
                            { value: "OTRO", label: "OTRO" },
                        ]}
                        withAsterisk
                        {...form.getInputProps("metodo_pago")}
                    />
                </SimpleGrid>
                <Textarea
                    label="Observaciones"
                    placeholder="Escribir observaciones..."
                    autosize
                    minRows={2}
                    {...form.getInputProps("observaciones")}
                />
                <BtnSubmit>Guardar Cambios</BtnSubmit>
            </Stack>
        </Box>
    );
};
