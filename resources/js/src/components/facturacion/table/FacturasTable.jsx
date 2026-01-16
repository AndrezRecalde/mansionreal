import { useMemo, useState } from "react";
import { Badge, Group, Text } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { MenuTableFactura } from "../../elements/table/MenuTable";
import { useFacturaStore, useUiFactura } from "../../../hooks";
import dayjs from "dayjs";
import Swal from "sweetalert2";

export const FacturasTable = () => {
    const {
        cargando,
        facturas,
        fnActivarFactura,
        fnPrevisualizarFacturaPDF,
        fnDescargarFacturaPDF,
    } = useFacturaStore();

    const {
        fnAbrirModalDetalleFactura,
        fnAbrirModalAnularFactura,
        fnAbrirModalPdfFactura,
    } = useUiFactura();

    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);

    const columns = useMemo(
        () => [
            {
                accessorKey: "numero_factura",
                header: "Número Factura",
                size: 150,
                Cell: ({ cell }) => (
                    <Text size="sm" fw={600}>
                        {cell.getValue()}
                    </Text>
                ),
            },
            {
                accessorKey: "fecha_emision",
                header: "Fecha Emisión",
                size: 120,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {dayjs(cell.getValue()).format("DD/MM/YYYY")}
                    </Text>
                ),
                filterVariant: "date-range",
            },
            {
                accessorKey: "cliente_nombres",
                header: "Cliente",
                size: 200,
                Cell: ({ row }) => (
                    <div>
                        <Text size="sm" fw={500}>
                            {row.original.cliente_apellidos}{" "}
                            {row.original.cliente_nombres}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {row.original.cliente_tipo_identificacion}:{" "}
                            {row.original.cliente_identificacion}
                        </Text>
                    </div>
                ),
            },
            {
                accessorKey: "reserva.codigo_reserva",
                header: "Reserva",
                size: 120,
                Cell: ({ cell }) => (
                    <Badge variant="light" color="blue">
                        {cell.getValue()}
                    </Badge>
                ),
            },
            {
                accessorKey: "total_factura",
                header: "Total",
                size: 100,
                Cell: ({ cell }) => (
                    <Text size="sm" fw={600}>
                        ${parseFloat(cell.getValue()).toFixed(2)}
                    </Text>
                ),
                filterVariant: "range",
            },
            {
                accessorKey: "estado",
                header: "Estado",
                size: 100,
                Cell: ({ cell }) => (
                    <Badge
                        color={cell.getValue() === "EMITIDA" ? "green" : "red"}
                        variant="filled"
                    >
                        {cell.getValue()}
                    </Badge>
                ),
                filterVariant: "select",
                mantineFilterSelectProps: {
                    data: [
                        { value: "EMITIDA", label: "Emitida" },
                        { value: "ANULADA", label: "Anulada" },
                    ],
                },
            },
            {
                accessorKey: "solicita_factura_detallada",
                header: "Tipo",
                size: 100,
                Cell: ({ cell }) => (
                    <Badge
                        color={cell.getValue() ? "teal" : "gray"}
                        variant="light"
                        size="sm"
                    >
                        {cell.getValue() ? "Detallada" : "Simple"}
                    </Badge>
                ),
                filterVariant: "checkbox",
            },
        ],
        []
    );

    const handleVerDetalle = (factura) => {
        fnActivarFactura(factura);
        fnAbrirModalDetalleFactura(true);
    };

    const handleVerPDF = async (factura) => {
        fnActivarFactura(factura);
        await fnPrevisualizarFacturaPDF(factura.id);
        fnAbrirModalPdfFactura(true);
    };

    const handleDescargar = async (factura) => {
        await fnDescargarFacturaPDF(factura.id);
    };

    const handleAnular = (factura) => {
        if (factura.estado !== "EMITIDA") {
            Swal.fire({
                icon: "warning",
                title: "Acción no permitida",
                text: "Solo se pueden anular facturas en estado EMITIDA.",
                showConfirmButton: true,
                confirmButtonText: "Aceptar",
            });
            return;
        }
        fnActivarFactura(factura);
        fnAbrirModalAnularFactura(true);
    };

    const table = useMantineReactTable({
        columns,
        data: facturas,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableColumnPinning: true,
        enableStickyHeader: true,
        enableDensityToggle: false,
        initialState: {
            density: "xs",
            columnPinning: { right: ["mrt-row-actions"] },
            sorting: [{ id: "fecha_emision", desc: true }],
        },
        state: {
            showProgressBars: cargando,
            globalFilter,
            columnFilters,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        localization: MRT_Localization_ES,
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
        mantineTableContainerProps: {
            style: { maxHeight: "600px" },
        },
        renderRowActionMenuItems: ({ row }) => (
            <MenuTableFactura
                factura={row.original}
                onVerDetalle={handleVerDetalle}
                onVerPDF={handleVerPDF}
                onAnular={handleAnular}
                onDescargar={handleDescargar}
            />
        ),
        renderTopToolbarCustomActions: () => (
            <Group>
                <Text size="lg" fw={600}>
                    Facturas del Sistema
                </Text>
            </Group>
        ),
    });

    return <MantineReactTable table={table} />;
};
