import { Badge } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { ContenidoTable, MenuTable_RESERVA } from "../../../components";
import { useCallback, useMemo } from "react";
import { useReservaDepartamentoStore, useUiConsumo } from "../../../hooks";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";

export const ReservasInformacionTable = ({ cargando }) => {
    const { reservas, fnAsignarReserva } = useReservaDepartamentoStore();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();

    const columns = useMemo(
        () => [
            {
                header: "Estado",
                accessorKey: "estado",
                Cell: ({ cell }) => (
                    <div>
                        <Badge
                            color={cell.row.original.color_estado}
                            variant="dot"
                        >
                            {cell.row.original.estado}
                        </Badge>
                    </div>
                ),
            },
            {
                header: "Codigo Reserva",
                accessorFn: (row) =>
                    row?.codigo_reserva || "NO CONTIENE INFORMACION",
            },
            {
                header: "Departamento",
                accessorFn: (row) =>
                    row?.departamento || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Huesped Anfitrión",
                accessorFn: (row) => row?.huesped || "NO CONTIENE INFORMACION",
            },
            {
                header: "Fecha Check-In",
                accessorFn: (row) =>
                    row?.fecha_checkin || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Fecha Check-Out",
                accessorFn: (row) =>
                    row?.fecha_checkout || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Total Noches",
                accessorFn: (row) =>
                    row?.total_noches || "NO CONTIENE INFORMACION",
                size: 80,
            },
        ],
        [reservas]
    );

    const handleEditar = useCallback(
        (selected) => {
            console.log(selected);
        },
        [reservas]
    );

    const handleAgregarConsumos = useCallback(
        (selected) => {
            console.log(selected);
            fnAsignarReserva(selected);
            fnAbrirDrawerConsumosDepartamento(true);
        },
        [reservas]
    );

    const table = useMantineReactTable({
        columns,
        data: reservas, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        localization: MRT_Localization_ES,
        enableFacetedValues: false,
        enableColumnDragging: false,
        enableDensityToggle: false,
        enableRowActions: true,
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_RESERVA
                row={row}
                handleEditar={handleEditar}
                handleAgregarConsumos={handleAgregarConsumos}
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
