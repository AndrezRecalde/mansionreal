import { useCallback, useMemo } from "react";
import { Button } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { useGastoStore, useUiGasto } from "../../../hooks";
import { IconListDetails } from "@tabler/icons-react";

export const GastoDrawerTable = () => {
    const { cargando, gastos } = useGastoStore();
    const { fnAbrirModalGasto, fnAbrirEliminarModalGasto } = useUiGasto();
    const columns = useMemo(
        () => [
            {
                header: "Descripción",
                accessorKey: "descripcion",
                size: 80,
                //filterVariant: "autocomplete",
            },
            {
                header: "Monto",
                accessorKey: "monto",
                size: 80,
                //filterVariant: "autocomplete",
            },
            {
                header: "Tipo de daño",
                accessorKey: "tipo_dano",
                //filterVariant: "autocomplete",
            },
            {
                header: "Fecha de creación",
                accessorKey: "fecha_creacion",
                //filterVariant: "autocomplete",
            },
        ],
        [gastos]
    );

    const handleAbrirGasto = useCallback(
        (selected) => {
            console.log("clic editar");
            fnAbrirModalGasto(true);
        },
        [gastos]
    );

    const handleEliminarGasto = useCallback(
        (selected) => {
            console.log("clic eliminar");
            fnAbrirEliminarModalGasto(true);
        },
        [gastos]
    );

    const table = useMantineReactTable({
        columns,
        data: gastos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        enableFacetedValues: false,
        enableDensityToggle: false,
        enableColumnFilterModes: false,
        enableFullScreenToggle: false,
        enableColumnFilters: true,
        enableGlobalFilter: false,
        enableRowActions: true,
        enableColumnActions: false,
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                leftSection={<IconListDetails size={20} stroke={1.8} />}
                variant="filled"
                color="gray.7"
                onClick={handleAbrirGasto}
            >
                Agregar Gasto
            </Button>
        ),
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EA
                row={row}
                titulo="Eliminar"
                handleAction={handleEliminarGasto}
            />
        ),
        mantineTableProps: {
            withColumnBorders: true,
            withTableBorder: true,
            sx: {
                "thead > tr": {
                    backgroundColor: "inherit",
                },
                "thead > tr > th": {
                    backgroundColor: "inherit",
                },
                "tbody > tr > td": {
                    backgroundColor: "inherit",
                },
            },
        },
    });
    return <ContenidoTable table={table} />;
};
