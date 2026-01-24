import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuAcciones } from "../../../components";
import { useHuespedStore, useUiHuesped } from "../../../hooks";
import { IconEdit } from "@tabler/icons-react";

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
                accessorKey: "nombres_completos",
                filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.CEDULA,
                accessorKey: "dni",
                filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.TELEFONO,
                accessorFn: (row) =>
                    row.telefono || PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.SIN_DATOS,
            },
            {
                header: PAGE_TITLE.HUESPEDES.CAMPOS_TABLA.EMAIL,
                accessorKey: "email",
            },
        ],
        [PAGE_TITLE],
    );

    const handleEditar = useCallback(
        (selected) => {
            fnAsignarHuesped(selected);
            fnModalHuesped(true);
        },
        [fnAsignarHuesped, fnModalHuesped],
    );

    const table = useMantineReactTable({
        columns,
        data: huespedes ?? [],
        state: {
            showProgressBars: cargando,
            pagination, // Usamos el estado local
        },
        localization: MRT_Localization_ES,
        onPaginationChange: setPagination, // Actualiza el estado local
        rowCount: paginacion.total ?? 0,
        manualPagination: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableStickyHeader: true,
        enableColumnPinning: true,
        initialState: {
            density: "md",
            columnPinning: { left: ["mrt-row-actions"] },
        },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
        renderRowActions: ({ row }) => (
            <MenuAcciones
                row={row}
                items={[
                    {
                        label: "Editar",
                        icon: IconEdit,
                        onClick: handleEditar,
                        disabled: false,
                        color: "",
                    },
                ]}
            />
        ),
    });

    return <ContenidoTable table={table} />;
};
