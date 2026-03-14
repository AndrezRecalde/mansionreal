import { Divider, Drawer, Group, ScrollArea } from "@mantine/core";
import { Roles } from "../../helpers/getPrefix";
import { MenuHome } from "./MenuHome";
import { MenuSection } from "./MenuSection";
import {
    headerConfigRoutes,
    headerReportesRoutes,
    headerInventarioRoutes,
    headerVentasRapidasRoutes,
} from "../../routes/menuRoutes";
import { useUiHeaderMenu } from "../../hooks";
import { UserBtnMobile } from "./UserBtnMobile";

export const DrawerMenuMobile = ({ usuario, classes, theme }) => {
    const {
        abrirDrawerMobile,
        abrirLinksConfiguracion,
        abrirLinksGerencia,
        abrirLinksInventario,
        abrirLinksFacturas,
        fnDrawerMobile,
        fnLinksConfiguracion,
        fnLinksGerencia,
        fnLinksInventario,
        fnLinksFacturas,
    } = useUiHeaderMenu();

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
        <Drawer
            opened={abrirDrawerMobile}
            onClose={() => fnDrawerMobile(false)}
            size="100%"
            padding="md"
            title="Menú"
            hiddenFrom="lg"
            zIndex={1000000}
            classNames={{
                body: classes.drawer,
                header: classes.drawer,
            }}
        >
            <ScrollArea h="calc(100vh - 80px" mx="-md">
                <MenuHome
                    classes={classes}
                    theme={theme}
                    toggleDrawer={fnDrawerMobile}
                />
                <Divider my="sm" />

                {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                usuario.roles?.includes(Roles.GERENCIA) ? (
                    <MenuSection
                        title="Configuraciónes"
                        usuario={usuario}
                        menuData={headerConfigRoutes}
                        classes={classes}
                        theme={theme}
                        isOpen={abrirLinksConfiguracion}
                        toggle={fnLinksConfiguracion}
                        toggleDrawer={fnDrawerMobile}
                    />
                ) : null}

                {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                usuario.roles?.includes(Roles.GERENCIA) ||
                usuario.roles?.includes(Roles.ASISTENTE) ? (
                    <MenuSection
                        title="Gerencia"
                        usuario={usuario}
                        menuData={headerReportesRoutes}
                        classes={classes}
                        theme={theme}
                        isOpen={abrirLinksGerencia}
                        toggle={fnLinksGerencia}
                        toggleDrawer={fnDrawerMobile}
                    />
                ) : null}

                {usuario.roles?.includes(Roles.ADMINISTRADOR) ||
                usuario.roles?.includes(Roles.GERENCIA) ? (
                    <MenuSection
                        title="Inventario"
                        usuario={usuario}
                        menuData={headerInventarioRoutes}
                        classes={classes}
                        theme={theme}
                        isOpen={abrirLinksInventario}
                        toggle={fnLinksInventario}
                        toggleDrawer={fnDrawerMobile}
                    />
                ) : null}

                {showFacturasMenu ? (
                    <MenuSection
                        title="Ventas Rápidas"
                        usuario={usuario}
                        menuData={headerVentasRapidasRoutes}
                        classes={classes}
                        theme={theme}
                        isOpen={abrirLinksFacturas}
                        toggle={fnLinksFacturas}
                        toggleDrawer={fnDrawerMobile}
                    />
                ) : null}

                <Group justify="center" mt={20} mb={20} p={20}>
                    <UserBtnMobile />
                </Group>
            </ScrollArea>
        </Drawer>
    );
};
