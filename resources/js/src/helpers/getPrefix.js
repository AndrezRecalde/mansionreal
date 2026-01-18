export const NOMBRE_SISTEMA = "Mansión Real";
export const BIENVENIDA = "Bienvenido";
export const BIENVENIDA_MENSAJE = "Cada amanecer, un recuerdo";

export const Roles = {
    ADMINISTRADOR: "ADMINISTRADOR",
    GERENCIA: "GERENTE",
    ASISTENTE: "ASISTENTE",
};

export const Estados = {
    DISPONIBLE: "DISPONIBLE",
    OCUPADO: "OCUPADO",
    LIMPIEZA: "LIMPIEZA",
    MANTENIMIENTO: "MANTENIMIENTO",
    RESERVADO: "RESERVADO",
    CONFIRMADO: "CONFIRMADO",
    CANCELADO: "CANCELADO",
    PAGADO: "PAGADO",
    PENDIENTE: "PENDIENTE",
    VENCIDO: "VENCIDO",
};

export const PAGE_TITLE = {

    AUTENTICACION: {
        TITLE: "Autenticación - Mansión Real",
        INPUTS: {
            LABEL_USUARIO: "Usuario",
            PLACEHOLDER_USUARIO: "Digite su usuario",
            LABEL_CONTRASEÑA: "Contraseña",
            PLACEHOLDER_CONTRASENA: "Tu contraseña",
        },
        BUTTONS: {
            ACCEDER: "Acceder",
        }
    },

    /* ** PAGINA DE PERFIL ** */
    PERFIL: {
        TITLE: "Mi Perfil - Mansión Real",
        TITLE_PAGE: "Mi Perfil",
        SECTION_LABELS: {
            NOMBRES_COMPLETOS: "Nombres Completos",
            NUMERO_CEDULA: "Número de Cédula",
            CORREO: "Correo",
            ESTADO_USUARIO: "Estado del Usuario",
        },
        BUTTONS: {
            GESTIONAR_RESERVAS: "Gestionar Reservas",
            CAMBIAR_CONTRASENA: "Cambiar Contraseña",
        },
        NAVEGACIONES: {
            GESTIONAR_RESERVAS: "/hotel/disponibilidad-departamento",
            CAMBIAR_CONTRASENA: "/staff/cambiar-contrasena",
        },
    },

    DASHBOARD: "Dashboard - Mansión Real",
    RESERVAS: "Gestión de Reservas - Mansión Real",
    HUESPEDES: "Gestión de Huéspedes - Mansión Real",
    DEPARTAMENTOS: "Gestión de Departamentos - Mansión Real",
    PRODUCTOS: "Gestión de Productos - Mansión Real",
    REPORTES: "Reportes - Mansión Real",
    PAGOS: "Gestión de Pagos - Mansión Real",
    FACTURAS: "Gestión de Facturas - Mansión Real",

    USUARIOS: "Gestión de Usuarios - Mansión Real",
    IVA: "Gestión de IVA - Mansión Real",
    CATEGORIAS: "Gestión de Categorías - Mansión Real",
    CONSUMOS: "Gestión de Consumos - Mansión Real",
    GASTOS: "Gestión de Gastos - Mansión Real",
    HISTORIAL_CONSUMOS: "Historial Reservas - Mansión Real",
    SERVICIOS: "Gestión de Servicios - Mansión Real",
};
