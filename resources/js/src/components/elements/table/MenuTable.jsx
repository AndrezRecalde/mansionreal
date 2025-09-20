import { Menu, rem } from "@mantine/core";
import {
    IconCategoryPlus,
    IconEdit,
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
