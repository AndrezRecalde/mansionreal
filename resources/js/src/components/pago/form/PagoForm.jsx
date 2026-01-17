import {
    ActionIcon,
    Badge,
    Box,
    Divider,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Textarea,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useConceptoPagoStore, usePagoStore } from "../../../hooks";
import { BtnSection, BtnSubmit } from "../../elements/buttons/BtnServices";

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
        //console.log(form.getTransformedValues());
        fnAgregarPago(form.getTransformedValues()); // aquí llamas a tu API
        form.reset();
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
                        }}
                    >
                        <Group align="center" justify="space-between">
                            <Badge radius="sm" variant="light">
                                Pago # {index + 1}
                            </Badge>
                            {form.values.pagos.length > 1 && (
                                <Tooltip label="Eliminar Pago" withArrow>
                                    <ActionIcon
                                        size="md"
                                        color="red.8"
                                        variant="filled"
                                        onClick={() =>
                                            handleEliminarPago(index)
                                        }
                                        aria-label={`Eliminar pago ${
                                            index + 1
                                        }`}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </Group>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }}>
                            <Select
                                label="Método de pago"
                                placeholder="Seleccionar método"
                                data={[
                                    { value: "EFECTIVO", label: "EFECTIVO" },
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
                                onChange={(value) => {
                                    form.setFieldValue(
                                        `pagos.${index}.metodo_pago`,
                                        value
                                    );
                                    // Limpiar el código voucher si es EFECTIVO
                                    if (value === "EFECTIVO") {
                                        form.setFieldValue(
                                            `pagos.${index}.codigo_voucher`,
                                            ""
                                        );
                                    }
                                }}
                            />
                            <TextInput
                                label="Código Voucher"
                                placeholder="Ej: VCH-001"
                                {...form.getInputProps(
                                    `pagos.${index}.codigo_voucher`
                                )}
                                withAsterisk={
                                    form.values.pagos[index].metodo_pago !==
                                    "EFECTIVO"
                                }
                                disabled={
                                    form.values.pagos[index].metodo_pago ===
                                    "EFECTIVO"
                                }
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
                            <NumberInput
                                label="Monto"
                                withAsterisk
                                min={0}
                                {...form.getInputProps(`pagos.${index}.monto`)}
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
                        {index < form.values.pagos.length - 1 && <Divider variant="dashed" />}
                    </Stack>
                ))}

                <Group justify="space-between">
                    <BtnSection
                        variant="light"
                        IconSection={IconPlus}
                        handleAction={handleAgregarPago}
                    >
                        Agregar otro pago
                    </BtnSection>
                    <Group>
                        <BtnSubmit fullwidth={false} height={40} fontSize={14}>
                            Guardar Pagos
                        </BtnSubmit>
                    </Group>
                </Group>
            </Stack>
        </Box>
    );
};
