import { Divider, Drawer, Group, ScrollArea } from "@mantine/core";
import { Roles } from "../../helpers/getPrefix";
import { MenuHome } from "./MenuHome";
import { MenuSection } from "./MenuSection";
import { headerConfigRoutes, headerGerenciaRoutes, headerInventarioRoutes } from "../../routes/menuRoutes";
import { useUiHeaderMenu } from "../../hooks";
import { UserBtnMobile } from "./UserBtnMobile";

export const DrawerMenuMobile = ({ usuario, classes, theme }) => {
    const {
        abrirDrawerMobile,
        abrirLinksConfiguracion,
        abrirLinksGerencia,
        abrirLinksInventario,
        fnDrawerMobile,
        fnLinksConfiguracion,
        fnLinksGerencia,
        fnLinksInventario
    } = useUiHeaderMenu();
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

                { usuario.role === Roles.ADMINISTRADOR ||
                  usuario.role === Roles.GERENCIA ? (
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

                { usuario.role === Roles.ADMINISTRADOR ||
                  usuario.role === Roles.GERENCIA ||
                  usuario.role === Roles.ASISTENTE ? (
                    <MenuSection
                        title="Gerencia"
                        usuario={usuario}
                        menuData={headerGerenciaRoutes}
                        classes={classes}
                        theme={theme}
                        isOpen={abrirLinksGerencia}
                        toggle={fnLinksGerencia}
                        toggleDrawer={fnDrawerMobile}
                    />
                ) : null}

                { usuario.role === Roles.ADMINISTRADOR ||
                  usuario.role === Roles.GERENCIA ? (
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

                <Group justify="center" mt={20} mb={20} p={20}>
                    <UserBtnMobile />
                </Group>
            </ScrollArea>
        </Drawer>
    );
};
