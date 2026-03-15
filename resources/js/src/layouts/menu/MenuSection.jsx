import {
    UnstyledButton,
    Center,
    Box,
    Collapse,
    Text,
    Group,
    ThemeIcon,
    Divider,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const MenuSection = ({
    title,
    usuario,
    menuData,
    isOpen,
    toggle,
    classes,
    theme,
    toggleDrawer,
}) => {
    const handleActionToggle = () => {
        isOpen ? toggle(false) : toggle(true);
    };
    return (
        <>
            <UnstyledButton
                className={classes.link}
                onClick={() => handleActionToggle()}
            >
                <Center inline>
                    <Box component="span" mr={5}>
                        {title}
                    </Box>
                    <IconChevronDown size={16} color={theme.colors.dark[8]} />
                </Center>
            </UnstyledButton>
            <Collapse in={isOpen}>
                {menuData.map(({ category, items }) => {
                    const userPerms = Array.isArray(usuario.permissions) ? usuario.permissions : [];

                    const allowedItems = items.filter((item) => {
                        return !item.permissions || (item.permissions.length === 0) || item.permissions.some((perm) => userPerms.includes(perm));
                    });

                    if (allowedItems.length === 0) return null;

                    return (
                        <div key={category} style={{ paddingLeft: 10 }}>
                            <Text fw={700} size="sm" c="dimmed">
                                {category}
                            </Text>
                        {items.map((item) => {
                            const userPerms = Array.isArray(usuario.permissions) ? usuario.permissions : [];
                            const isAllowed = !item.permissions || (item.permissions.length === 0) || item.permissions.some((perm) => userPerms.includes(perm));

                            if (!isAllowed) return null; // Oculta el item si el rol no tiene permiso

                            return (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className={classes.subLink}
                                    onClick={() => toggleDrawer(false)}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <Group wrap="nowrap" align="center">
                                        <ThemeIcon
                                            size={35}
                                            variant="default"
                                            radius="md"
                                        >
                                            <item.icon size={18} />
                                        </ThemeIcon>
                                        <Text size="sm">{item.title}</Text>
                                    </Group>
                                </Link>
                            );

                        })}
                        <Divider my="sm" />
                        </div>
                    );
                })}
            </Collapse>
            <Divider my="sm" />
        </>
    );
};
