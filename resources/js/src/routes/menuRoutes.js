import {
    IconBuildings,
    IconBuildingStore,
    IconCategory,
    IconEyeSearch,
    IconFileIsr,
    IconListCheck,
    IconLogout,
    IconPercentage,
    IconSettings,
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
            icon: IconCategory,
            title: "Categorias",
            path: "categorias",
            link: "/gerencia/categorias",
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
            icon: IconPercentage,
            title: "Configuración Iva",
            path: "config-iva",
            link: "/gerencia/config-iva",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
};

export const headerGerenciaRoutes = {
    GERENCIA: [
        {
            icon: IconEyeSearch,
            title: "Disponibilidad Actual",
            path: "disponibilidad-departamento",
            link: "/gerencia/disponibilidad-departamento",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconListCheck,
            title: "Historial Reservas",
            path: "historial-reservas",
            link: "/gerencia/historial-reservas",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },

        {
            icon: IconUserPentagon,
            title: "Huespedes",
            path: "huespedes",
            link: "/gerencia/huespedes",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconBuildingStore,
            title: "Inventario",
            path: "inventario",
            link: "/gerencia/inventario",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],

    REPORTES: [
        {
            icon: IconBuildings,
            title: "Reporte Departamentos",
            path: "reporte-departamentos",
            link: "/gerencia/reporte-departamentos",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
        {
            icon: IconFileIsr,
            title: "Reportes de Gerente",
            path: "reportes-gerentes",
            link: "/gerencia/reportes-gerentes",
            roles: [Roles.ADMINISTRADOR, Roles.GERENCIA],
        },
    ],
};
