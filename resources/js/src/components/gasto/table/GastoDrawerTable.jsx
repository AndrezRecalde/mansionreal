import { useCallback, useMemo } from "react";
import { Button } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { useUiGasto } from "../../../hooks";
import { IconListDetails } from "@tabler/icons-react";

const gastos = [
    {
        descripcion: "Reparación de aire acondicionado",
        monto: "$150.00",
        tipo_dano: "Electrónico",
        fecha_creacion: "2024-10-01",
    },
    {
        descripcion: "Cambio de cerradura",
        monto: "$75.00",
        tipo_dano: "Mecánico",
        fecha_creacion: "2024-10-05",
    },
    {
        descripcion: "Reparación de tubería",
        monto: "$200.00",
        tipo_dano: "Plomería",
        fecha_creacion: "2024-10-10",
    },
];

export const GastoDrawerTable = () => {
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
