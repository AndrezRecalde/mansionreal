import { useCallback, useMemo } from "react";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuTable_EE, TextSection } from "../../../components";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useConsumoStore, useUiConsumo } from "../../../hooks";
import { Estados } from "../../../helpers/getPrefix";

export const ConsumosDrawerTable = ({ estado }) => {
    const { cargando, consumos, fnAsignarConsumo } = useConsumoStore();
    const {
        fnAbrirModalConsumo,
        fnAbrirModalEditarConsumo,
        fnAbrirModalEliminarConsumo,
    } = useUiConsumo();

    // Calcula la suma de todos los totales (no solo los de la página actual)
    const totalConsumos = useMemo(() => {
        if (!Array.isArray(consumos)) return 0;
        return consumos.reduce((acc, curr) => acc + Number(curr.total ?? 0), 0);
    }, [consumos]);

    const columns = useMemo(
        () => [
            {
                header: "Producto",
                accessorFn: (row) => row.nombre_producto + " - " + row.precio_unitario.toLocaleString("es-EC", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                }),
            },
            {
                header: "Cantidad",
                accessorKey: "cantidad",
                size: 80
            },
            {
                header: "Subtotal",
                accessorKey: "subtotal",
                size: 80
            },
            {
                header: "Total Iva",
                accessorKey: "iva",
                size: 80
            },
            {
                header: "Total",
                accessorKey: "total",
                Cell: ({ cell }) => (
                    <span>
                        {Number(cell.getValue()).toLocaleString("es-EC", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })}
                    </span>
                ),
                // Footer nativo de la columna, suma total de todos los consumos
                Footer: () => (
                    <Stack>
                        Total Consumos:
                        <TextSection tt="" fw={500} fz={16}>
                            {totalConsumos.toLocaleString("es-EC", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                            })}
                        </TextSection>
                    </Stack>
                ),
            },
        ],
        [consumos, totalConsumos]
    );

    const handleAbrirConsumo = useCallback(() => {
        fnAbrirModalConsumo(true);
    }, [fnAbrirModalConsumo]);

    const handleEditarConsumo = useCallback((selected) => {
        //console.log("Editar consumo:", selected);
        fnAsignarConsumo(selected);
        fnAbrirModalEditarConsumo(true);
    }, []);

    const handleEliminarConsumo = useCallback((selected) => {
        //console.log("Eliminar consumo:", selected);
        fnAsignarConsumo(selected);
        fnAbrirModalEliminarConsumo(true);
    }, []);

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
        enableColumnFooters: true, // Habilita los footers de columna
        enableFilters: false,
        enableHiding: false,
        enableSorting: false,
        renderTopToolbarCustomActions: () => (
            <Group gap={20} mr={8}>
                <Tooltip label="Agregar Consumo">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        onClick={handleAbrirConsumo}
                        disabled={
                            estado?.nombre_estado === Estados.CANCELADO ||
                            estado?.nombre_estado === Estados.PAGADO
                        }
                    >
                        <IconShoppingCartPlus
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
                <TextSection tt="" fw={500} fz={16}>
                    Registro de Consumos
                </TextSection>
            </Group>
        ),
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EE
                row={row}
                handleEditar={handleEditarConsumo}
                handleEliminar={handleEliminarConsumo}
            />
        ),
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
