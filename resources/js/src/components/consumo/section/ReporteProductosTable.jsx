import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
    Badge,
    Box,
    Paper,
    Stack,
} from "@mantine/core";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { TextSection } from "../../../components";
import { PAGE_TITLE } from "../../../helpers/getPrefix";

export const ReporteProductosTable = ({ categoria, colorScheme, theme }) => {
    const { nombre_categoria, productos, totales_categoria } = categoria;


    const columns = useMemo(
        () => [
            /* {
                accessorKey: "producto_id",
                header: "ID",
                size: 80,
                Cell: ({ cell }) => (
                    <TextSection fw={500} tt="">
                        {cell.getValue()}
                    </TextSection>
                ),
            }, */
            {
                accessorKey: "nombre_producto",
                header: PAGE_TITLE.REPORTE_CONSUMOS.CAMPOS_TABLA.PRODUCTO,
                size: 300,
                Cell: ({ cell }) => (
                    <TextSection>{cell.getValue()}</TextSection>
                ),
            },
            {
                accessorKey: "cantidad_total",
                header: PAGE_TITLE.REPORTE_CONSUMOS.CAMPOS_TABLA.CANTIDAD,
                size: 100,
                Cell: ({ cell }) => (
                    <Badge radius="sm" variant="light" color="indigo" size="lg">
                        {cell.getValue()}
                    </Badge>
                ),
            },
            {
                accessorKey: "precio_unitario",
                header: PAGE_TITLE.REPORTE_CONSUMOS.CAMPOS_TABLA.PRECIO_UNITARIO,
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
            },
            {
                accessorKey: "subtotal",
                header: PAGE_TITLE.REPORTE_CONSUMOS.CAMPOS_TABLA.SUBTOTAL,
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
            },
            {
                accessorKey: "iva",
                header: PAGE_TITLE.REPORTE_CONSUMOS.CAMPOS_TABLA.IVA,
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
            },
            {
                accessorKey: "total",
                header: PAGE_TITLE.REPORTE_CONSUMOS.CAMPOS_TABLA.TOTAL,
                size: 120,
                Cell: ({ cell }) => (
                    <TextSection fw={600} color="indigo" ta="right">
                        ${cell.getValue().toFixed(2)}
                    </TextSection>
                ),
            },
        ],
        []
    );

    const table = useMantineReactTable({
        columns,
        data: productos,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: true,
        enableBottomToolbar: false,
        enableTopToolbar: false,
        localization: MRT_Localization_ES,
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
                //backgroundColor: "#f8f9fa",
            },
        },
    });

    return (
        <Paper shadow="xs" p="md" withBorder mb="lg">
            <Stack gap="md">
                <Badge
                    radius="sm"
                    autoContrast
                    size="md"
                    variant="filled"
                >
                    {nombre_categoria}
                </Badge>

                <Box>
                    <MantineReactTable table={table} />
                </Box>

                {/* Totales de la categoría */}
                <Paper
                    p="md"
                    withBorder
                    style={{
                        backgroundColor:
                            colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : theme.colors.gray[0],
                    }}
                >
                    <Box
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "1rem",
                        }}
                    >
                        <Box>
                            <TextSection tt="" fz={12} color="dimmed" fw={500}>
                                Cantidad Total
                            </TextSection>
                            <Badge
                                radius="sm"
                                variant="light"
                                color="indigo"
                                size="xl"
                                mt={4}
                            >
                                {totales_categoria.cantidad_total}
                            </Badge>
                        </Box>
                        <Box>
                            <TextSection tt="" fz={12} color="dimmed" fw={500}>
                                Subtotal
                            </TextSection>
                            <TextSection tt="" fz={18} fw={600}>
                                ${totales_categoria.subtotal.toFixed(2)}
                            </TextSection>
                        </Box>
                        <Box>
                            <TextSection tt="" fz={12} color="dimmed" fw={500}>
                                IVA
                            </TextSection>
                            <TextSection tt="" fz={18} fw={600}>
                                ${totales_categoria.iva.toFixed(2)}
                            </TextSection>
                        </Box>
                        <Box>
                            <TextSection tt="" fz={12} color="dimmed" fw={500}>
                                Total {nombre_categoria}
                            </TextSection>
                            <TextSection tt="" fz={18} color="indigo" fw={700}>
                                ${totales_categoria.total.toFixed(2)}
                            </TextSection>
                        </Box>
                    </Box>
                </Paper>
            </Stack>
        </Paper>
    );
};
