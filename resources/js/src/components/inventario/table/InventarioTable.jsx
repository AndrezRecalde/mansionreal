import { useCallback, useEffect, useMemo, useState } from "react";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuAcciones,
} from "../../../components";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useInventarioStore, useUiInventario } from "../../../hooks";
import { UnstyledButton } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

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
        [],
    );

    const handleEditar = useCallback((selected) => {
        //console.log("clic editar");
        fnAsignarProductoInventario(selected);
        fnModalInventario(true);
    }, []);

    const handleAgregarStock = useCallback((selected) => {
        //console.log("clic agregar stock");
        fnAsignarProductoInventario(selected);
        fnAbrirModalAgregarStock(true);
    }, []);

    const handleActivar = useCallback((selected) => {
        //console.log("clic activar");
        fnAsignarProductoInventario(selected);
        fnModalAbrirActivarInventario(true);
    }, []);

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
        localization: MRT_Localization_ES,
        onPaginationChange: setPagination,
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
