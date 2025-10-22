import { Menu, rem } from "@mantine/core";
import {
    IconCategoryPlus,
    IconEdit,
    IconEyeSearch,
    IconTrash,
} from "@tabler/icons-react";

export const MenuTable_EA = ({ row, titulo, handleAction }) => {
    return (
        <>
            <Menu.Item
                leftSection={
                    <IconEdit style={{ width: rem(15), height: rem(15) }} />
                }
                onClick={() => handleAction(row.original)}
            >
                {titulo}
            </Menu.Item>
        </>
    );
};

export const MenuTable_DEPT = ({ row, handleEditar, handleServicios }) => {
    return (
        <>
            <Menu.Item
                leftSection={
                    <IconEdit style={{ width: rem(15), height: rem(15) }} />
                }
                onClick={() => handleEditar(row.original)}
            >
                Editar
            </Menu.Item>
            <Menu.Item
                leftSection={
                    <IconCategoryPlus
                        style={{ width: rem(15), height: rem(15) }}
                    />
                }
                onClick={() => handleServicios(row.original)}
            >
                Servicios
            </Menu.Item>
        </>
    );
};

export const MenuTable_RESERVA = ({
    row,
    //handleEditar,
    handleAgregarConsumos,
}) => {
    return (
        <>
            {/* <Menu.Item
                leftSection={
                    <IconEdit style={{ width: rem(15), height: rem(15) }} />
                }
                disabled={
                    row.original.estado === "PAGADO" ||
                    row.original.estado === "CANCELADO"
                        ? true
                        : false
                }
                onClick={() => handleEditar(row.original)}
            >
                Editar
            </Menu.Item> */}
            <Menu.Item
                leftSection={
                    <IconEyeSearch
                        style={{ width: rem(15), height: rem(15) }}
                    />
                }
                onClick={() => handleAgregarConsumos(row.original)}
            >
                Ver Reserva
            </Menu.Item>
        </>
    );
};

export const MenuTable_EE = ({ row, titulo, handleEditar, handleEliminar }) => {
    return (
        <>
            <Menu.Item
                leftSection={
                    <IconEdit style={{ width: rem(15), height: rem(15) }} />
                }
                onClick={() => handleEditar(row.original)}
            >
                Editar
            </Menu.Item>
            <Menu.Item
                leftSection={
                    <IconTrash style={{ width: rem(15), height: rem(15) }} />
                }
                onClick={() => handleEliminar(row.original)}
            >
                Eliminar
            </Menu.Item>
        </>
    );
};
