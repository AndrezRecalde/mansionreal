import { useCallback, useMemo } from "react";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuTable_EA,
} from "../../../components";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useInventarioStore, useUiInventario } from "../../../hooks";

export const InventarioTable = () => {
    const {
        cargando,
        inventarios: productos,
        fnAsignarProductoInventario,
    } = useInventarioStore();
    const { fnModalInventario, fnModalAbrirActivarInventario } =
        useUiInventario();

    const columns = useMemo(
        () => [
            {
                header: "Nombre del producto",
                accessorKey: "nombre_producto", //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: "Precio unitario",
                accessorKey: "precio_unitario", //normal accessorKey
                size: 80,
            },
            {
                header: "Stock",
                accessorKey: "stock", //normal accessorKey
                size: 80,
            },
            {
                header: "Categoria",
                accessorKey: "nombre_categoria", //normal accessorKey
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
        [productos]
    );

    const handleEditar = useCallback(
        (selected) => {
            console.log("clic editar");
            fnAsignarProductoInventario(selected);
            fnModalInventario(true);
        },
        [productos]
    );

    const handleActivar = useCallback(
        (selected) => {
            console.log("clic activar");
            fnAsignarProductoInventario(selected);
            fnModalAbrirActivarInventario(true);
        },
        [productos]
    );

    const table = useMantineReactTable({
        columns,
        data: productos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
