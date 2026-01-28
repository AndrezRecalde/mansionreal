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
    IconSpray,
    IconUserCheck,
    IconUserCircle,
    IconUserPentagon,
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

export const headerConfigRoutes = {
    CONFIGURACION: [
        {
            icon: IconUserCheck,
            title: "Usuarios",
            path: "usuarios",
            link: "/gerencia/usuarios",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },

        {
            icon: IconBuildings,
            title: "Departamentos",
            path: "departamentos",
            link: "/gerencia/departamentos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconListCheck,
            title: "Servicios",
            path: "servicios",
            link: "/gerencia/servicios",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconReceiptTax,
            title: "Configuración Iva",
            path: "config-iva",
            link: "/gerencia/config-iva",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconSpray,
            title: "Limpiezas",
            path: "limpiezas",
            link: "/gerencia/limpiezas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
};

export const headerGerenciaRoutes = {
    GERENCIA: [
        {
            icon: IconCalendar,
            title: "Calendario Reservas",
            path: "calendario-reservas",
            link: "/gerencia/calendario-reservas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconEyeSearch,
            title: "Disponibilidad Actual",
            path: "disponibilidad-departamento",
            link: "/hotel/disponibilidad-departamento",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA, Roles.ASISTENTE],
        },

        {
            icon: IconUserPentagon,
            title: "Huespedes",
            path: "huespedes",
            link: "/gerencia/huespedes",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],

    REPORTES: [
        {
            icon: IconBuildings,
            title: "Reporte Reservas",
            path: "reporte-reservas",
            link: "/gerencia/reporte-reservas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        /* {
            icon: IconFileIsr,
            title: "Reportes de Gerente",
            path: "reportes-gerentes",
            link: "/gerencia/reportes-gerentes",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        }, */
        {
            icon: IconFileIsr,
            title: "Reporte de Consumos",
            path: "reporte-consumos",
            link: "/gerencia/reporte-consumos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
    HISTORIALES: [
        {
            icon: IconListCheck,
            title: "Historial Reservas",
            path: "historial-reservas",
            link: "/gerencia/historial-reservas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconListCheck,
            title: "Historial Pagos",
            path: "historial-pagos",
            link: "/gerencia/historial-pagos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
};

export const headerInventarioRoutes = {
    INVENTARIO: [
        {
            icon: IconCategory,
            title: "Categorias",
            path: "categorias",
            link: "/gerencia/categorias",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconBuildingStore,
            title: "Inventario",
            path: "inventario",
            link: "/gerencia/inventario",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconHistory,
            title: "Historial de Movimientos",
            path: "historial-movimientos",
            link: "/gerencia/historial-movimientos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
};

export const headerFacturasRoutes = {
    FACTURAS: [
        {
            icon: IconReceiptTax,
            title: "Facturas",
            path: "facturas",
            link: "/gerencia/facturas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
};

export const menuConfiguracionRapida = [
    {
        icon: IconUserCheck,
        title: "Listar Usuarios",
        path: "usuarios",
        link: "/gerencia/usuarios",
        roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
    },

    {
        icon: IconBuildings,
        title: "Listar Departamentos",
        path: "departamentos",
        link: "/gerencia/departamentos",
        roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
    },
    {
        icon: IconListCheck,
        title: "Listar Servicios",
        path: "servicios",
        link: "/gerencia/servicios",
        roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
    },
    {
        icon: IconReceiptTax,
        title: "Configurar Iva",
        path: "config-iva",
        link: "/gerencia/config-iva",
        roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
    },
    {
        icon: IconSpray,
        title: "Listar Limpiezas",
        path: "limpiezas",
        link: "/gerencia/limpiezas",
        roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
    },
];

export const RUTA_DEFAULT = "/staff/perfil";
