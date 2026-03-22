import { useEffect, useState } from "react";
import {
    Modal,
    NumberInput,
    Button,
    Stack,
    Text,
    Alert,
    Group,
    Divider,
    Paper,
} from "@mantine/core";
import { useCajasStore } from "../../../hooks";
import {
    IconAlertTriangle,
    IconFileInvoice,
    IconWallet,
} from "@tabler/icons-react";
import Swal from "sweetalert2";

export const CierreCajaModal = () => {
    const {
        isCierreModalOpen,
        setModalCierre,
        reporteCierre,
        fnObtenerReporteCierre,
        fnCerrarTurno,
        cargando,
    } = useCajasStore();

    const [montoDeclarado, setMontoDeclarado] = useState("");
    const [diferencia, setDiferencia] = useState(0);

    useEffect(() => {
        if (isCierreModalOpen) {
            setMontoDeclarado("");
            setDiferencia(0);
            fnObtenerReporteCierre();
        }
    }, [isCierreModalOpen]);

    // Recalcular diferencia en tiempo real
    useEffect(() => {
        if (reporteCierre?.reporte && montoDeclarado !== "") {
            const esperado = reporteCierre.reporte.efectivo_esperado_caja;
            setDiferencia(Number(montoDeclarado) - esperado);
        } else {
            setDiferencia(0);
        }
    }, [montoDeclarado, reporteCierre]);

    const handleCerrarCaja = async () => {
        if (montoDeclarado === "") return;

        const { msg, status } = await fnCerrarTurno(Number(montoDeclarado));
        if (status) {
            Swal.fire({
                title: "¡Caja Cerrada!",
                text: msg,
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            setModalCierre(false);
        } else {
            Swal.fire({
                title: "Error",
                text: msg,
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <Modal
            opened={isCierreModalOpen}
            onClose={() => setModalCierre(false)}
            title={
                <Group gap="sm">
                    <IconFileInvoice size={24} color="#e03131" />
                    <Text fw={700} size="lg">
                        Cierre de Caja Operativo
                    </Text>
                </Group>
            }
            centered
            size="lg"
        >
            <Stack>
                <Alert
                    icon={<IconAlertTriangle size={16} />}
                    title="Validación de Cuadre"
                    color="orange"
                    variant="light"
                >
                    Cuente el efectivo físico en su compartimento de caja e
                    ingrese la cantidad exacta abajo. El sistema auditará la
                    diferencia basada en las ventas y movimientos declarados.
                </Alert>

                <Paper withBorder p="md" radius="md" bg="gray.0">
                    <Stack gap="xs">
                        {reporteCierre?.reporte ? (
                            <>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Monto Apertura:
                                    </Text>
                                    <Text size="sm" fw={500}>
                                        ${" "}
                                        {reporteCierre.reporte.monto_apertura.toFixed(
                                            2,
                                        )}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Ventas en Efectivo (+):
                                    </Text>
                                    <Text size="sm" fw={500} c="green">
                                        ${" "}
                                        {reporteCierre.reporte.ventas_efectivo.toFixed(
                                            2,
                                        )}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Ventas otros Métodos (+):
                                    </Text>
                                    <Text size="sm" fw={500} c="blue">
                                        ${" "}
                                        {reporteCierre.reporte.ventas_otros.toFixed(
                                            2,
                                        )}
                                    </Text>
                                </Group>
                                <Group justify="space-between" mt="xs">
                                    <Text size="sm" fw={600} c="dark">
                                        Total Ingresos por Ventas (=):
                                    </Text>
                                    <Text size="sm" fw={700}>
                                        ${" "}
                                        {(
                                            reporteCierre.reporte
                                                .ventas_efectivo +
                                            reporteCierre.reporte.ventas_otros
                                        ).toFixed(2)}
                                    </Text>
                                </Group>
                                <Divider variant="dashed" my="xs" />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Ingresos Extra (+):
                                    </Text>
                                    <Text size="sm" fw={500} c="green">
                                        ${" "}
                                        {reporteCierre.reporte.ingresos_extra.toFixed(
                                            2,
                                        )}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Egresos / Retiros (-):
                                    </Text>
                                    <Text size="sm" fw={500} c="red">
                                        ${" "}
                                        {reporteCierre.reporte.egresos_extra.toFixed(
                                            2,
                                        )}
                                    </Text>
                                </Group>
                                <Divider my="sm" />
                                <Group justify="space-between">
                                    <Text size="md" fw={600}>
                                        Efectivo Esperado (Sistema):
                                    </Text>
                                    <Text size="md" fw={700}>
                                        ${" "}
                                        {reporteCierre.reporte.efectivo_esperado_caja.toFixed(
                                            2,
                                        )}
                                    </Text>
                                </Group>
                            </>
                        ) : (
                            <Text size="sm">Cargando desglose de caja...</Text>
                        )}
                    </Stack>
                </Paper>

                <NumberInput
                    label="Efectivo Físico Declarado (Solo Dinero en Gaveta)"
                    description="Ingrese el monto total de billetes y monedas que tiene físicamente."
                    placeholder="0.00"
                    size="lg"
                    prefix="$ "
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale
                    value={montoDeclarado}
                    onChange={setMontoDeclarado}
                    required
                    leftSection={<IconWallet size={20} />}
                />

                {montoDeclarado !== "" && (
                    <Alert
                        color={
                            diferencia === 0
                                ? "green"
                                : diferencia > 0
                                  ? "blue"
                                  : "red"
                        }
                        variant="filled"
                    >
                        <Group justify="space-between">
                            <Text fw={600}>Diferencia generada:</Text>
                            <Text fw={700} size="lg">
                                {diferencia > 0 ? "+" : ""}
                                {diferencia.toFixed(2)}
                            </Text>
                        </Group>
                        <Text size="xs" mt="xs">
                            {diferencia === 0 && "Caja cuadrada perfectamente."}
                            {diferencia > 0 && "Sobrante detectado en caja."}
                            {diferencia < 0 && "Faltante detectado en caja."}
                        </Text>
                    </Alert>
                )}

                <Button
                    fullWidth
                    size="md"
                    mt="md"
                    color="red"
                    disabled={montoDeclarado === "" || cargando}
                    loading={cargando}
                    onClick={handleCerrarCaja}
                >
                    Registrar Cierre Permanente
                </Button>
            </Stack>
        </Modal>
    );
};
