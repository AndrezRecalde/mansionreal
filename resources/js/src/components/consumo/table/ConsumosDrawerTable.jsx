import { useCallback, useMemo } from "react";
import { Button } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useUiConsumo } from "../../../hooks";

// Datos de ejemplo
const productos = [
    {
        nombre_producto: "Coca Cola",
        cantidad: 2,
        total: "$3.00",
    },
    {
        nombre_producto: "Papas Fritas",
        cantidad: 1,
        total: "$0.80",
    },
    {
        nombre_producto: "Jabón Líquido",
        cantidad: 1,
        total: "$2.50",
    },
];

export const ConsumosDrawerTable = () => {
    const { fnAbrirModalConsumo } = useUiConsumo();
    const columns = useMemo(
        () => [
            {
                header: "Producto",
                accessorKey: "nombre_producto",
                size: 80,
                //filterVariant: "autocomplete",
            },
            {
                header: "Cantidad",
                accessorKey: "cantidad",
                //filterVariant: "autocomplete",
            },
            {
                header: "Total",
                accessorKey: "total",
                //filterVariant: "autocomplete",
            },
        ],
        [productos]
    );

    const handleAbrirConsumo = useCallback(
        (selected) => {
            fnAbrirModalConsumo(true);
        },
        [productos]
    );

     const handleEliminarConsumo = useCallback(
        (selected) => {
            console.log("Eliminar consumo:", selected);
        },
        [productos]
    );

    const table = useMantineReactTable({
        columns,
        data: productos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        //state: { showProgressBars: isLoading },
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
                leftSection={<IconShoppingCartPlus size={20} stroke={1.8} />}
                variant="filled"
                color="gray.7"
                onClick={handleAbrirConsumo}
            >
                Agregar Consumo
            </Button>
        ),
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EA
                row={row}
                titulo="Eliminar"
                handleAction={handleEliminarConsumo}
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
