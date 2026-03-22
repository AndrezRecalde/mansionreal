import {
    IconBuildings,
    IconBuildingStore,
    IconCalendar,
    IconCategory,
    IconEyeSearch,
    IconFileIsr,
    IconHistory,
    IconListCheck,
    IconLogout,
    IconReceiptTax,
    IconSettings,
    IconShoppingCart,
    IconSpray,
    IconCash,
    IconUserCheck,
    IconUserCircle,
    IconUserPentagon,
    IconUserShield,
} from "@tabler/icons-react";
import { Roles } from "../helpers/getPrefix";

export const menuProfile = [
    /* Menu Perfil Cabecera */
    {
        label: "Ver Perfil",
        path: "perfil",
        link: "/staff/perfil",
        icon: IconUserCircle,
        color: "#245ee3",
    },
    {
        label: "Cambiar contraseña",
        path: "cambiar-contrasena",
        link: "/staff/cambiar-contrasena",
        icon: IconSettings,
        color: "#393d42",
    },
    {
        label: "Cerrar sesión",
        path: "cerrar-sesion",
        link: "",
        icon: IconLogout,
        color: "#cc003d",
    },
];

/* Rutas para administrar: Usuarios, Departamentos, Servicios, Iva, Limpiezas */
export const headerConfigRoutes = {
    CONFIGURACION: [
        {
            icon: IconUserCheck,
            title: "Usuarios",
            path: "usuarios",
            link: "/gerencia/usuarios",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_usuarios"],
        },
        {
            icon: IconBuildings,
            title: "Departamentos",
            path: "departamentos",
            link: "/gerencia/departamentos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_departamentos"],
        },
        {
            icon: IconListCheck,
            title: "Servicios",
            path: "servicios",
            link: "/gerencia/servicios",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_servicios"],
        },
        {
            icon: IconReceiptTax,
            title: "Configuración Iva",
            path: "config-iva",
            link: "/gerencia/config-iva",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["configurar_iva"],
        },
        {
            icon: IconSpray,
            title: "Limpiezas",
            path: "limpiezas",
            link: "/gerencia/limpiezas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_limpiezas"],
        },
    ],
};

/* Rutas para administrar: Calendario Reservas, Disponibilidad Actual, Huespedes */
export const headerReservasRoutes = {
    GERENCIA: [
        {
            icon: IconCalendar,
            title: "Calendario Reservas",
            path: "calendario-reservas",
            link: "/gerencia/calendario-reservas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_calendario_reservas"],
        },
        {
            icon: IconEyeSearch,
            title: "Disponibilidad Actual",
            path: "disponibilidad-departamento",
            link: "/hotel/disponibilidad-departamento",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_disponibilidad"],
        },

        {
            icon: IconUserPentagon,
            title: "Huespedes",
            path: "huespedes",
            link: "/gerencia/huespedes",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_huespedes"],
        },
    ],
};

/* Rutas para administrar: Calendario Reservas, Disponibilidad Actual, Huespedes */
export const headerReportesRoutes = {
    REPORTES: [
        {
            icon: IconBuildings,
            title: "Reporte Reservas",
            path: "reporte-reservas",
            link: "/gerencia/reporte-reservas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["ver_reporte_reservas"],
        },
        {
            icon: IconFileIsr,
            title: "Reporte de Consumos",
            path: "reporte-consumos",
            link: "/gerencia/reporte-consumos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["ver_reporte_consumos"],
        },
    ],
    HISTORIALES: [
        {
            icon: IconListCheck,
            title: "Historial Reservas",
            path: "historial-reservas",
            link: "/gerencia/historial-reservas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["ver_historial_reservas"],
        },
        {
            icon: IconListCheck,
            title: "Historial Pagos",
            path: "historial-pagos",
            link: "/gerencia/historial-pagos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["ver_historial_pagos"],
        },
    ],
    FACTURAS: [
        {
            icon: IconReceiptTax,
            title: "Facturas",
            path: "facturas",
            link: "/gerencia/facturas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA, Roles.ASISTENTE],
            permissions: ["ver_modulo_facturas"],
        },
    ],
};

/* Rutas para administrar: Categorias, Inventario, Historial de Movimientos */
export const headerInventarioRoutes = {
    INVENTARIO: [
        {
            icon: IconCategory,
            title: "Categorias",
            path: "categorias",
            link: "/gerencia/categorias",
            //roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_categorias_inventario"],
        },
        {
            icon: IconBuildingStore,
            title: "Inventario",
            path: "inventario",
            link: "/gerencia/inventario",
            // roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["gestionar_productos_inventario"],
        },
        {
            icon: IconHistory,
            title: "Historial de Movimientos",
            path: "historial-movimientos",
            link: "/gerencia/historial-movimientos",
            //roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
            permissions: ["ver_historial_movimientos_inventario"],
        },
    ],
};

/* Rutas para administrar: Facturas, Venta de Mostrador */
export const headerVentasRapidasRoutes = {
    VENTAS_RAPIDAS: [
        {
            icon: IconShoppingCart,
            title: "Venta de Mostrador",
            path: "venta-mostrador",
            link: "/gerencia/venta-mostrador",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA, Roles.ASISTENTE],
            permissions: ["ver_consumos_externos", "ver_pagos_externos"],
        },
        {
            icon: IconHistory,
            title: "Historial de Cuentas",
            path: "historial-cuentas-venta",
            link: "/gerencia/historial-cuentas-venta",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconCash,
            title: "Turnos de Caja",
            path: "historial-cajas",
            link: "/gerencia/historial-cajas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
};

/* Rutas para configuracion rapida: Usuarios, Departamentos, Servicios, Iva, Limpiezas */
export const menuConfiguracionRapida = [
    {
        icon: IconUserCheck,
        title: "Usuarios",
        path: "usuarios",
        link: "/gerencia/usuarios",
        roles: [Roles.ADMINISTRADOR],
    },
    {
        icon: IconUserShield,
        title: "Roles y Permisos",
        path: "roles-permisos",
        link: "/gerencia/roles-permisos",
        roles: [Roles.ADMINISTRADOR],
    },
    {
        icon: IconBuildings,
        title: "Departamentos",
        path: "departamentos",
        link: "/gerencia/departamentos",
        roles: [Roles.ADMINISTRADOR],
    },
    {
        icon: IconListCheck,
        title: "Servicios",
        path: "servicios",
        link: "/gerencia/servicios",
        roles: [Roles.ADMINISTRADOR],
    },
    {
        icon: IconReceiptTax,
        title: "Configurar Iva",
        path: "config-iva",
        link: "/gerencia/config-iva",
        roles: [Roles.ADMINISTRADOR],
    },
    {
        icon: IconSpray,
        title: "Limpiezas",
        path: "limpiezas",
        link: "/gerencia/limpiezas",
        roles: [Roles.ADMINISTRADOR],
    },
    {
        icon: IconCash,
        title: "Cajas",
        path: "cajas",
        link: "/gerencia/cajas",
        roles: [Roles.ADMINISTRADOR],
    },
];

export const RUTA_DEFAULT = "/staff/perfil";
