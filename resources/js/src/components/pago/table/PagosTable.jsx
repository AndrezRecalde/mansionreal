import { useCallback, useMemo } from "react";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { usePagoStore, useUiPago } from "../../../hooks";
import { ContenidoTable, MenuAcciones, TextSection } from "../../../components";
import { Estados } from "../../../helpers/getPrefix";
import { IconCashRegister, IconEdit, IconTrash } from "@tabler/icons-react";

export const PagosTable = ({ estado }) => {
    const { cargando, pagos, fnAsignarPago } = usePagoStore();
    const {
        fnAbrirModalRegistroPago,
        fnAbrirModalEditarRegistroPago,
        fnAbrirModalEliminarRegistroPago,
    } = useUiPago();

    // Calcula la suma de todos los totales (no solo los de la página actual)
    const totalPagos = useMemo(() => {
        if (!Array.isArray(pagos)) return 0;
        return pagos.reduce((acc, curr) => acc + Number(curr.monto ?? 0), 0);
    }, [pagos]);

    const columns = useMemo(
        () => [
            {
                header: "Codigo Voucher",
                accessorFn: (row) => row.codigo_voucher || "SIN CODIGO",
                size: 80,
            },
            {
                header: "Concepto",
                accessorFn: (row) => row.concepto_pago.nombre_concepto,
            },
            {
                header: "Observación",
                accessorFn: (row) => row.observaciones || "SIN OBSERVACIÓN",
                wrap: true,
            },
            {
                header: "Monto",
                accessorKey: "monto",
                Cell: ({ cell }) => (
                    <span>
                        {Number(cell.getValue()).toLocaleString("es-EC", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })}
                    </span>
                ),
                // Footer nativo de la columna, suma total de todos los pagos
                Footer: () => (
                    <Stack>
                        Total Pagos:
                        <TextSection tt="" fw={700} fz={16} c="blue">
                            {totalPagos.toLocaleString("es-EC", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                            })}
                        </TextSection>
                    </Stack>
                ),
            },
        ],
        [pagos, totalPagos],
    );

    const handleAgregarVoucherClick = () => {
        // Lógica para agregar voucher
        //console.log("Agregar Voucher clicked");
        fnAbrirModalRegistroPago(true);
    };

    const handleEditarPago = useCallback(
        (selected) => {
            //console.log("Editar voucher:", selected);
            fnAbrirModalEditarRegistroPago(true);
            fnAsignarPago(selected);
        },
        [pagos],
    );

    const handleEliminarPago = useCallback(
        (selected) => {
            //console.log("Eliminar voucher:", selected);
            fnAbrirModalEliminarRegistroPago(true);
            fnAsignarPago(selected);
        },
        [pagos],
    );

    const table = useMantineReactTable({
        columns,
        data: pagos,
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
        enableColumnFooters: true, // Habilita los footers de columna
        enableFilters: false,
        enableHiding: false,
        enableSorting: false,
        enableStickyHeader: true,
        enableColumnPinning: true,
        initialState: {
            density: "md",
            columnPinning: { left: ["mrt-row-actions"] },
        },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
        renderTopToolbarCustomActions: () => (
            <Group gap={20} mr={8}>
                <Tooltip label="Agregar Voucher">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        onClick={handleAgregarVoucherClick}
                        disabled={
                            estado === Estados.PAGADO ||
                            estado === Estados.CANCELADO
                        }
                    >
                        <IconCashRegister
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
                <TextSection tt="" fz={16} fw={600}>
                    Registro de Pagos
                </TextSection>
            </Group>
        ),
        renderRowActions: ({ row }) => (
            <MenuAcciones
                row={row}
                items={[
                    {
                        label: "Editar",
                        icon: IconEdit,
                        onClick: handleEditarPago,
                        disabled:
                            estado === Estados.PAGADO ||
                            estado === Estados.CANCELADO,
                    },
                    {
                        label: "Eliminar",
                        icon: IconTrash,
                        onClick: handleEliminarPago,
                        disabled:
                            estado === Estados.PAGADO ||
                            estado === Estados.CANCELADO,
                    },
                ]}
            />
        ),
    });

    return <ContenidoTable table={table} />;
};
