import { Drawer, Stack } from "@mantine/core";
import { ConsumosDrawerTable } from "../table/ConsumosDrawerTable";
import { useUiConsumo } from "../../../hooks";
import { GastoDrawerTable } from "../../../components";

export const ConsumosDrawer = () => {
    const {
        fnAbrirDrawerConsumosDepartamento,
        abrirDrawerConsumosDepartamento,
    } = useUiConsumo();


    const handleCerrarDrawer = () => {
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
                <ConsumosDrawerTable />
                <GastoDrawerTable />
            </Stack>
        </Drawer>
    );
};
