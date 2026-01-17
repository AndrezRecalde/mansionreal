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

export const ReservasInformacionTable = () => {
    const { cargando, reservas, fnAsignarReserva } =
        useReservaDepartamentoStore();
    const { fnAbrirModalReGenerarFactura } = useUiFactura();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();

    const columns = useMemo(
        () => [
            {
                accessorKey: "codigo_reserva",
                header: "Código Reserva",
                size: 150,
                Cell: ({ cell }) => (
                    <Text size="sm" fw={600}>
                        {cell.getValue()}
                    </Text>
                ),
            },
            {
                accessorKey: "huesped",
                header: "Huésped",
                size: 200,
            },
            {
                accessorKey: "fecha_checkin",
                header: "Check-in",
                size: 120,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {dayjs(cell.getValue()).format("DD/MM/YYYY")}
                    </Text>
                ),
            },
            {
                accessorKey: "fecha_checkout",
                header: "Check-out",
                size: 120,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {dayjs(cell.getValue()).format("DD/MM/YYYY")}
                    </Text>
                ),
            },
            {
                accessorKey: "estado.nombre_estado",
                header: "Estado",
                size: 130,
                Cell: ({ cell }) => (
                    <Badge
                        color={cell.row.original.estado.color}
                        variant="filled"
                    >
                        {cell.getValue()}
                    </Badge>
                ),
            },
            {
                accessorKey: "numero_departamento",
                header: "Departamento",
                size: 120,
            },
            {
                accessorKey: "factura_estado",
                header: "Facturación",
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
                                    size="sm"
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
                        <Badge color="gray" variant="light" size="sm">
                            Sin Factura
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "total_consumos",
                header: "Total",
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
        []
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
        data: reservas || [],
        localization: MRT_Localization_ES,
        enableColumnActions: false,
        enableColumnFilters: true,
        enableSorting: true,
        enablePagination: true,
        enableRowActions: true,
        positionActionsColumn: "last",
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
                            Ver Factura
                        </Menu.Item>
                    )}

                    {reserva.puede_refacturar && (
                        <Menu.Item
                            leftSection={<IconRefresh size={16} />}
                            color="orange"
                            onClick={() => handleReGenerarFactura(reserva)}
                        >
                            {reserva.tiene_factura
                                ? "Volver a Generar Factura"
                                : "Generar Factura"}
                        </Menu.Item>
                    )}

                    {/* Ver Detalles */}
                    <Menu.Item
                        leftSection={<IconEye size={16} />}
                        onClick={() => handleVerDetalles(reserva)}
                    >
                        Ver Detalles
                    </Menu.Item>
                </Box>
            );
        },
    });

    return <MantineReactTable table={table} />;
};
