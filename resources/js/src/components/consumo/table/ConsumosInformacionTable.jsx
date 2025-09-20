import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { ContenidoTable, MenuTable_EA, TextSection } from "../../../components";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";

export const ConsumosInformacionTable = ({ data = {} }) => {
    const { original = {} } = data ?? {};
    const consumos = Array.isArray(original.consumos) ? original.consumos : [];
    const columns = useMemo(
        () => [
            {
                header: "Producto",
                accessorFn: (row) =>
                    row?.nombre_producto || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Cantidad",
                accessorFn: (row) => row?.cantidad || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Subtotal",
                accessorFn: (row) => row?.subtotal || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Tasa Iva",
                accessorFn: (row) => row?.tasa_iva || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Iva",
                accessorFn: (row) => row?.iva || "NO CONTIENE INFORMACION",
                size: 80,
            },
            {
                header: "Total Consumo",
                accessorFn: (row) => row?.total || "NO CONTIENE INFORMACION",
                size: 80,
            },
        ],
        [consumos]
    );

    const handleEditar = useCallback(
        (selected) => {
            console.log(selected);
        },
        [consumos]
    );

    const table = useMantineReactTable({
        columns,
        data: consumos,
        localization: MRT_Localization_ES,
        enableFacetedValues: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableFilters: false,
        enableColumnDragging: false,
        enableHiding: false,
        enableStickyHeader: false,
        enableColumnActions: false,
        enableRowActions: true,
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EA
                row={row}
                titulo="Editar"
                handleAction={handleEditar}
            />
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <TextSection mt={10} fw={700}>
                Informacion de los consumos realizados
            </TextSection>
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
