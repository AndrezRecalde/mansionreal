import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import {
    MenuTable_EA,
    ContenidoTable,
    BtnActivarElemento,
} from "../../../components";
import {
    useConfiguracionIvaStore,
    useUiConfiguracionIva,
} from "../../../hooks";
import dayjs from "dayjs";

export const ConfigIvaTable = ({ PAGE_TITLE }) => {
    const { cargando, ivas, fnAsignarIva } = useConfiguracionIvaStore();
    const {
        fnModalAbrirActivarConfiguracionIva,
        fnModalAbrirConfiguracionIva,
    } = useUiConfiguracionIva();

    const columns = useMemo(
        () => [
            {
                header: PAGE_TITLE.NOMBRE_IVA,
                accessorKey: "tasa_iva", //normal accessorKey
            },
            {
                header: PAGE_TITLE.DESCRIPCION,
                accessorKey: "descripcion",
            },
            {
                header: PAGE_TITLE.FECHA_INICIO,
                accessorFn: (row) =>
                    dayjs(row.fecha_inicio).isValid()
                        ? dayjs(row.fecha_inicio).format("YYYY-MM-DD")
                        : PAGE_TITLE.SIN_FECHA, //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.FECHA_FIN,
                accessorFn: (row) =>
                    dayjs(row.fecha_fin).isValid()
                        ? dayjs(row.fecha_fin).format("YYYY-MM-DD")
                        : PAGE_TITLE.SIN_FECHA, //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                id: "activo", //id is still required when using accessorFn instead of accessorKey
                header: PAGE_TITLE.ACTIVO,
                accessorKey: "activo",
                Cell: ({ cell }) => (
                    <BtnActivarElemento
                        cell={cell}
                        handleActivar={handleActivar}
                    />
                ),
                size: 80,
            },
        ],
        [ivas],
    );

    const handleEditar = useCallback(
        (selected) => {
            fnAsignarIva(selected);
            fnModalAbrirConfiguracionIva(true);
        },
        [ivas],
    );

    const handleActivar = useCallback(
        (selected) => {
            fnAsignarIva(selected);
            fnModalAbrirActivarConfiguracionIva(true);
        },
        [ivas],
    );

    const table = useMantineReactTable({
        columns,
        data: ivas, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
