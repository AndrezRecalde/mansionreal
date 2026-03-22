import { useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable } from "../../../components";
import { usePagoStore } from "../../../hooks";

export const PagosHistorialTable = () => {
    const { cargando, pagos } = usePagoStore();

    const columns = useMemo(
        () => [
            {
                header: "Código Reserva",
                accessorFn: (row) =>
                    row.reserva?.codigo_reserva
                        ? row.reserva.codigo_reserva
                        : "N/A",
            },
            {
                header: "Codigo Voucher",
                accessorFn: (row) =>
                    row?.codigo_voucher ? row.codigo_voucher : "N/A",
            },
            {
                header: "Concepto Pago",
                accessorKey: "concepto_pago.nombre_concepto",
                filterVariant: "autocomplete",
            },
            {
                header: "Monto",
                accessorKey: "monto",
            },
            {
                header: "Metodo de Pago",
                accessorKey: "metodo_pago",
            },
            {
                header: "Fecha de Pago",
                accessorKey: "fecha_pago",
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: pagos ?? [],
        state: {
            showProgressBars: cargando,
        },
        enableFacetedValues: true,
        enableRowActions: false,
        localization: MRT_Localization_ES,
        mantineTableProps: {
            withColumnBorders: true,
            striped: true,
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
