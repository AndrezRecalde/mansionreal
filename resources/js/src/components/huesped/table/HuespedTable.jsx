import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { useHuespedStore, useUiHuesped } from "../../../hooks";

export const HuespedTable = ({ pagination, setPagination, PAGE_TITLE }) => {
    const {
        cargando,
        huespedes,
        paginacion, // { total, por_pagina, pagina_actual, ultima_pagina, desde, hasta }
        fnAsignarHuesped,
    } = useHuespedStore();

    const { fnModalHuesped } = useUiHuesped();

    const columns = useMemo(
        () => [
            {
                header: PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.NOMBRES_COMPLETOS,
                accessorFn: (row) => row.apellidos + " " + row.nombres,
                filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.CEDULA,
                accessorKey: "dni",
                filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.TELEFONO,
                accessorFn: (row) => row.telefono || PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.SIN_DATOS,
            },
            {
                header: PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.EMAIL,
                accessorKey: "email",
            },
        ],
        [PAGE_TITLE]
    );

    const handleEditar = useCallback(
        (selected) => {
            fnAsignarHuesped(selected);
            fnModalHuesped(true);
        },
        [fnAsignarHuesped, fnModalHuesped]
    );

    const table = useMantineReactTable({
        columns,
        data: huespedes ?? [],
        state: {
            showProgressBars: cargando,
            pagination, // Usamos el estado local
        },
        onPaginationChange: setPagination, // Actualiza el estado local
        rowCount: paginacion.total ?? 0,
        manualPagination: true,
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
