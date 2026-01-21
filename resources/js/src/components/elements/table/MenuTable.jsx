import { Menu, rem } from "@mantine/core";
import {
    IconCategoryPlus,
    IconDownload,
    IconEdit,
    IconEye,
    IconEyeSearch,
    IconFileText,
    IconRestore,
    IconTrash,
} from "@tabler/icons-react";

export const MenuTable_EA = ({
    row,
    titulo,
    handleAction,
    Icon = IconEdit,
}) => {
    return (
        <>
            <Menu.Item
                leftSection={
                    <Icon style={{ width: rem(15), height: rem(15) }} />
                }
                onClick={() => handleAction(row.original)}
            >
                {titulo}
            </Menu.Item>
        </>
    );
};

export const MenuUsersTable = ({ row, handleEditar, handleResetearClave }) => {
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
                    <IconRestore style={{ width: rem(15), height: rem(15) }} />
                }
                onClick={() => handleResetearClave(row.original)}
            >
                Resetear contraseña
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

export const MenuTable_EE = ({ row, handleEditar, handleEliminar }) => {
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

export const MenuTableFactura = ({
    factura,
    onVerDetalle,
    onVerPDF,
    onAnular,
    onDescargar,
}) => {
    return (
        <>
            <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={() => onVerDetalle(factura)}
            >
                Ver Detalle
            </Menu.Item>

            <Menu.Item
                leftSection={<IconFileText size={16} />}
                onClick={() => onVerPDF(factura)}
            >
                Ver PDF
            </Menu.Item>

            <Menu.Item
                leftSection={<IconDownload size={16} />}
                onClick={() => onDescargar(factura)}
            >
                Descargar PDF
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={() => onAnular(factura)}
                disabled={factura.estado !== "EMITIDA"}
            >
                Anular Factura
            </Menu.Item>
        </>
    );
};
