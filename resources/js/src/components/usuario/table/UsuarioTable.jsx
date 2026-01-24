import { useCallback, useMemo } from "react";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useMantineReactTable } from "mantine-react-table";
import { useUiUsuario, useUsuarioStore } from "../../../hooks";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuAcciones,
} from "../../../components";
import { Badge } from "@mantine/core";
import { IconEdit, IconRestore } from "@tabler/icons-react";

export const UsuarioTable = ({ PAGE_TITLE }) => {
    const { cargando, usuarios, fnAsignarUsuario } = useUsuarioStore();
    const { fnModalUsuario, fnModalAbrirActivarUsuario, fnModalResetearPwd } =
        useUiUsuario();

    const columns = useMemo(
        () => [
            {
                header: PAGE_TITLE.CAMPOS_TABLA.NOMBRES_COMPLETOS,
                accessorFn: (row) => row.apellidos + " " + row.nombres, //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.CAMPOS_TABLA.CEDULA,
                accessorKey: "dni", //normal accessorKey
            },
            {
                header: PAGE_TITLE.CAMPOS_TABLA.EMAIL,
                accessorKey: "email", //normal accessorKey
            },
            {
                header: PAGE_TITLE.CAMPOS_TABLA.ROL,
                accessorKey: "role", //normal accessorKey
                Cell: ({ cell }) => (
                    <Badge color="indigo.7" radius="sm" variant="light">
                        {cell.getValue()}
                    </Badge>
                ),
                //filterVariant: "autocomplete",
            },
            {
                header: PAGE_TITLE.CAMPOS_TABLA.ACTIVO,
                id: "activo", //id is still required when using accessorFn instead of accessorKey
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
        [usuarios],
    );

    const handleEditar = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarUsuario(selected);
            fnModalUsuario(true);
        },
        [usuarios],
    );

    const handleResetearClave = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarUsuario(selected);
            fnModalResetearPwd(true);
        },
        [usuarios],
    );

    const handleActivar = useCallback(
        (selected) => {
            //console.log("clic activar");
            fnAsignarUsuario(selected);
            fnModalAbrirActivarUsuario(true);
        },
        [usuarios],
    );

    const table = useMantineReactTable({
        columns,
        data: usuarios, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
                    },
                    {
                        label: "Resetear contraseña",
                        icon: IconRestore,
                        onClick: handleResetearClave,
                    },
                ]}
            />
        ),
    });

    return <ContenidoTable table={table} />;
};
