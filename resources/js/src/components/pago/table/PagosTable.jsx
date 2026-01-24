import { useCallback, useMemo } from "react";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { usePagoStore, useUiPago, useConsumoStore } from "../../../hooks";
import { ContenidoTable, MenuAcciones, TextSection } from "../../../components";
import { Estados } from "../../../helpers/getPrefix";
import { IconCashRegister, IconEdit, IconTrash } from "@tabler/icons-react";

export const PagosTable = ({ estado }) => {
    const { cargando, pagos, fnAsignarPago } = usePagoStore();
    const { consumos } = useConsumoStore(); // ✅ Obtener consumos del store
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

    // ✅ Verifica si hay al menos un consumo sin facturar
    const hayConsumosSinFacturar = useMemo(() => {
        if (!Array.isArray(consumos) || consumos.length === 0) return false;
        return consumos.some((consumo) => consumo.esta_facturado === false);
    }, [consumos]);

    // ✅ Verifica si el estado es PAGADO o CANCELADO
    const estadoBloqueado = useMemo(() => {
        return estado === Estados.PAGADO || estado === Estados.CANCELADO;
    }, [estado]);

    // ✅ LÓGICA CORREGIDA: Deshabilitar SOLO si:
    // El estado es PAGADO/CANCELADO Y todos los consumos están facturados
    // Es decir: HABILITAR si hay consumos sin facturar, sin importar el estado
    const deshabilitarAcciones = useMemo(() => {
        // Si hay consumos sin facturar, SIEMPRE habilitar
        if (hayConsumosSinFacturar) {
            return false;
        }
        // Si NO hay consumos sin facturar (todos facturados) Y el estado es bloqueado
        return estadoBloqueado;
    }, [estadoBloqueado, hayConsumosSinFacturar]);

    // ✅ Mensaje del tooltip según la razón de deshabilitación
    const mensajeTooltip = useMemo(() => {
        if (deshabilitarAcciones) {
            return "Todos los consumos están facturados";
        }
        return "Agregar Voucher";
    }, [deshabilitarAcciones]);

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
        fnAbrirModalRegistroPago(true);
    };

    const handleEditarPago = useCallback(
        (selected) => {
            fnAbrirModalEditarRegistroPago(true);
            fnAsignarPago(selected);
        },
        [pagos],
    );

    const handleEliminarPago = useCallback(
        (selected) => {
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
        enableColumnFooters: true,
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
                <Tooltip label={mensajeTooltip}>
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        onClick={handleAgregarVoucherClick}
                        disabled={deshabilitarAcciones}
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
                        disabled: deshabilitarAcciones,
                    },
                    {
                        label: "Eliminar",
                        icon: IconTrash,
                        onClick: handleEliminarPago,
                        disabled: deshabilitarAcciones,
                    },
                ]}
            />
        ),
    });

    return <ContenidoTable table={table} />;
};
