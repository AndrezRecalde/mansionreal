import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Badge } from "@mantine/core";
import { TextSection } from "../../../components";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";

export const ReporteConsolidadoTable = ({ categorias, colorScheme, theme }) => {
    // Aplanar los datos:  convertir categorías con productos en una lista plana
    const productosConCategoria = useMemo(() => {
        const productos = [];
        categorias.forEach((categoria) => {
            categoria.productos.forEach((producto) => {
                productos.push({
                    ...producto,
                    nombre_categoria: categoria.nombre_categoria,
                    categoria_id: categoria.categoria_id,
                });
            });
        });
        return productos;
    }, [categorias]);

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombre_categoria",
                header: "Categoría",
                size: 150,
                filterVariant: "select",
                Cell: ({ cell }) => (
                    <Badge radius="sm" variant="light" color="indigo" size="md">
                        {cell.getValue()}
                    </Badge>
                ),
            },
            {
                accessorKey: "producto_id",
                header: "ID",
                size: 80,
                Cell: ({ cell }) => (
                    <TextSection>
                        {cell.getValue()}
                    </TextSection>
                ),
            },
            {
                accessorKey: "nombre_producto",
                header: "Producto",
                size: 300,
                Cell: ({ cell }) => <TextSection>{cell.getValue()}</TextSection>,
            },
            {
                accessorKey: "cantidad_total",
                header: "Cantidad",
                size: 100,
                Cell: ({ cell }) => (
                    <Badge radius="sm" variant="light" color="indigo" size="lg">
                        {cell.getValue()}
                    </Badge>
                ),
                aggregationFn: "sum",
                AggregatedCell: ({ cell }) => (
                    <Badge radius="lg" variant="default" color="indigo" size="lg">
                        Total: {cell.getValue()}
                    </Badge>
                ),
            },
            {
                accessorKey: "precio_unitario",
                header: "P. Unitario",
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
            },
            {
                accessorKey: "subtotal",
                header: "Subtotal",
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
                aggregationFn: "sum",
                AggregatedCell: ({ cell }) => (
                    <TextSection ta="right" size="sm" fw={700} color="dark">
                        ${cell.getValue()?.toFixed(2)}
                    </TextSection>
                ),
                Footer: ({ table }) => {
                    const total = table
                        .getFilteredRowModel()
                        .rows.reduce(
                            (sum, row) => sum + row.original.subtotal,
                            0
                        );
                    return (
                        <TextSection fw={700} ta="right">
                            ${total.toFixed(2)}
                        </TextSection>
                    );
                },
            },
            {
                accessorKey: "iva",
                header: "IVA",
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
                aggregationFn: "sum",
                AggregatedCell: ({ cell }) => (
                    <TextSection ta="right" fw={700} color="dark">
                        ${cell.getValue()?.toFixed(2)}
                    </TextSection>
                ),
                Footer: ({ table }) => {
                    const total = table
                        .getFilteredRowModel()
                        .rows.reduce((sum, row) => sum + row.original.iva, 0);
                    return (
                        <TextSection fw={700} ta="right">
                            ${total.toFixed(2)}
                        </TextSection>
                    );
                },
            },
            {
                accessorKey: "total",
                header: "Total",
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection size="sm" fw={500} color="indigo" ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
                aggregationFn: "sum",
                AggregatedCell: ({ cell }) => (
                    <TextSection size="sm" fw={700} ta="right" color="indigo">
                        ${cell.getValue()?.toFixed(2)}
                    </TextSection>
                ),
                Footer: ({ table }) => {
                    const total = table
                        .getFilteredRowModel()
                        .rows.reduce((sum, row) => sum + row.original.total, 0);
                    return (
                        <TextSection fw={700} ta="right" color={colorScheme === "dark" ? theme.colors.indigo[9] : "#212529"} size="md">
                            ${total.toFixed(2)}
                        </TextSection>
                    );
                },
            },
        ],
        []
    );

    const table = useMantineReactTable({
        columns,
        data: productosConCategoria,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableColumnFilters: true,
        enableColumnFilterModes: true,
        enablePagination: true,
        enableSorting: true,
        enableBottomToolbar: true,
        localization: MRT_Localization_ES,
        initialState: {
            grouping: ["nombre_categoria"],
            expanded: true,
            density: "xs",
            pagination: { pageSize: 20, pageIndex: 0 },
        },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
        mantineTableBodyCellProps: {
            style: {
                fontSize: "13px",
            },
        },
        mantineTableHeadCellProps: {
            style: {
                fontSize: "13px",
                fontWeight: 600,
            },
        },
        mantineTableFooterCellProps: {
            style: {
                fontSize: "14px",
                fontWeight: 700,
                backgroundColor: colorScheme === "dark" ? theme.colors.teal[7] : "#e9ecef",
                color: colorScheme === "dark" ? theme.colors.dark[9] : "#212529",
            },
        },
    });

    return <MantineReactTable table={table} />;
};
