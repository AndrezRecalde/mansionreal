import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuAcciones,
} from "../../../components";
import { useCategoriaStore, useUiCategoria } from "../../../hooks";
import { IconEdit } from "@tabler/icons-react";

export const CategoriaTable = () => {
    const { cargando, categorias, fnAsignarCategoria } = useCategoriaStore();
    const { fnModalAbrirCategoria, fnModalAbrirActivarCategoria } =
        useUiCategoria();

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
        [categorias],
    );

    const handleEditar = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarCategoria(selected);
            fnModalAbrirCategoria(true);
        },
        [categorias],
    );

    const handleActivar = useCallback(
        (selected) => {
            //console.log("clic activar");
            fnAsignarCategoria(selected);
            fnModalAbrirActivarCategoria(true);
        },
        [categorias],
    );

    const table = useMantineReactTable({
        columns,
        data: categorias, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        localization: MRT_Localization_ES,
        enableFacetedValues: true,
        enableRowActions: true,
        enableColumnPinning: true,
        enableStickyHeader: true,
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
