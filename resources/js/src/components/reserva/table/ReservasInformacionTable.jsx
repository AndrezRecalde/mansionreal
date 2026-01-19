import { useMemo } from "react";
import { Badge, Group, Menu, Text, Tooltip, Box } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import {
    IconFileText,
    IconRefresh,
    IconEye,
    IconAlertCircle,
} from "@tabler/icons-react";
import {
    useReservaDepartamentoStore,
    useUiConsumo,
    useUiFactura,
} from "../../../hooks";
import dayjs from "dayjs";

export const ReservasInformacionTable = ({ cargando, PAGE_TITLE }) => {
    const { reservas, fnAsignarReserva } = useReservaDepartamentoStore();
    const { fnAbrirModalReGenerarFactura } = useUiFactura();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();

    const columns = useMemo(
        () => [
            {
                accessorKey: "codigo_reserva",
                header: PAGE_TITLE.CODIGO_RESERVA,
                size: 150,
                Cell: ({ cell }) => (
                    <Text size="sm" fw={600}>
                        {cell.getValue()}
                    </Text>
                ),
            },
            {
                accessorKey: "estado.nombre_estado",
                header: PAGE_TITLE.ESTADO,
                size: 130,
                Cell: ({ cell }) => (
                    <Badge
                        radius="sm"
                        color={cell.row.original.estado.color}
                        variant="light"
                    >
                        {cell.getValue()}
                    </Badge>
                ),
            },
            {
                accessorKey: "huesped",
                header: PAGE_TITLE.HUESPED,
                size: 200,
            },
            {
                accessorKey: "fecha_checkin",
                header: PAGE_TITLE.CHECKIN,
                size: 120,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {dayjs(cell.getValue()).format("DD/MM/YYYY")}
                    </Text>
                ),
            },
            {
                accessorKey: "fecha_checkout",
                header: PAGE_TITLE.CHECKOUT,
                size: 120,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {dayjs(cell.getValue()).format("DD/MM/YYYY")}
                    </Text>
                ),
            },

            {
                accessorFn: (row) =>
                    row.numero_departamento
                        ? row.tipo_departamento + " " + row.numero_departamento
                        : "ESTADÍA",
                header: PAGE_TITLE.DEPARTAMENTO,
                size: 120,
            },
            {
                accessorKey: "factura_estado",
                header: PAGE_TITLE.FACTURACION,
                size: 150,
                Cell: ({ row }) => {
                    const reserva = row.original;

                    if (reserva.tiene_factura) {
                        return (
                            <Group gap="xs">
                                <Badge
                                    color={
                                        reserva.factura_estado === "EMITIDA"
                                            ? "green"
                                            : "red"
                                    }
                                    variant="light"
                                    radius="sm"
                                >
                                    {reserva.factura_estado}
                                </Badge>
                                {reserva.factura_estado === "ANULADA" && (
                                    <Tooltip label="Puede re-facturar">
                                        <IconAlertCircle
                                            size={16}
                                            color="#ea580c"
                                        />
                                    </Tooltip>
                                )}
                            </Group>
                        );
                    }

                    return (
                        <Badge
                            radius="sm"
                            color="gray"
                            variant="light"
                            size="sm"
                        >
                            {PAGE_TITLE.SIN_FACTURA}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "total_consumos",
                header: PAGE_TITLE.TOTAL,
                size: 120,
                Cell: ({ row }) => (
                    <Group gap={4}>
                        <Text size="sm" fw={600}>
                            $
                            {parseFloat(row.original.total_consumos).toFixed(2)}
                        </Text>
                    </Group>
                ),
            },
        ],
        [],
    );

    const handleReGenerarFactura = (reserva) => {
        fnAsignarReserva(reserva);
        fnAbrirModalReGenerarFactura(true);
    };

    const handleVerFactura = (reserva) => {
        // Implementar navegación a factura o modal
        console.log("Ver factura:", reserva.factura);
    };

    const handleVerDetalles = (reserva) => {
        fnAsignarReserva(reserva);
        fnAbrirDrawerConsumosDepartamento(true);
    };

    const table = useMantineReactTable({
        columns,
        data: reservas ?? [],
        localization: MRT_Localization_ES,
        enableColumnActions: false,
        enableColumnFilters: true,
        enableSorting: true,
        enablePagination: true,
        enableRowActions: true,
        enableStickyHeader: true,
        enableColumnPinning: true,
        positionActionsColumn: "last",
        initialState: {
            density: "md",
            columnPinning: { right: ["mrt-row-actions"] },
            sorting: [{ id: "fecha_checkin", desc: true }],
        },
        state: {
            isLoading: cargando,
        },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
        renderRowActionMenuItems: ({ row }) => {
            const reserva = row.original;

            return (
                <Box>
                    {reserva.tiene_factura && (
                        <Menu.Item
                            leftSection={<IconFileText size={16} />}
                            onClick={() => handleVerFactura(reserva)}
                        >
                            {
                                PAGE_TITLE.VER_FACTURA
                            }
                        </Menu.Item>
                    )}

                    {reserva.factura_estado === "ANULADA" && (
                        <Menu.Item
                            leftSection={<IconRefresh size={16} />}
                            color="orange"
                            onClick={() => handleReGenerarFactura(reserva)}
                        >
                            {
                                PAGE_TITLE.VOLVER_GENERAR_FACTURA
                            }
                        </Menu.Item>
                    )}

                    {/* Ver Detalles */}
                    <Menu.Item
                        leftSection={<IconEye size={16} />}
                        onClick={() => handleVerDetalles(reserva)}
                    >
                        {
                            PAGE_TITLE.VER_DETALLES
                        }
                    </Menu.Item>
                </Box>
            );
        },
    });

    return <MantineReactTable table={table} />;
};
