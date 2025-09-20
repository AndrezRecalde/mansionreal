import { useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable } from "../../../components";

const huespedes = [
    {
        nombres_hueped: "Juan Perez",
        total_noches: 15,
        total_pagos: 1500,
    },
    {
        nombres_hueped: "Maria Gomez",
        total_noches: 10,
        total_pagos: 1000,
    },
    {
        nombres_hueped: "Carlos Ruiz",
        total_noches: 8,
        total_pagos: 800,
    },
    {
        nombres_hueped: "Ana Martinez",
        total_noches: 12,
        total_pagos: 1200,
    },
];

export const ConsultaClientesTable = () => {
    const columns = useMemo(
        () => [
            {
                header: "Nombre del Huesped",
                accessorKey: "nombres_hueped", //normal accessorKey
                filterVariant: "autocomplete",
            },
            {
                header: "Total Noches",
                accessorKey: "total_noches", //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: "Total de Pagos",
                accessorKey: "total_pagos", //normal accessorKey
                //filterVariant: "autocomplete",
            },
        ],
        [huespedes]
    );

    const table = useMantineReactTable({
        columns,
        data: huespedes, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        //state: { showProgressBars: isLoading },
        enableFacetedValues: true,
        enableRowActions: false,
        enableColumnFilters: false,
        enableSorting: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableHiding: false,
        initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
        localization: MRT_Localization_ES,
        mantineTableProps: {
            withColumnBorders: true,
            striped: true,
            withTableBorder: true,
            //withTableBorder: colorScheme === "light",
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
