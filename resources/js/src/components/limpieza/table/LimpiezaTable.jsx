import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { useLimpiezaStore, useUiLimpieza } from "../../../hooks";
import dayjs from "dayjs";

export const LimpiezaTable = ({ pagination, setPagination, PAGE_TITLE }) => {
    const { limpiezas, paginacion, cargando, fnAsignarLimpieza } =
        useLimpiezaStore();
    const { fnAbrirModalLimpieza } = useUiLimpieza();

    const columns = useMemo(
        () => [
            {
                header: PAGE_TITLE.DEPARTAMENTO,
                accessorKey: "departamento.numero_departamento",
                size: 80,
            },
            {
                header: PAGE_TITLE.FECHA_LIMPIEZA,
                size: 80,
                accessorFn: (row) =>
                    dayjs(row.fecha_limpieza).isValid()
                        ? dayjs(row.fecha_limpieza).format("YYYY-MM-DD HH:mm")
                        : "SIN FECHA",
            },
            {
                header: PAGE_TITLE.PERSONAL,
                accessorKey: "personal_limpieza",
            },
            {
                header: PAGE_TITLE.REGISTRADO_POR,
                accessorFn: (row) =>
                    row.usuario
                        ? `${row.usuario.nombres} ${row.usuario.apellidos}`
                        : "SIN USUARIO",
            },
        ],
        []
    );

    const handleEditar = useCallback(
        (selected) => {
            fnAsignarLimpieza(selected);
            fnAbrirModalLimpieza(true);
        },
        [fnAsignarLimpieza, fnAbrirModalLimpieza]
    );

    const table = useMantineReactTable({
        columns,
        data: limpiezas ?? [],
        state: {
            showProgressBars: cargando,
            pagination,
        },
        onPaginationChange: setPagination,
        rowCount: paginacion?.total ?? 0,
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
