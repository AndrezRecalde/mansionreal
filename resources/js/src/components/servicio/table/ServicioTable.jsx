import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ContenidoTable, MenuAcciones } from "../../../components";
import { useServicioStore, useUiServicio } from "../../../hooks";
import { IconEdit } from "@tabler/icons-react";

export const ServicioTable = ({ PAGE_TITLE }) => {
    const { cargando, servicios, fnAsignarServicio } = useServicioStore();
    const { fnModalAbrirServicio } = useUiServicio();

    const columns = useMemo(
        () => [
            {
                header: PAGE_TITLE.CAMPOS_TABLA.NOMBRE_SERVICIO,
                accessorKey: "nombre_servicio", //normal accessorKey
                filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.CAMPOS_TABLA.TIPO_SERVICIO,
                accessorKey: "tipo_servicio", //normal accessorKey
                //filterVariant: "autocomplete",
            },
        ],
        [servicios],
    );

    const handleEditar = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarServicio(selected);
            fnModalAbrirServicio(true);
        },
        [servicios],
    );

    const table = useMantineReactTable({
        columns,
        data: servicios, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
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
        renderRowActions: ({ row }) => (
            <MenuAcciones
                row={row}
                items={[
                    {
                        label: "Editar",
                        icon: IconEdit,
                        onClick: handleEditar,
                        disabled: false,
                        color: "",
                    },
                ]}
            />
        ),
    });

    return <ContenidoTable table={table} />;
};
