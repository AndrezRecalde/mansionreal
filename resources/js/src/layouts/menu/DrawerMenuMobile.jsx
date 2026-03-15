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

    // Helper to evaluate if a menu group has at least one accessible item based on permissions
    const hasAccessToMenu = (menuData) => {
        const userPerms = Array.isArray(usuario.permissions) ? usuario.permissions : [];
        return Object.values(menuData).some(items => 
            items.some(item => !item.permissions || item.permissions.length === 0 || item.permissions.some(p => userPerms.includes(p)))
        );
    };
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

                {hasAccessToMenu(headerConfigRoutes) && (
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
                )}

                {/* NOTE: Reportes appears mapped here as 'Gerencia' but using the right route constant */}
                {hasAccessToMenu(headerReportesRoutes) && (
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
                )}

                {hasAccessToMenu(headerInventarioRoutes) && (
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
                )}

                {hasAccessToMenu(headerVentasRapidasRoutes) && (
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
                )}

                <Group justify="center" mt={20} mb={20} p={20}>
                    <UserBtnMobile />
                </Group>
            </ScrollArea>
        </Drawer>
    );
};
