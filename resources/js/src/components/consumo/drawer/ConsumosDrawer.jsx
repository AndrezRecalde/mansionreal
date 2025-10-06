import { useEffect, useMemo } from "react";
import { Card, Drawer, Stack } from "@mantine/core";
import { ConsumosDrawerTable } from "../table/ConsumosDrawerTable";
import { useConsumoStore, useGastoStore, usePagoStore, useUiConsumo } from "../../../hooks";
import {
    GastoDrawerTable,
    PagosTable,
    ReservaAccionesTable,
    ReservaInfoHuespedTable,
} from "../../../components";
import { Roles } from "../../../helpers/getPrefix";

export const ConsumosDrawer = ({ datos_reserva, fnAsignarElemento }) => {
    const usuario = useMemo(
        () => JSON.parse(localStorage.getItem("service_user")),
        []
    );
    const {
        fnAbrirDrawerConsumosDepartamento,
        abrirDrawerConsumosDepartamento,
    } = useUiConsumo();

    const { fnCargarConsumos } = useConsumoStore();

    const { fnCargarGastos } = useGastoStore();
    const { fnCargarPagos } = usePagoStore();

    useEffect(() => {
        if (abrirDrawerConsumosDepartamento) {
            fnCargarConsumos({ reserva_id: datos_reserva.reserva_id });
            if (
                usuario.role === Roles.GERENCIA ||
                usuario.role === Roles.ADMINISTRADOR
            ) {
                fnCargarGastos({ reserva_id: datos_reserva.reserva_id });
                fnCargarPagos({ reserva_id: datos_reserva.reserva_id });
            }
        }
    }, [abrirDrawerConsumosDepartamento]);

    const handleCerrarDrawer = () => {
        fnAsignarElemento(null); // Limpiar el departamento activo al cerrar el drawer
        fnAbrirDrawerConsumosDepartamento(false);
    };

    return (
        <Drawer
            position="right"
            size="xl"
            offset={8}
            radius="md"
            opened={abrirDrawerConsumosDepartamento}
            onClose={handleCerrarDrawer}
            title="Historial de Consumos"
        >
            <Stack>
                <Card withBorder shadow="sm" radius="sm" p="sm">
                    <ReservaAccionesTable datos={datos_reserva} />
                </Card>
                <ReservaInfoHuespedTable datos={datos_reserva} />
                <PagosTable />
                <ConsumosDrawerTable />
                <GastoDrawerTable />
            </Stack>
        </Drawer>
    );
};
