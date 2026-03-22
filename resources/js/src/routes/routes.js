import { lazy } from "react";
import { Roles } from "../helpers/getPrefix";

const VentaMostradorPage = lazy(
    () =>
        import(
            /* webpackChunkName: "VentaMostradorPage" */ "../pages/ventaMostrador/VentaMostradorPage"
        ),
);

const HistorialCuentasVentaPage = lazy(
    () =>
        import(
            /* webpackChunkName: "HistorialCuentasVentaPage" */ "../pages/ventaMostrador/HistorialCuentasVentaPage"
        ),
);

const CajasPage = lazy(
    () =>
        import(/* webpackChunkName: "CajasPage" */ "../pages/cajas/CajasPage"),
);

const TurnosCajaHistorialPage = lazy(
    () =>
        import(
            /* webpackChunkName: "TurnosCajaHistorialPage" */ "../pages/cajas/TurnosCajaHistorialPage"
        ),
);

const AuthPage = lazy(
    () => import(/* webpackChunkName: "AuthPage" */ "../pages/auth/AuthPage"),
);

const DashboardPage = lazy(
    () =>
        import(
            /* webpackChunkName: "DashboardPage" */ "../pages/home/DashboardPage"
        ),
);

const PerfilPage = lazy(
    () =>
        import(
            /* webpackChunkName: "PerfilPage" */ "../pages/usuario/PerfilPage"
        ),
);

const CambioContrasenaPage = lazy(
    () =>
        import(
            /* webpackChunkName: "CambioContrasenaPage" */ "../pages/usuario/CambioContrasenaPage"
        ),
);

const UsuariosPage = lazy(
    () =>
        import(
            /* webpackChunkName: "UsuarioPage" */ "../pages/usuario/UsuariosPage"
        ),
);

const RolesPermisosPage = lazy(
    () =>
        import(
            /* webpackChunkName: "RolesPermisosPage" */ "../pages/usuario/RolesPermisosPage"
        ),
);

const CategoriasPage = lazy(
    () =>
        import(
            /* webpackChunkName: "CategoriaPage" */ "../pages/categoria/CategoriasPage"
        ),
);

const HuespedesPage = lazy(
    () =>
        import(
            /* webpackChunkName: "HuespedesPage" */ "../pages/huesped/HuespedesPage"
        ),
);

const HistorialConsumosPage = lazy(
    () =>
        import(
            /* webpackChunkName: "HistorialConsumosPage" */ "../pages/consumo/HistorialConsumosPage"
        ),
);

const DepartamentosPage = lazy(
    () =>
        import(
            /* webpackChunkName: "DepartamentosPage" */ "../pages/departamento/DepartamentosPage"
        ),
);

const ServiciosPage = lazy(
    () =>
        import(
            /* webpackChunkName: "ServiciosPage" */ "../pages/servicio/ServiciosPage"
        ),
);

const InventarioPage = lazy(
    () =>
        import(
            /* webpackChunkName: "InventarioPage" */ "../pages/inventario/InventarioPage"
        ),
);

const HistorialMovimientosInvPage = lazy(
    () =>
        import(
            /* webpackChunkName: "HistorialMovimientosInvPage" */ "../pages/inventario/HistorialMovimientosInvPage"
        ),
);

const IvaPage = lazy(
    () =>
        import(/* webpackChunkName: "IvaPage" */ "../pages/iva/ConfigIvaPage"),
);

const DisponibilidadDepartamentoPage = lazy(
    () =>
        import(
            /* webpackChunkName: "DisponibilidadDepartamentoPage" */ "../pages/departamento/DisponibilidadDepartamentoPage"
        ),
);

const LimpiezaPage = lazy(
    () =>
        import(
            /* webpackChunkName: "LimpiezaPage" */ "../pages/limpieza/LimpiezaPage"
        ),
);

const CalendarioReservasPage = lazy(
    () =>
        import(
            /* webpackChunkName: "CalendarioReservasPage" */ "../pages/calendario/CalendarioReservasPage"
        ),
);

const ReporteConsumosPage = lazy(
    () =>
        import(
            /* webpackChunkName: "ReporteConsumosPage" */ "../pages/consumo/ReporteConsumosPage"
        ),
);

const HistorialPagosPage = lazy(
    () =>
        import(
            /* webpackChunkName: "HistorialPagosPage" */ "../pages/pago/HistorialPagosPage"
        ),
);

const FacturasPage = lazy(
    () =>
        import(
            /* webpackChunkName: "FacturasPage" */ "../pages/facturacion/FacturasPage"
        ),
);

const ErrorNotFound = lazy(
    () =>
        import(
            /* webpackChunkName: "ErrorNotFound" */ "../pages/error/ErrorNotFound"
        ),
);

const generateRoutes = (basePath, components, defaultRoles) =>
    components.map(({ path, Component, roles, permissions }) => ({
        path: `${path}`,
        link: `${basePath}${path}`,
        Component,
        roles: roles || defaultRoles,
        permissions: permissions || null,
    }));

