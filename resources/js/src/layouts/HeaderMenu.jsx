import { Box, Burger, Group, useMantineTheme } from "@mantine/core";
import { Logo } from "../components";
import { Roles } from "../helpers/getPrefix";
import { HeaderBtnInicio } from "./HeaderBtnInicio";
import {
    headerConfigRoutes,
    headerGerenciaRoutes,
    headerInventarioRoutes,
} from "../routes/menuRoutes";
import { useUiHeaderMenu } from "../hooks";
import { GestionMenu } from "./menu/GestionMenu";
import { UserBtnHeader } from "./menu/UserBtnHeader";
import { DrawerMenuMobile } from "./menu/DrawerMenuMobile";
import classes from "./modules/HeaderMenu.module.css";

export const HeaderMenu = ({ usuario }) => {
    const { abrirDrawerMobile, fnDrawerMobile } = useUiHeaderMenu();
    const theme = useMantineTheme();
    return (
        <Box pb={30}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Group h="100%">
                        <Logo height={50} width={200} />
                        <Group h="100%" gap={0} visibleFrom="lg">
                            <HeaderBtnInicio classes={classes} theme={theme} />
                            {/* MENU DE GESTION DE CONFIGURACION DE PARAMETROS */}
                            {usuario.role === Roles.ADMINISTRADOR ||
                            usuario.role === Roles.GERENCIA ? (
                                <GestionMenu
                                    title="Configuraciónes"
                                    menuData={headerConfigRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}
                            {/* MENU DE GESTION GERENCIAL DEL HOTEL */}
                            {usuario.role === Roles.ADMINISTRADOR ||
                            usuario.role === Roles.GERENCIA ? (
                                <GestionMenu
                                    title="Gerencia"
                                    menuData={headerGerenciaRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}
                            {/* MENU DE GESTION DE INVENTARIO */}
                            {usuario.role === Roles.ADMINISTRADOR ||
                            usuario.role === Roles.GERENCIA ? (
                                <GestionMenu
                                    title="Inventario"
                                    menuData={headerInventarioRoutes}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}
                        </Group>
                    </Group>
                    <Group visibleFrom="lg">
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
