import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import {
    ContenidoTable,
    BtnActivarElemento,
    MenuAcciones,
} from "../../../components";
import {
    useConfiguracionIvaStore,
    useUiConfiguracionIva,
} from "../../../hooks";
import { IconEdit } from "@tabler/icons-react";
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
        localization: MRT_Localization_ES,
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