export const PREFIX_ROUTES = {
    ADMINISTRADOR: "/admin",
    GERENCIA: "/gerencia",
};

export const MENU_PATH = {
    DISPONIBILIDAD_DEPARTAMENTO: "disponibilidad-departamento",

    DASHBOARD: "dashboard",
    CATEGORIAS: "categorias",
    SERVICIOS: "servicios",
    LIMPIEZA: "limpiezas",
    HUESPEDES: "huespedes",
    REPORTE_RESERVAS: "reporte-reservas",
    HISTORIAL_RESERVAS: "historial-reservas",
    DISPONIBILIDAD_ACTUAL: "disponibilidad-actual",
    DEPARTAMENTOS: "departamentos",
    USUARIOS: "usuarios",
    INVENTARIO: "inventario",
    HISTORIAL_MOVIMIENTOS: "historial-movimientos",
    IVA: "config-iva",
    CALENDARIO_RESERVAS: "calendario-reservas",
    REPORTE_CONSUMOS: "reporte-consumos",
    HISTORIAL_PAGOS: "historial-pagos",
    FACTURAS: "facturas",
    VENTA_MOSTRADOR: "venta-mostrador",
    HISTORIAL_CUENTAS_VENTA: "historial-cuentas-venta",
    HISTORIAL_CAJAS: "historial-cajas",
    CAJAS: "cajas",

    PERFIL: "perfil",
    CAMBIAR_CONTRASENA: "cambiar-contrasena",
    ROLES_PERMISOS: "roles-permisos",
};

export const authRoutes = {
    path: "auth/login/*",
    link: "auth/login",
    Component: AuthPage,
};

const generalRoutes = generateRoutes(
    "hotel",
    [
        {
            path: MENU_PATH.DISPONIBILIDAD_DEPARTAMENTO,
            Component: DisponibilidadDepartamentoPage,
        },
    ],
    [Roles.ASISTENTE, Roles.GERENCIA, Roles.ADMINISTRADOR],
);

const gerenciaRoutes = generateRoutes(
    "gerencia",
    [
        { path: MENU_PATH.DASHBOARD, Component: DashboardPage },
        { path: MENU_PATH.SERVICIOS, Component: ServiciosPage },
        { path: MENU_PATH.USUARIOS, Component: UsuariosPage },
        { path: MENU_PATH.ROLES_PERMISOS, Component: RolesPermisosPage },
        { path: MENU_PATH.HUESPEDES, Component: HuespedesPage },
        { path: MENU_PATH.LIMPIEZA, Component: LimpiezaPage },
        {
            path: MENU_PATH.CALENDARIO_RESERVAS,
            Component: CalendarioReservasPage,
        },
        {
            path: MENU_PATH.HISTORIAL_RESERVAS,
            Component: HistorialConsumosPage,
        },
        {
            path: MENU_PATH.DEPARTAMENTOS,
            Component: DepartamentosPage,
        },
        {
            path: MENU_PATH.CATEGORIAS,
            Component: CategoriasPage,
            permissions: ["gestionar_categorias_inventario"],
        },
        {
            path: MENU_PATH.INVENTARIO,
            Component: InventarioPage,
            permissions: ["gestionar_productos_inventario"],
        },
        {
            path: MENU_PATH.HISTORIAL_MOVIMIENTOS,
            Component: HistorialMovimientosInvPage,
            permissions: ["ver_historial_movimientos_inventario"],
        },
        {
            path: MENU_PATH.IVA,
            Component: IvaPage,
        },
        {
            path: MENU_PATH.REPORTE_CONSUMOS,
            Component: ReporteConsumosPage,
        },

        {
            path: MENU_PATH.HISTORIAL_PAGOS,
            Component: HistorialPagosPage,
        },

        {
            path: MENU_PATH.FACTURAS,
            Component: FacturasPage,
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA, Roles.ASISTENTE],
            permissions: ["ver_facturas"],
        },
        {
            path: MENU_PATH.VENTA_MOSTRADOR,
            Component: VentaMostradorPage,
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA, Roles.ASISTENTE],
            permissions: ["ver_consumos_externos", "ver_pagos_externos"],
        },
        {
            path: MENU_PATH.HISTORIAL_CUENTAS_VENTA,
            Component: HistorialCuentasVentaPage,
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            path: MENU_PATH.HISTORIAL_CAJAS,
            Component: TurnosCajaHistorialPage,
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            path: MENU_PATH.CAJAS,
            Component: CajasPage,
            roles: [Roles.ADMINISTRADOR],
        },
    ],
    [Roles.ADMINISTRADOR, Roles.GERENCIA],
);

const peerRoutes = generateRoutes(
    "staff",
    [
        { path: MENU_PATH.PERFIL, Component: PerfilPage },
        { path: MENU_PATH.CAMBIAR_CONTRASENA, Component: CambioContrasenaPage },
    ],
    [""],
);

export const routes = {
    GERENCIA: gerenciaRoutes,
    GENERAL: generalRoutes,
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
