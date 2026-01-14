import { Box, Divider, Stack } from "@mantine/core";
import {
    BtnSubmit,
    PagosTotalesReserva,
    ReservaInfoHuespedTable,
} from "../../../components";
import {
    usePagoStore,
    useReservaDepartamentoStore,
    useStorageField,
    useUiConsumo,
    useUiReservaDepartamento,
} from "../../../hooks";

export const ReservaFinalizarForm = ({ datos_reserva }) => {
    const { cargando, fnCambiarEstadoReserva, fnExportarNotaVentaPDF } =
        useReservaDepartamentoStore();
    const { totalesPagos } = usePagoStore();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { storageFields } = useStorageField();

    const round = (val) => Number(Number(val).toFixed(2));

    const datosPago =
        totalesPagos && totalesPagos.length > 0 ? totalesPagos[0] : null;

    const saldoCero =
        datosPago && round(parseFloat(datosPago.saldo_pendiente)) === 0;
    const totalesIguales =
        datosPago &&
        round(parseFloat(datosPago.total_consumos)) ===
            round(parseFloat(datosPago.total_pagos));

    const isDisabled = saldoCero && totalesIguales;

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fnCambiarEstadoReserva(
            storageFields
                ? {
                      id,
                      nombre_estado: "PAGADO",
                      storageFields,
                      carga_pagina:
                          storageFields.carga_pagina || "DEPARTAMENTOS",
                  }
                : { id }
        );
        await fnExportarNotaVentaPDF({
            reserva_id: datos_reserva.reserva_id,
        });

        form.reset();
        fnAbrirModalReservaFinalizar(false);
        fnAbrirDrawerConsumosDepartamento(false);
    };

    return (
        <Box
            component="form"
            onClick={(e) => handleSubmit(e)}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="center"
                gap="md"
            >
                <ReservaInfoHuespedTable datos={datos_reserva} />
                <PagosTotalesReserva totalesPagos={totalesPagos} />
                <Divider />
                <BtnSubmit loading={cargando} disabled={isDisabled}>
                    Finalizar Reserva
                </BtnSubmit>
            </Stack>
        </Box>
    );
};
