import { useCallback, useMemo } from "react";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuTable_EE, TextSection } from "../../../components";
import { useGastoStore, useUiGasto } from "../../../hooks";
import { IconListDetails } from "@tabler/icons-react";
import { Estados } from "../../../helpers/getPrefix";

export const GastoDrawerTable = ({ estado }) => {
    const { cargando, gastos, fnAsignarGasto } = useGastoStore();
    const { fnAbrirModalGasto, fnAbrirEliminarModalGasto } = useUiGasto();

    // Calcula la suma de todos los totales (no solo los de la página actual)
    const totalGastos = useMemo(() => {
        if (!Array.isArray(gastos)) return 0;
        return gastos.reduce((acc, curr) => acc + Number(curr.monto ?? 0), 0);
    }, [gastos]);

    const columns = useMemo(
        () => [
            {
                header: "Descripción",
                accessorKey: "descripcion",
                size: 80,
                //filterVariant: "autocomplete",
            },

            {
                header: "Tipo de daño",
                accessorKey: "tipo_dano",
                //filterVariant: "autocomplete",
            },
            {
                header: "Monto",
                accessorKey: "monto",
                size: 80,
                Cell: ({ cell }) => (
                    <span>
                        {Number(cell.getValue()).toLocaleString("es-EC", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })}
                    </span>
                ),
                Footer: () => (
                    <Stack>
                        Total Gastos:
                        <TextSection tt="" fw={500} fz={16}>
                            {totalGastos.toLocaleString("es-EC", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                            })}
                        </TextSection>
                    </Stack>
                ),
            },
        ],
        [gastos]
    );

    const handleAbrirGasto = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAbrirModalGasto(true);
            fnAsignarGasto(selected);
        },
        [gastos]
    );

    const handleEliminarGasto = useCallback(
        (selected) => {
            //console.log("clic eliminar");
            fnAbrirEliminarModalGasto(true);
            fnAsignarGasto(selected);
        },
        [gastos]
    );

    const table = useMantineReactTable({
        columns,
        data: gastos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        localization: MRT_Localization_ES,
        enableFacetedValues: false,
        enableDensityToggle: false,
        enableColumnFilterModes: false,
        enableFullScreenToggle: false,
        enableColumnFilters: true,
        enableGlobalFilter: false,
        enableRowActions: true,
        enableColumnActions: false,
        enableFilters: false,
        enableHiding: false,
        enableSorting: false,
        renderTopToolbarCustomActions: ({ table }) => (
            <Group gap={20} mr={8}>
                <Tooltip label="Agregar Gasto">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        onClick={handleAbrirGasto}
                        disabled={
                            estado?.nombre_estado === Estados.CANCELADO ||
                            estado?.nombre_estado === Estados.PAGADO
                        }
                    >
                        <IconListDetails
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
                <TextSection tt="" fw={500} fz={16}>
                    Registro de Daños
                </TextSection>
            </Group>
        ),
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EE
                row={row}
                handleEditar={handleAbrirGasto}
                handleEliminar={handleEliminarGasto}
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
