import { ActionIcon, Menu, rem } from "@mantine/core";
import { IconDots, IconEdit } from "@tabler/icons-react";
/**
 * Componente genérico de menú para tablas
 * @param {Object} row - Fila de la tabla (contiene row.original)
 * @param {Array} items - Array de objetos con la configuración de cada item del menú
 *
 * Estructura de items:
 * {
 *   label: string,           // Texto del item
 *   icon: Component,         // Componente de ícono de Tabler
 *   onClick: function,       // Función a ejecutar
 *   disabled: boolean,       // (Opcional) Deshabilitar item
 *   color: string,           // (Opcional) Color del item
 * }
 */
export const MenuAcciones = ({
    row,
    items = [
        {
            label: "Editar",
            icon: IconEdit,
            onClick: () => {},
            disabled: false,
            color: undefined,
        },
    ],
}) => {
    const iconStyle = { width: rem(15), height: rem(15) };

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon
                    variant="subtle"
                    color="gray"
                >
                    <IconDots size={16} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Acciones</Menu.Label>
                {items.map((item, index) => (
                    <Menu.Item
                        key={index}
                        leftSection={<item.icon style={iconStyle} />}
                        onClick={() => item.onClick(row.original)}
                        disabled={item.disabled}
                        color={item.color}
                    >
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};
