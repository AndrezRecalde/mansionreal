import { useState } from "react";
import {
    Modal,
    Stack,
    Text,
    Textarea,
    Alert,
    Button,
    Group,
    Paper,
} from "@mantine/core";
import { IconAlertTriangle, IconTrash, IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useFacturaStore } from "../../../hooks";
import Swal from "sweetalert2";
import { useMediaQuery } from "@mantine/hooks";

export const FacturaAnularModal = ({ opened, onClose }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const {
        activarFactura,
        cargando,
        ultimosFiltros,
        fnAnularFactura,
        fnCargarEstadisticasFacturacion,
    } = useFacturaStore();
    const [confirmando, setConfirmando] = useState(false);

    const form = useForm({
        initialValues: {
            motivo_anulacion: "",
        },
        validate: {
            motivo_anulacion: (value) =>
                value.trim().length < 10
                    ? "El motivo debe tener al menos 10 caracteres"
                    : null,
        },
    });

    const handleSubmit = async (values) => {
        if (!activarFactura) return;

        try {
            await fnAnularFactura(activarFactura.id, values.motivo_anulacion);
            await fnCargarEstadisticasFacturacion({
                p_fecha_inicio: ultimosFiltros?.p_fecha_inicio,
                p_fecha_fin: ultimosFiltros?.p_fecha_fin,
                p_anio: ultimosFiltros?.p_anio,
            });
            form.reset();
            setConfirmando(false);
            onClose();
        } catch (error) {
            //console.error("Error al anular factura:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error?.msg ||
                    "Ocurrió un error al intentar anular la factura.",
            });
        }
    };

    const handleClose = () => {
        form.reset();
        setConfirmando(false);
        onClose();
    };

    if (!activarFactura) return null;

    return (
        <Modal
            fullScreen={isMobile}
            opened={opened}
            onClose={handleClose}
            title={
                <Group>
                    <IconAlertTriangle size={24} color="red" />
                    <Text fw={700} size="lg">
                        Anular Factura
                    </Text>
                </Group>
            }
            size="md"
            padding="lg"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    {/* Alerta de Advertencia */}
                    <Alert
                        icon={<IconAlertTriangle size={16} />}
                        title="⚠️ Acción Irreversible"
                        color="red"
                    >
                        <Text size="sm">
                            Esta acción anulará permanentemente la factura{" "}
                            <strong>{activarFactura.numero_factura}</strong>.
                        </Text>
                        <Text size="sm" mt="xs">
                            Una vez anulada, NO se puede revertir. Se guardará
                            en el historial para auditoría.
                        </Text>
                    </Alert>

                    {/* Información de la Factura */}
                    <Paper p="md" withBorder>
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Número de Factura:
                                </Text>
                                <Text size="sm" fw={600}>
                                    {activarFactura.numero_factura}
                                </Text>
                            </Group>
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Cliente:
                                </Text>
                                <Text size="sm" fw={500}>
                                    {activarFactura.cliente_apellidos}{" "}
                                    {activarFactura.cliente_nombres}
                                </Text>
                            </Group>
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Total:
                                </Text>
                                <Text size="sm" fw={600} c="teal">
                                    $
                                    {parseFloat(
                                        activarFactura.total_factura
                                    ).toFixed(2)}
                                </Text>
                            </Group>
                        </Stack>
                    </Paper>

                    {/* Motivo de Anulación */}
                    <Textarea
                        label="Motivo de Anulación"
                        placeholder="Explique detalladamente el motivo de la anulación (mínimo 10 caracteres)"
                        description="Este motivo quedará registrado permanentemente"
                        required
                        minRows={4}
                        maxRows={6}
                        {...form.getInputProps("motivo_anulacion")}
                    />

                    {/* Confirmación Adicional */}
                    {!confirmando && (
                        <Alert color="yellow" title="Confirmación Requerida">
                            <Text size="sm" mb="md">
                                Para continuar, debe confirmar que desea anular
                                esta factura.
                            </Text>
                            <Button
                                fullWidth
                                color="yellow"
                                variant="light"
                                onClick={() => setConfirmando(true)}
                            >
                                Confirmar Anulación
                            </Button>
                        </Alert>
                    )}

                    {/* Botones de Acción */}
                    {confirmando && (
                        <Group justify="space-between" mt="md">
                            <Button
                                leftSection={<IconX size={16} />}
                                onClick={handleClose}
                                variant="default"
                                disabled={cargando}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                leftSection={<IconTrash size={16} />}
                                color="red"
                                loading={cargando}
                            >
                                Anular Factura Definitivamente
                            </Button>
                        </Group>
                    )}
                </Stack>
            </form>
        </Modal>
    );
};
