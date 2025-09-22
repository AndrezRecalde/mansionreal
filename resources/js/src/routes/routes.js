import { lazy } from "react";
import { Roles } from "../helpers/getPrefix";

const AuthPage = lazy(() =>
    import(/* webpackChunkName: "AuthPage" */ "../pages/auth/AuthPage")
);

const DashboardPage = lazy(() =>
    import(/* webpackChunkName: "DashboardPage" */ "../pages/home/DashboardPage")
);

const PerfilPage = lazy(() =>
    import(/* webpackChunkName: "PerfilPage" */ "../pages/usuario/PerfilPage")
);

const CambioContrasenaPage = lazy(() =>
    import(
        /* webpackChunkName: "CambioContrasenaPage" */ "../pages/usuario/CambioContrasenaPage"
    )
);

const UsuariosPage = lazy(() =>
    import(
        /* webpackChunkName: "UsuarioPage" */ "../pages/usuario/UsuariosPage"
    )
);

const CategoriasPage = lazy(() =>
    import(
        /* webpackChunkName: "CategoriaPage" */ "../pages/categoria/CategoriasPage"
    )
);

const HuespedesPage = lazy(() =>
    import(
        /* webpackChunkName: "HuespedesPage" */ "../pages/huesped/HuespedesPage"
    )
);

const ReservasPage = lazy(() =>
    import(
        /* webpackChunkName: "ReservasPage" */ "../pages/reserva/ReservasPage"
    )
);

const HistorialConsumosPage = lazy(() =>
    import(
        /* webpackChunkName: "HistorialConsumosPage" */ "../pages/consumo/HistorialConsumosPage"
    )
);

const DisponibilidadActualPage = lazy(() =>
    import(
        /* webpackChunkName: "DisponibilidadActualPage" */ "../pages/reserva/DisponibilidadActualPage"
    )
);

const DepartamentosPage = lazy(() =>
    import(
        /* webpackChunkName: "DepartamentosPage" */ "../pages/departamento/DepartamentosPage"
    )
);

const ServiciosPage = lazy(() =>
    import(
        /* webpackChunkName: "ServiciosPage" */ "../pages/servicio/ServiciosPage"
    )
);

const InventarioPage = lazy(() =>
    import(
        /* webpackChunkName: "InventarioPage" */ "../pages/inventario/InventarioPage"
    )
);

const IvaPage = lazy(() =>
    import(/* webpackChunkName: "IvaPage" */ "../pages/iva/ConfigIvaPage")
);

const ErrorNotFound = lazy(() =>
    import(
        /* webpackChunkName: "ErrorNotFound" */ "../pages/error/ErrorNotFound"
    )
);

const generateRoutes = (basePath, components, roles) =>
    components.map(({ path, Component }) => ({
        path: `${path}`,
        link: `${basePath}${path}`,
        Component,
        roles,
    }));

export const PREFIX_ROUTES = {
    ADMINISTRADOR: "/admin",
    GERENCIA: "/gerencia",
};

export const MENU_PATH = {
    DASHBOARD: "dashboard",
    CATEGORIAS: "categorias",
    SERVICIOS: "servicios",
    HUESPEDES: "huespedes",
    RESERVAS: "reservas",
    HISTORIAL_RESERVAS: "historial-reservas",
    DISPONIBILIDAD_ACTUAL: "disponibilidad-actual",
    DEPARTAMENTOS: "departamentos",
    USUARIOS: "usuarios",
    INVENTARIO: "inventario",
    IVA: "config-iva",

    PERFIL: "perfil",
    CAMBIAR_CONTRASENA: "cambiar-contrasena",
};

export const authRoutes = {
    path: "auth/login/*",
    link: "auth/login",
    Component: AuthPage,
};

const gerenciaRoutes = generateRoutes(
    "gerencia",
    [
        { path: MENU_PATH.DASHBOARD, Component: DashboardPage },
        { path: MENU_PATH.CATEGORIAS, Component: CategoriasPage },
        { path: MENU_PATH.SERVICIOS, Component: ServiciosPage },
        { path: MENU_PATH.USUARIOS, Component: UsuariosPage },
        { path: MENU_PATH.HUESPEDES, Component: HuespedesPage },
        { path: MENU_PATH.RESERVAS, Component: ReservasPage },
        { path: MENU_PATH.HISTORIAL_RESERVAS, Component: HistorialConsumosPage },
        { path: MENU_PATH.DEPARTAMENTOS, Component: DepartamentosPage },
        { path: MENU_PATH.DISPONIBILIDAD_ACTUAL, Component: DisponibilidadActualPage },
        { path: MENU_PATH.INVENTARIO, Component: InventarioPage },
        { path: MENU_PATH.IVA, Component: IvaPage },
    ],
    [Roles.ADMINISTRADOR, Roles.GERENCIA]
);

const peerRoutes = generateRoutes(
    "staff",
    [
        { path: MENU_PATH.PERFIL, Component: PerfilPage },
        { path: MENU_PATH.CAMBIAR_CONTRASENA, Component: CambioContrasenaPage },
    ],
    [""]
);

export const routes = {
    GERENCIA: gerenciaRoutes,
};

export const peerLinks = {
    peer: peerRoutes,
};

export const errorRoutes = [
    {
        path: "*",
        Component: ErrorNotFound,
    },
];


