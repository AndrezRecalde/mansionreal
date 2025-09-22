import { useCallback, useMemo } from "react";
import { Button, Stack } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useConsumoStore, useUiConsumo } from "../../../hooks";

export const ConsumosDrawerTable = () => {
    const { cargando, consumos } = useConsumoStore();
    const { fnAbrirModalConsumo } = useUiConsumo();

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
                        <strong>
                            {totalConsumos.toLocaleString("es-EC", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                            })}
                        </strong>
                    </Stack>
                ),
            },
        ],
        [consumos, totalConsumos]
    );

    const handleAbrirConsumo = useCallback(() => {
        fnAbrirModalConsumo(true);
    }, [fnAbrirModalConsumo]);

    const handleEliminarConsumo = useCallback((selected) => {
        console.log("Eliminar consumo:", selected);
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
            <Button
                leftSection={<IconShoppingCartPlus size={20} stroke={1.8} />}
                variant="filled"
                color="gray.7"
                onClick={handleAbrirConsumo}
            >
                Agregar Consumo
            </Button>
        ),
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EA
                row={row}
                titulo="Eliminar"
                handleAction={handleEliminarConsumo}
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
