import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuTable_EA } from "../../../components";
import { useServicioStore, useUiServicio } from "../../../hooks";

export const ServicioTable = () => {
    const { cargando, servicios, fnAsignarServicio } = useServicioStore();
    const { fnModalAbrirServicio } = useUiServicio();

    const columns = useMemo(
        () => [
            {
                header: "Nombre de Servicio",
                accessorKey: "nombre_servicio", //normal accessorKey
                filterVariant: "autocomplete",
            },
            {
                header: "Tipo de Servicio",
                accessorKey: "tipo_servicio", //normal accessorKey
                //filterVariant: "autocomplete",
            },
        ],
        [servicios]
    );

    const handleEditar = useCallback(
        (selected) => {
            console.log("clic editar");
            fnAsignarServicio(selected);
            fnModalAbrirServicio(true);
        },
        [servicios]
    );

    const table = useMantineReactTable({
        columns,
        data: servicios, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_EA
                row={row}
                titulo="Editar"
                handleAction={handleEditar}
            />
        ),
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
