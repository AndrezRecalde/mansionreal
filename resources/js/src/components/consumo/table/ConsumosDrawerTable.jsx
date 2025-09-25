import { useCallback, useMemo } from "react";
import { ActionIcon, Stack, Tooltip } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import {
    ContenidoTable,
    MenuTable_EE,
    TextSection,
} from "../../../components";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useConsumoStore, useUiConsumo } from "../../../hooks";

export const ConsumosDrawerTable = () => {
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
                accessorKey: "nombre_producto",
                size: 80,
            },
            {
                header: "Cantidad",
                accessorKey: "cantidad",
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
        console.log("Editar consumo:", selected);
        fnAsignarConsumo(selected);
        fnAbrirModalEditarConsumo(true);
    }, []);

    const handleEliminarConsumo = useCallback((selected) => {
        console.log("Eliminar consumo:", selected);
        fnAsignarConsumo(selected);
        fnAbrirModalEliminarConsumo(true);
    }, []);

    const table = useMantineReactTable({
        columns,
        data: consumos,
        state: { showProgressBars: cargando },
        enableFacetedValues: false,
        enableDensityToggle: false,
        enableColumnFilterModes: false,
        enableFullScreenToggle: false,
        enableColumnFilters: true,
        enableGlobalFilter: false,
        enableRowActions: true,
        enableColumnActions: false,
        enableColumnFooters: true, // Habilita los footers de columna
        renderTopToolbarCustomActions: () => (
            <Tooltip label="Agregar Consumo">
                <ActionIcon
                    variant="default"
                    size="xl"
                    radius="xs"
                    aria-label="Consumo"
                    onClick={handleAbrirConsumo}
                >
                    <IconShoppingCartPlus
                        style={{ width: "80%", height: "80%" }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Tooltip>
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
