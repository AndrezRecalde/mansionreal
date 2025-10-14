import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { useHuespedStore, useUiHuesped } from "../../../hooks";



export const HuespedTable = () => {
    const { cargando, huespedes, fnAsignarHuesped } = useHuespedStore();
    const { fnModalHuesped } = useUiHuesped();

    const columns = useMemo(
        () => [
            {
                header: "Nombres Completos",
                accessorFn: (row) => row.apellidos + " " + row.nombres, //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: "Cedula",
                accessorKey: "dni", //normal accessorKey
            },
            {
                header: "Telefono",
                accessorFn: (row) => row.telefono || "SIN DATOS", //normal accessorKey
            },
            {
                header: "Email",
                accessorKey: "email", //normal accessorKey
            },
            {
                header: "Nacionalidad",
                accessorFn: (row) => row.nacionalidad || "SIN DATOS", //normal accessorKey
            },
        ],
        [huespedes]
    );

    const handleEditar = useCallback(
        (selected) => {
            fnAsignarHuesped(selected);
            fnModalHuesped(true);
        },
        [huespedes]
    );

    const table = useMantineReactTable({
        columns,
        data: huespedes, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EA
                row={row}
                titulo="Editar"
                handleAction={handleEditar}
            />
        ),
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
