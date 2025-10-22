import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable } from "../../../components";
import { useInventarioStore } from "../../../hooks";

export const HistorialMovimientosTable = () => {
    const { movimientos, cargando } = useInventarioStore();

    const columns = useMemo(
        () => [
            {
                header: "Nombre del producto",
                accessorKey: "nombre_producto", //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: "Stock Actual",
                accessorKey: "stock_actual", //normal accessorKey
                size: 80,
            },
            {
                header: "Stock",
                accessorKey: "stock", //normal accessorKey
                size: 80,
                Cell: ({ cell }) => (
                    <UnstyledButton
                        onClick={() => handleAgregarStock(cell.row.original)}
                    >
                        {cell.getValue()}
                    </UnstyledButton>
                ),
            },
            {
                header: "Categoria",
                accessorKey: "nombre_categoria", //normal accessorKey
            },
            {
                id: "activo", //id is still required when using accessorFn instead of accessorKey
                header: "Activo",
                accessorKey: "activo",
                Cell: ({ cell }) => (
                    <BtnActivarElemento
                        cell={cell}
                        handleActivar={handleActivar}
                    />
                ),
                size: 80,
            },
        ],
        [productos]
    );

    const table = useMantineReactTable({
        columns,
        data: movimientos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        enableRowActions: false,
        mantineTableProps: {
            withColumnBorders: true,
            striped: true,
            withTableBorder: true,
            //withTableBorder: colorScheme === "light",
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
