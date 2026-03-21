import { useMemo, useState } from "react";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useMantineReactTable } from "mantine-react-table";
import { Badge, Modal, Text, Stack, Group, Divider } from "@mantine/core";
import { IconEye, IconFileInvoice } from "@tabler/icons-react";
import { ContenidoTable, MenuAcciones } from "../../../components";
import { formatearMonto } from "../../../helpers/fnHelper";
import dayjs from "dayjs";

export const HistorialCuentasTable = ({ datos, cargando, onVerFactura }) => {
    const [cuentaDetalle, setCuentaDetalle] = useState(null);

    const columns = useMemo(
        () => [
            {
                header: "Código",
                accessorKey: "codigo",
                size: 100,
            },
            {
                header: "Fecha Cierre",
                accessorKey: "updated_at",
                Cell: ({ cell }) =>
                    dayjs(cell.getValue()).format("DD/MM/YYYY HH:mm"),
            },
            {
                header: "Cajero",
                accessorFn: (row) =>
                    `${row.usuario?.nombres || ""} ${row.usuario?.apellidos || ""}`,
                id: "cajero",
            },
            {
                header: "Total",
                accessorKey: "total",
                Cell: ({ cell }) => (
                    <Text fw={600}>{formatearMonto(cell.getValue())}</Text>
                ),
            },
            {
                header: "Factura",
                accessorFn: (row) =>
                    row.factura?.numero_factura || "Sin Factura",
                id: "factura",
                Cell: ({ cell, row }) =>
                    row.original.factura ? (
                        <Badge color="blue" variant="light">
                            {cell.getValue()}
                        </Badge>
                    ) : (
                        <Text c="dimmed" size="xs">
                            Ninguna
                        </Text>
                    ),
            },
            {
                header: "Estado",
                accessorKey: "estado.nombre_estado",
                Cell: ({ cell }) => (
                    <Badge
                        color={
                            cell.getValue() === "PAGADO" ? "green" : "yellow"
                        }
                    >
                        {cell.getValue()}
                    </Badge>
                ),
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: datos,
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        enableStickyHeader: true,
        enableColumnPinning: true,
        initialState: {
            density: "md",
            columnPinning: { right: ["mrt-row-actions"] },
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
                        label: "Ver Detalle",
                        icon: IconEye,
                        onClick: (selected) => setCuentaDetalle(selected),
                    },
                    {
                        label: "Visualizar Factura",
                        icon: IconFileInvoice,
                        onClick: (selected) => onVerFactura(selected.factura),
                        disabled: !row.original.factura,
                    },
                ]}
            />
        ),
    });

    return (
        <>
            <ContenidoTable table={table} />

            <Modal
                opened={!!cuentaDetalle}
                onClose={() => setCuentaDetalle(null)}
                title={
                    <Text fw={600}>
                        Detalle de Cuenta: {cuentaDetalle?.codigo}
                    </Text>
                }
                size="xl"
            >
                {cuentaDetalle && (
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Atendido por:
                            </Text>
                            <Text size="sm" fw={600}>
                                {cuentaDetalle.usuario?.nombres}{" "}
                                {cuentaDetalle.usuario?.apellidos}
                            </Text>
                        </Group>

                        <Divider />
                        <Text fw={600} size="sm">
                            Consumos Registrados
                        </Text>
                        <Stack gap="xs">
                            {cuentaDetalle.consumos?.map((c) => (
                                <Group justify="space-between" key={c.id}>
                                    <Text size="sm">
                                        {c.cantidad}x{" "}
                                        {c.inventario?.nombre_producto}
                                    </Text>
                                    <Text size="sm" fw={500}>
                                        {formatearMonto(c.total)}
                                    </Text>
                                </Group>
                            ))}
                        </Stack>

                        <Divider />
                        <Text fw={600} size="sm">
                            Pagos ({cuentaDetalle.pagos?.length})
                        </Text>
                        <Stack gap="xs">
                            {cuentaDetalle.pagos?.map((p) => (
                                <Group justify="space-between" key={p.id}>
                                    <Text size="sm">
                                        {p.metodo_pago +
                                            (p.codigo_voucher
                                                ? " - " + p.codigo_voucher
                                                : "")}
                                    </Text>
                                    <Text size="sm" fw={500} c="green">
                                        {formatearMonto(p.monto)}
                                    </Text>
                                </Group>
                            ))}
                        </Stack>

                        <Divider mb="xs" />
                        <Group justify="space-between">
                            <Text size="lg" fw={700}>
                                Total Cuenta:
                            </Text>
                            <Text size="lg" fw={700} c="blue">
                                {formatearMonto(cuentaDetalle.total)}
                            </Text>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </>
    );
};
