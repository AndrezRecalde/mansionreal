import { useCallback, useMemo } from "react";
import {
    ActionIcon,
    Badge,
    Group,
    Menu,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, TextSection } from "../../../components";
import {
    IconShoppingCartPlus,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconDiscount,
    IconDiscountOff,
    IconInfoCircle,
} from "@tabler/icons-react";
import { useConsumoStore, useUiConsumo } from "../../../hooks";
import { Estados } from "../../../helpers/getPrefix";
import Swal from "sweetalert2";

export const ConsumosDrawerTable = ({ estado }) => {
    const { cargando, consumos, fnAsignarConsumo, fnEliminarDescuentoConsumo } =
        useConsumoStore();
    const {
        fnAbrirModalConsumo,
        fnAbrirModalEditarConsumo,
        fnAbrirModalEliminarConsumo,
        fnAbrirModalAplicarDescuento,
    } = useUiConsumo();

    // Calcula la suma de todos los totales
    const totalConsumos = useMemo(() => {
        return consumos.reduce(
            (acc, consumo) => acc + parseFloat(consumo.total || 0),
            0,
        );
    }, [consumos]);

    const totalDescuentos = useMemo(() => {
        return consumos.reduce(
            (acc, consumo) => acc + parseFloat(consumo.descuento || 0),
            0,
        );
    }, [consumos]);

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombre_producto",
                header: "Producto",
                size: 200,
            },
            {
                accessorKey: "cantidad",
                header: "Cantidad",
                size: 80,
                Cell: ({ cell }) => (
                    <Text size="sm" ta="center">
                        {cell.getValue()}
                    </Text>
                ),
            },
            {
                accessorKey: "precio_unitario",
                header: "Precio Unit.",
                size: 100,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {Number(cell.getValue()).toLocaleString("es-EC", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })}
                    </Text>
                ),
            },
            {
                accessorKey: "subtotal",
                header: "Subtotal",
                size: 100,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {Number(cell.getValue()).toLocaleString("es-EC", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })}
                    </Text>
                ),
            },
            {
                accessorKey: "descuento",
                header: "Descuento",
                size: 120,
                Cell: ({ row }) => {
                    const consumo = row.original;
                    if (consumo.tiene_descuento) {
                        return (
                            <Group gap="xs" wrap="nowrap">
                                <Badge color="green" size="sm" variant="light">
                                    {consumo.tipo_descuento === "PORCENTAJE"
                                        ? `${consumo.porcentaje_descuento}%`
                                        : `$${parseFloat(consumo.descuento).toFixed(2)}`}
                                </Badge>
                                {consumo.motivo_descuento && (
                                    <Tooltip
                                        label={consumo.motivo_descuento}
                                        withArrow
                                    >
                                        <IconInfoCircle
                                            size={16}
                                            style={{ cursor: "help" }}
                                        />
                                    </Tooltip>
                                )}
                            </Group>
                        );
                    }
                    return (
                        <Text size="sm" c="dimmed">
                            Sin descuento
                        </Text>
                    );
                },
            },
            {
                accessorKey: "iva",
                header: "IVA",
                size: 100,
                Cell: ({ cell }) => (
                    <Text size="sm">
                        {Number(cell.getValue()).toLocaleString("es-EC", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })}
                    </Text>
                ),
            },
            {
                accessorKey: "total",
                header: "Total",
                size: 120,
                Cell: ({ row }) => {
                    const consumo = row.original;
                    const totalOriginal =
                        parseFloat(consumo.subtotal) + parseFloat(consumo.iva);

                    return (
                        <Stack gap={2}>
                            {consumo.tiene_descuento && (
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    td="line-through"
                                    ta="right"
                                >
                                    {totalOriginal.toLocaleString("es-EC", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 2,
                                    })}
                                </Text>
                            )}
                            <Text
                                size="sm"
                                fw={600}
                                c={consumo.tiene_descuento ? "teal" : undefined}
                                ta="right"
                            >
                                {Number(consumo.total).toLocaleString("es-EC", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2,
                                })}
                            </Text>
                        </Stack>
                    );
                },
                Footer: () => (
                    <Stack gap="xs">
                        {totalDescuentos > 0 && (
                            <Group justify="space-between">
                                <Text size="xs" c="dimmed">
                                    Descuentos:
                                </Text>
                                <Text size="xs" c="red" fw={500}>
                                    -
                                    {totalDescuentos.toLocaleString("es-EC", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 2,
                                    })}
                                </Text>
                            </Group>
                        )}
                        <Group justify="space-between">
                            <Text size="sm" fw={600}>
                                Total Consumos:
                            </Text>
                            <TextSection tt="" fw={700} fz={16} c="blue">
                                {totalConsumos.toLocaleString("es-EC", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2,
                                })}
                            </TextSection>
                        </Group>
                    </Stack>
                ),
            },
        ],
        [consumos, totalConsumos, totalDescuentos],
    );

    const handleAbrirConsumo = useCallback(() => {
        fnAbrirModalConsumo(true);
    }, [fnAbrirModalConsumo]);

    const handleEditarConsumo = useCallback(
        (selected) => {
            fnAsignarConsumo(selected);
            fnAbrirModalEditarConsumo(true);
        },
        [fnAsignarConsumo, fnAbrirModalEditarConsumo],
    );

    const handleEliminarConsumo = useCallback(
        (selected) => {
            fnAsignarConsumo(selected);
            fnAbrirModalEliminarConsumo(true);
        },
        [fnAsignarConsumo, fnAbrirModalEliminarConsumo],
    );

    const handleAplicarDescuento = useCallback(
        (selected) => {
            fnAsignarConsumo(selected);
            fnAbrirModalAplicarDescuento(true);
        },
        [fnAsignarConsumo, fnAbrirModalAplicarDescuento],
    );

    const handleEliminarDescuento = useCallback(
        async (selected) => {
            const result = await Swal.fire({
                icon: "question",
                title: "¿Eliminar descuento?",
                html: `
                    <p>Se eliminará el descuento del consumo:</p>
                    <p><strong>${selected.nombre_producto}</strong></p>
                `,
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#fa5252",
            });

            if (result.isConfirmed) {
                await fnEliminarDescuentoConsumo(
                    selected.id,
                    selected.reserva_id,
                );
            }
        },
        [fnEliminarDescuentoConsumo],
    );

    const table = useMantineReactTable({
        columns,
        data: consumos,
        state: { showProgressBars: cargando },
        localization: MRT_Localization_ES,
        enableFacetedValues: false,
        enableDensityToggle: false,
        enableColumnFilterModes: false,
        enableFullScreenToggle: false,
        enableColumnFilters: false,
        enableGlobalFilter: false,
        enableRowActions: true,
        enableColumnActions: false,
        enableColumnFooters: true,
        enableFilters: false,
        enableHiding: false,
        enableSorting: false,
        renderTopToolbarCustomActions: () => (
            <Group gap={20} mr={8}>
                <Tooltip label="Agregar Consumo">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        aria-label="Agregar consumo"
                        onClick={handleAbrirConsumo}
                        disabled={estado !== Estados.HOSPEDADO}
                    >
                        <IconShoppingCartPlus
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
            </Group>
        ),
        renderRowActions: ({ row }) => {
            const consumo = row.original;
            const estaFacturado = consumo.esta_facturado;
            const tieneDescuento = consumo.tiene_descuento;

            return (
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            disabled={estaFacturado}
                        >
                            <IconDotsVertical size={16} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Acciones</Menu.Label>

                        <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            onClick={() => handleEditarConsumo(consumo)}
                        >
                            Editar cantidad
                        </Menu.Item>

                        {tieneDescuento ? (
                            <Menu.Item
                                leftSection={<IconDiscountOff size={16} />}
                                onClick={() => handleEliminarDescuento(consumo)}
                                color="orange"
                            >
                                Quitar descuento
                            </Menu.Item>
                        ) : (
                            <Menu.Item
                                leftSection={<IconDiscount size={16} />}
                                onClick={() => handleAplicarDescuento(consumo)}
                                color="teal"
                            >
                                Aplicar descuento
                            </Menu.Item>
                        )}

                        <Menu.Divider />

                        <Menu.Item
                            leftSection={<IconTrash size={16} />}
                            onClick={() => handleEliminarConsumo(consumo)}
                            color="red"
                        >
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            );
        },
        mantineTableProps: {
            withColumnBorders: true,
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
