import { useCallback, useMemo } from "react";
import { ContenidoTable, MenuTable_EE, TextSection } from "../../../components";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { IconCashRegister } from "@tabler/icons-react";
import { usePagoStore, useUiPago } from "../../../hooks";
import { Estados } from "../../../helpers/getPrefix";

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
                accessorKey: "codigo_voucher",
                size: 80,
            },
            {
                header: "Concepto",
                accessorFn: (row) => row.concepto_pago.nombre_concepto,
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
                        <TextSection tt="" fw={500} fz={16}>
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
        [pagos, totalPagos]
    );

    const handleAgregarVoucherClick = () => {
        // Lógica para agregar voucher
        console.log("Agregar Voucher clicked");
        fnAbrirModalRegistroPago(true);
    };

    const handleEditarPago = useCallback(
        (selected) => {
            console.log("Editar voucher:", selected);
            fnAbrirModalEditarRegistroPago(true);
            fnAsignarPago(selected);
        },
        [pagos]
    );

    const handleEliminarPago = useCallback(
        (selected) => {
            console.log("Eliminar voucher:", selected);
            fnAbrirModalEliminarRegistroPago(true);
            fnAsignarPago(selected);
        },
        [pagos]
    );

    const table = useMantineReactTable({
        columns,
        data: pagos,
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
            <Group gap={20} mr={8}>
                <Tooltip label="Agregar Voucher">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        aria-label="Agregar Voucher"
                        onClick={handleAgregarVoucherClick}
                        disabled={
                            estado?.nombre_estado === Estados.CANCELADO ||
                            estado?.nombre_estado === Estados.PAGADO
                        }
                    >
                        <IconCashRegister
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
                <TextSection tt="" fw={500} fz={16}>
                    Registro de Pagos
                </TextSection>
            </Group>
        ),
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EE
                row={row}
                handleEditar={handleEditarPago}
                handleEliminar={handleEliminarPago}
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
