import { useCallback, useEffect, useMemo, useState } from "react";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuTable_EA,
} from "../../../components";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useInventarioStore, useUiInventario } from "../../../hooks";
import { UnstyledButton } from "@mantine/core";

export const InventarioTable = () => {
    const {
        cargando,
        inventarios: productos,
        paginacion,
        fnAsignarProductoInventario,
        fnCargarProductosInventario,
    } = useInventarioStore();

    const {
        fnModalInventario,
        fnModalAbrirActivarInventario,
        fnAbrirModalAgregarStock,
    } = useUiInventario();

    const [pagination, setPagination] = useState({
        pageIndex: 0, // MRT usa índice 0
        pageSize: 20, // Items por página
    });

    const [filtros, setFiltros] = useState({
        categoria_id: null,
        nombre_producto: null,
        activo: null,
    });

    useEffect(() => {
        fnCargarProductosInventario({
            ...filtros,
            page: pagination.pageIndex + 1, // Convertir de 0-indexed a 1-indexed
            per_page: pagination.pageSize,
        });
    }, [pagination, filtros]);

    const columns = useMemo(
        () => [
            {
                header: "Nombre del producto",
                accessorKey: "nombre_producto",
            },
            {
                header: "Precio unitario",
                accessorKey: "precio_unitario",
                size: 80,
            },
            {
                header: "¿Cuenta con Stock?",
                accessorKey: "sin_stock",
                size: 120,
                Cell: ({ cell }) =>
                    cell.getValue() ? "Sin Stock" : "Con Stock",
            },
            {
                header: "Stock",
                accessorKey: "stock",
                size: 80,
                Cell: ({ cell }) => (
                    <UnstyledButton
                        onClick={() => handleAgregarStock(cell.row.original)}
                    >
                        {cell.getValue()}
                    </UnstyledButton>
                ),
            },
            {
                header: "Categoria",
                accessorKey: "nombre_categoria",
            },
            {
                id: "activo",
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
        []
    );

    const handleEditar = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarProductoInventario(selected);
            fnModalInventario(true);
        },
        []
    );

    const handleAgregarStock = useCallback(
        (selected) => {
            //console.log("clic agregar stock");
            fnAsignarProductoInventario(selected);
            fnAbrirModalAgregarStock(true);
        },
        []
    );

    const handleActivar = useCallback(
        (selected) => {
            //console.log("clic activar");
            fnAsignarProductoInventario(selected);
            fnModalAbrirActivarInventario(true);
        },
        []
    );

    const table = useMantineReactTable({
        columns,
        data: productos ?? [],

        // PAGINACIÓN REMOTA
        manualPagination: true,
        rowCount: paginacion?.total ?? 0,

        state: {
            showProgressBars: cargando,
            pagination,
        },

        onPaginationChange: setPagination,

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
