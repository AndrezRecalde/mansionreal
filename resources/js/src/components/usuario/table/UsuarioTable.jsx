import { useCallback, useMemo } from "react";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useMantineReactTable } from "mantine-react-table";
import { useUiUsuario, useUsuarioStore } from "../../../hooks";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuTable_EA,
    MenuUsersTable,
} from "../../../components";
import { Badge } from "@mantine/core";

export const UsuarioTable = () => {
    const { cargando, usuarios, fnAsignarUsuario } = useUsuarioStore();
    const { fnModalUsuario, fnModalAbrirActivarUsuario, fnModalResetearPwd } = useUiUsuario();

    const columns = useMemo(
        () => [
            {
                header: "Nombres Completos",
                accessorFn: (row) => row.apellidos + " " + row.nombres, //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: "Cedula",
                accessorKey: "dni", //normal accessorKey
            },
            {
                header: "Email",
                accessorKey: "email", //normal accessorKey
            },
            {
                header: "Roles",
                accessorKey: "role", //normal accessorKey
                Cell: ({ cell }) => (
                    <Badge color="indigo.7" radius="sm" variant="light">
                        {cell.getValue()}
                    </Badge>
                ),
                //filterVariant: "autocomplete",
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
        [usuarios]
    );

    const handleEditar = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarUsuario(selected);
            fnModalUsuario(true);
        },
        [usuarios]
    );

    const handleResetearClave = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarUsuario(selected);
            fnModalResetearPwd(true);
        },
        [usuarios]
    );

    const handleActivar = useCallback(
        (selected) => {
            //console.log("clic activar");
            fnAsignarUsuario(selected);
            fnModalAbrirActivarUsuario(true);
        },
        [usuarios]
    );

    const table = useMantineReactTable({
        columns,
        data: usuarios, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        renderRowActionMenuItems: ({ row }) => (
            <MenuUsersTable
                row={row}
                handleEditar={handleEditar}
                handleResetearClave={handleResetearClave}
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
