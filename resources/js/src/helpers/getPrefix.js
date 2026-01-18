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

export const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

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
        },
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

    /* ** CAMBIO DE CONTRASEÑA ** */
    CAMBIO_CONTRASENA: {
        TITLE: "Cambiar Contraseña - Mansión Real",
        TITLE_PAGE: "Cambiar Contraseña",
        DESCRIPCION_PAGE: "Ingresa tu nueva contraseña y verificala.",
        INPUTS: {
            LABEL_NUEVA_CONTRASENA: "Digita tu nueva contraseña",
            LABEL_CONFIRMAR_CONTRASENA: "Confirma tu nueva contraseña",
        },
        BUTTONS: {
            REGRESAR_PERFIL: "Regresar a mi perfil",
            CAMBIAR_CONTRASENA: "Cambiar contraseña",
        },
        NAVEGACIONES: {
            REGRESAR_PERFIL: "/staff/perfil",
        },
    },

    /* ** DASHBOARD ** */
    DASHBOARD: {
        TITLE: "Dashboard - Mansión Real",
        TITLE_PAGE: "Panel Administrativo",

        CHART_HUESPEDES_GANANCIAS: {
            TITLE: "Huéspedes y Ganancias Mensuales",
            SUBTITLE: "Análisis comparativo de ocupación e ingresos",
            Y_AXIS_HUESPEDES: "Total de Huéspedes",
            Y_AXIS_GANANCIAS: "Total de Ganancias (USD)",
            SERIES: {
                HUESPEDES: "Huéspedes",
                COLOR_HUESPEDES: "#102A56",
                GANANCIAS: "Ganancias (USD)",
                COLOR_GANANCIAS: "#25B475",
            }
        },

        CHART_INGRESOS_DEPARTAMENTO: {
            TITLE: "Ingresos por Departamento",
            SUBTITLE: "Distribución de ingresos por tipo de departamento",
            X_AXIS: "Tipo de Departamento",
            Y_AXIS: "Ingresos (USD)",
            SERIES: {
                INGRESOS: "Ingresos (USD)",
            }
        },

        CHART_ESTADIAS: {
            TITLE: "Resumen de Estadías",
            SUBTITLE: "Métricas principales del período",
            categories: [
                "Total Estadías",
                "Subtotal Consumos",
                "IVA Recaudado",
                "Total Consumos",
                "Total Huéspedes",
            ],
            Y_AXIS: "Valores",
            SERIES: {
                ESTADIAS: "Estadías",
            }
        },

        CHART_PRODUCTOS: {
            TITLE: "Consumo por Producto",
            SUBTITLE: "Distribución de ventas por categoría",
            NAME_SERIES: "Consumos"
        },

        TABLE_RANKING_HUESPEDES: {
            TITLE: "Ranking de Huéspedes por Consumo",
            SUBTITLE: "Top 10 huéspedes con mayor gasto",
            COLUMNS: {
                NOMBRE_HUESPED: "Nombre del Huésped",
                CEDULA: "No. de Cédula",
                TOTAL_RESERVAS: "Total de Reservas",
            }
        },

    },

    /* CALENDARIO RESERVAS */
    CALENDARIO_RESERVAS: {
        TITLE: "Calendario de Reservas - Mansión Real",
        TITLE_PAGE: "Calendario de Disponibilidad",
        DESCRIPCION_PAGE: "Gestiona las reservas y estadías de tus huéspedes de manera eficiente.",
        KPI_OCUPACION: {
            TITLE: "Tasa de Ocupación",

        },
        TABS: {
            RESERVAS: "Reservas",
            ESTADIAS: "Estadías"
        },
        BUTTONS: {
            CREAR_NUEVO: "Crear nuevo"
        }

    },



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
