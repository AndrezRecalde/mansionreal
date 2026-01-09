import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuTable_EA,
} from "../../../components";
import { useCategoriaStore, useUiCategoria } from "../../../hooks";

export const CategoriaTable = () => {
    const { cargando, categorias, fnAsignarCategoria } = useCategoriaStore();
    const { fnModalAbrirCategoria, fnModalAbrirActivarCategoria } = useUiCategoria();

    const columns = useMemo(
        () => [
            {
                header: "Nombre de Categoria",
                accessorKey: "nombre_categoria", //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                id: "activo", //id is still required when using accessorFn instead of accessorKey
                header: "Activo",
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
        [categorias]
    );

    const handleEditar = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarCategoria(selected);
            fnModalAbrirCategoria(true);
        },
        [categorias]
    );

    const handleActivar = useCallback(
        (selected) => {
            //console.log("clic activar");
            fnAsignarCategoria(selected);
            fnModalAbrirActivarCategoria(true);
        },
        [categorias]
    );

    const table = useMantineReactTable({
        columns,
        data: categorias, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
