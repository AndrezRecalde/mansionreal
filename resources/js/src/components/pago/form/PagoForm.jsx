import {
    Box,
    Button,
    Divider,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useConceptoPagoStore, usePagoStore } from "../../../hooks";

export const PagoForm = ({ form, handleCerrarModal }) => {
    const { conceptosPagos } = useConceptoPagoStore();
    const { fnAgregarPago } = usePagoStore();

    const handleAgregarPago = () => {
        form.insertListItem("pagos", {
            codigo_voucher: "",
            concepto_pago_id: "",
            monto: 0,
            metodo_pago: "",
            observaciones: "",
        });
    };

    const handleEliminarPago = (index) => {
        form.removeListItem("pagos", index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getTransformedValues());
        fnAgregarPago(form.getTransformedValues()); // aquí llamas a tu API
        handleCerrarModal();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack>
                {form.values.pagos.map((_, index) => (
                    <Stack
                        key={index}
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
                                {...form.getInputProps(
                                    `pagos.${index}.codigo_voucher`
                                )}
                            />
                            <NumberInput
                                label="Monto"
                                withAsterisk
                                min={0}
                                {...form.getInputProps(`pagos.${index}.monto`)}
                            />

                            <Select
                                label="Concepto de pago"
                                placeholder="Seleccionar concepto"
                                data={conceptosPagos.map((c) => ({
                                    value: c.id.toString(),
                                    label: c.nombre_concepto,
                                }))}
                                withAsterisk
                                {...form.getInputProps(
                                    `pagos.${index}.concepto_pago_id`
                                )}
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
                                {...form.getInputProps(
                                    `pagos.${index}.metodo_pago`
                                )}
                            />
                        </SimpleGrid>
                        <Textarea
                            label="Observaciones"
                            placeholder="Escribir observaciones..."
                            autosize
                            minRows={2}
                            {...form.getInputProps(
                                `pagos.${index}.observaciones`
                            )}
                        />

                        <Group justify="flex-end">
                            {form.values.pagos.length > 1 && (
                                <Button
                                    variant="light"
                                    color="red"
                                    leftSection={<IconTrash size={16} />}
                                    onClick={() => handleEliminarPago(index)}
                                >
                                    Eliminar
                                </Button>
                            )}
                        </Group>

                        {index < form.values.pagos.length - 1 && <Divider />}
                    </Stack>
                ))}

                <Group justify="space-between" mt="md">
                    <Button
                        variant="light"
                        color="blue"
                        leftSection={<IconPlus size={16} />}
                        onClick={handleAgregarPago}
                    >
                        Agregar otro pago
                    </Button>
                    <Group>
                        <Button variant="default" onClick={handleCerrarModal}>
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar Pagos</Button>
                    </Group>
                </Group>
            </Stack>
        </Box>
    );
};
