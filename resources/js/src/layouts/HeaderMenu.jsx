import { Box, Burger, Group, useMantineTheme } from "@mantine/core";
import { Logo } from "../components";
import { Roles } from "../helpers/getPrefix";
import { HeaderBtnInicio } from "./HeaderBtnInicio";
import {
    headerVentasRapidasRoutes,
    headerReportesRoutes,
    headerInventarioRoutes,
    menuConfiguracionRapida,
    headerReservasRoutes,
} from "../routes/menuRoutes";
import { useUiHeaderMenu } from "../hooks";
import { GestionMenu } from "./menu/GestionMenu";
import { UserBtnHeader } from "./menu/UserBtnHeader";
import { DrawerMenuMobile } from "./menu/DrawerMenuMobile";
import { ConfiguracionMenu } from "./menu/ConfiguracionMenu";
import classes from "./modules/HeaderMenu.module.css";

export const HeaderMenu = ({ usuario }) => {
    const { abrirDrawerMobile, fnDrawerMobile } = useUiHeaderMenu();
    const theme = useMantineTheme();

    // Helper to evaluate if a menu group has at least one accessible item based on permissions
    const hasAccessToMenu = (menuData) => {
        const userPerms = Array.isArray(usuario.permissions)
            ? usuario.permissions
            : [];
        return Object.values(menuData).some((items) =>
            items.some(
                (item) =>
                    !item.permissions ||
                    item.permissions.length === 0 ||
                    item.permissions.some((p) => userPerms.includes(p)),
            ),
        );
    };

    return (
        <Box pb={30}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Group h="100%">
                        <Logo height={50} width={200} />
                        <Group h="100%" gap={0} visibleFrom="lg">
                            {/* Inicio Button */}
                            {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                            usuario.roles?.includes(Roles.GERENCIA) ? (
                                <HeaderBtnInicio
                                    usuario={usuario}
                                    classes={classes}
                                />
                            ) : null}

                            {/* MENU DE GESTION DE RESERVAS DEL HOTEL */}
                            {hasAccessToMenu(headerReservasRoutes) && (
                                <GestionMenu
                                    title="Reservas Hotel"
                                    menuData={headerReservasRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            )}
                            {/* MENU DE GESTION DE REPORTES DEL HOTEL */}
                            {hasAccessToMenu(headerReportesRoutes) && (
                                <GestionMenu
                                    title="Reportes Hotel"
                                    menuData={headerReportesRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            )}
                            {/* MENU DE GESTION DE INVENTARIO */}
                            {hasAccessToMenu(headerInventarioRoutes) && (
                                <GestionMenu
                                    title="Inventario"
                                    menuData={headerInventarioRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            )}

                            {hasAccessToMenu(headerVentasRapidasRoutes) && (
                                <GestionMenu
                                    title="Ventas Rápidas"
                                    menuData={headerVentasRapidasRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            )}
                        </Group>
                    </Group>
                    <Group visibleFrom="lg">
                        {menuConfiguracionRapida.some(
                            (item) =>
                                !item.permissions ||
                                (Array.isArray(usuario.permissions) &&
                                    item.permissions.some((p) =>
                                        usuario.permissions.includes(p),
                                    )),
                        ) && (
                            <ConfiguracionMenu
                                menuData={menuConfiguracionRapida}
                                classes={classes}
                                theme={theme}
                            />
                        )}
                        <UserBtnHeader
                            usuario={usuario}
                            theme={theme}
                            classes={classes}
                        />
                    </Group>
                    <Burger
                        opened={abrirDrawerMobile}
                        onClick={() => fnDrawerMobile(true)}
                        hiddenFrom="lg"
                    />
                </Group>
            </header>
            <DrawerMenuMobile
                usuario={usuario}
                classes={classes}
                theme={theme}
            />
        </Box>
    );
};
