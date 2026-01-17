import { Alert, Box, Button, Divider, Group, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import {
    ReservaInfoHuespedTable,
    PagosTotalesReserva,
} from "../../../components";
import { usePagoStore } from "../../../hooks";

export const ReservaValidacionStep = ({ datos_reserva, onNext }) => {
    const { totalesPagos } = usePagoStore();

    const round = (val) => Number(Number(val).toFixed(2));

    const datosPago =
        totalesPagos && totalesPagos.length > 0 ? totalesPagos[0] : null;

    const saldoCero =
        datosPago && round(parseFloat(datosPago.saldo_pendiente)) === 0;
    const totalesIguales =
        datosPago &&
        round(parseFloat(datosPago.total_consumos)) ===
            round(parseFloat(datosPago.total_pagos));

    const puedeAvanzar = saldoCero && totalesIguales;

    return (
        <Box mt="xl">
            <Stack gap="md">
                {/* Información del huésped */}
                <ReservaInfoHuespedTable datos={datos_reserva} />

                <Divider />

                {/* Totales de pagos */}
                <PagosTotalesReserva totalesPagos={totalesPagos} />

                <Divider />

                {/* Mensaje de validación */}
                {puedeAvanzar ? (
                    <Alert
                        icon={<IconCheck size={16} />}
                        title="Validación Exitosa"
                        color="teal"
                    >
                        <Text size="sm">
                            Los montos coinciden correctamente. Puede continuar
                            con la facturación.
                        </Text>
                    </Alert>
                ) : (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Montos No Coinciden"
                        color="red"
                    >
                        <Text size="sm">
                            {!saldoCero && (
                                <>
                                    Hay un saldo pendiente de{" "}
                                    <strong>
                                        ${datosPago?.saldo_pendiente}
                                    </strong>
                                    .
                                </>
                            )}
                            {!totalesIguales && (
                                <>
                                    {!saldoCero && " Además, "}
                                    Los totales no coinciden. Total consumos:{" "}
                                    <strong>
                                        ${datosPago?.total_consumos}
                                    </strong>
                                    , Total pagos:{" "}
                                    <strong>${datosPago?.total_pagos}</strong>
                                </>
                            )}
                        </Text>
                        <Text size="sm" mt="xs">
                            Debe registrar los pagos faltantes antes de
                            continuar.
                        </Text>
                    </Alert>
                )}

                {/* Botón siguiente */}
                <Group justify="flex-end" mt="xl">
                    <Button
                        onClick={onNext}
                        disabled={!puedeAvanzar}
                        rightSection={<IconCheck size={16} />}
                    >
                        Siguiente: Facturación
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
};
