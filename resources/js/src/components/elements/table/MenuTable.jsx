import { Menu, rem } from "@mantine/core";
import {
    IconBorderLeftPlus,
    IconCategoryPlus,
    IconChecks,
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

export const MenuTable_RESERVA = ({
    row,
    handleEditar,
    handleAgregarConsumos,
    handleFinalizarReserva,
}) => {
    return (
        <>
            <Menu.Item
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
            </Menu.Item>
            <Menu.Item
                leftSection={
                    <IconBorderLeftPlus
                        style={{ width: rem(15), height: rem(15) }}
                    />
                }
                disabled={
                    row.original.estado === "PAGADO" ||
                    row.original.estado === "CANCELADO"
                        ? true
                        : false
                }
                onClick={() => handleAgregarConsumos(row.original)}
            >
                Agregar Consumos
            </Menu.Item>
            <Menu.Item
                leftSection={
                    <IconChecks style={{ width: rem(15), height: rem(15) }} />
                }
                disabled={
                    row.original.estado === "PAGADO" ||
                    row.original.estado === "CANCELADO"
                        ? true
                        : false
                }
                onClick={() => handleFinalizarReserva(row.original)}
            >
                Finalizar Reserva
            </Menu.Item>
        </>
    );
};
