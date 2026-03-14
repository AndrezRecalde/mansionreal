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

    // Check if user has roles or permissions to see the Facturas menu
    const showFacturasMenu =
        usuario.roles?.includes(Roles.ADMINISTRADOR) ||
        usuario.roles?.includes(Roles.GERENCIA) ||
        (Array.isArray(usuario.permissions) &&
            usuario.permissions.some((p) =>
                [
                    "ver_facturas",
                    "ver_consumos_externos",
                    "ver_pagos_externos",
                ].includes(p),
            ));

    return (
        <Box pb={30}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Group h="100%">
                        <Logo height={50} width={200} />
                        <Group h="100%" gap={0} visibleFrom="lg">
                            {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                            usuario.roles?.includes(Roles.GERENCIA) ? (
                                <HeaderBtnInicio
                                    usuario={usuario}
                                    classes={classes}
                                />
                            ) : null}
                            {/* MENU DE GESTION DE RESERVAS DEL HOTEL */}
                            {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                            usuario.roles?.includes(Roles.GERENCIA) ||
                            usuario.roles?.includes(Roles.ASISTENTE) ? (
                                <GestionMenu
                                    title="Reservas Hotel"
                                    menuData={headerReservasRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}
                            {/* MENU DE GESTION DE REPORTES DEL HOTEL */}
                            {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                            usuario.roles?.includes(Roles.GERENCIA) ||
                            usuario.roles?.includes(Roles.ASISTENTE) ? (
                                <GestionMenu
                                    title="Reportes Hotel"
                                    menuData={headerReportesRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}
                            {/* MENU DE GESTION DE INVENTARIO */}
                            {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                            usuario.roles?.includes(Roles.GERENCIA) ? (
                                <GestionMenu
                                    title="Inventario"
                                    menuData={headerInventarioRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}

                            {showFacturasMenu ? (
                                <GestionMenu
                                    title="Ventas Rápidas"
                                    menuData={headerVentasRapidasRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}
                        </Group>
                    </Group>
                    <Group visibleFrom="lg">
                        {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                        usuario.roles?.includes(Roles.GERENCIA) ? (
                            <ConfiguracionMenu
                                menuData={menuConfiguracionRapida}
                                classes={classes}
                                theme={theme}
                            />
                        ) : null}
                        <UserBtnHeader usuario={usuario} />
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
