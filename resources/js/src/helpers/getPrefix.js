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
            },
        },

        CHART_INGRESOS_DEPARTAMENTO: {
            TITLE: "Ingresos por Departamento",
            SUBTITLE: "Distribución de ingresos por tipo de departamento",
            X_AXIS: "Tipo de Departamento",
            Y_AXIS: "Ingresos (USD)",
            SERIES: {
                INGRESOS: "Ingresos (USD)",
            },
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
            },
        },

        CHART_PRODUCTOS: {
            TITLE: "Consumo por Producto",
            SUBTITLE: "Distribución de ventas por categoría",
            NAME_SERIES: "Consumos",
        },

        TABLE_RANKING_HUESPEDES: {
            TITLE: "Ranking de Huéspedes por Consumo",
            SUBTITLE: "Top 10 huéspedes con mayor gasto",
            COLUMNS: {
                NOMBRE_HUESPED: "Nombre del Huésped",
                CEDULA: "No. de Cédula",
                TOTAL_RESERVAS: "Total de Reservas",
            },
        },
    },

    /* CALENDARIO RESERVAS */
    CALENDARIO_RESERVAS: {
        TITLE: "Calendario de Reservas - Mansión Real",
        TITLE_PAGE: "Calendario de Disponibilidad",
        DESCRIPCION_PAGE:
            "Gestiona las reservas y estadías de tus huéspedes de manera eficiente.",
        KPI_OCUPACION: {
            TITLE: "Tasa de Ocupación",
        },
        TABS: {
            RESERVAS: "Reservas",
            ESTADIAS: "Estadías",
        },
        BUTTONS: {
            CREAR_NUEVO: "Crear nuevo",
        },
    },

    HUESPEDES: {
        TITLE: "Gestión de Huéspedes - Mansión Real",
        TITLE_PAGE: "Gestión de Huéspedes",
        BUTTONS: {
            NUEVO_HUESPED: "Nuevo Huésped",
        },

        CAMPOS_TABLA: {
            NOMBRES_COMPLETOS: "Nombres Completos",
            CEDULA: "Cédula",
            TELEFONO: "Teléfono",
            EMAIL: "Correo",
            SIN_DATOS: "SIN DATOS",
        },

        CAMPOS_MODAL: {
            TITULO_MODAL: "Huésped",
            CAMPOS_FORMULARIO: {
                LABEL_CEDULA: "Número de Cédula",
                LABEL_APELLIDOS: "Apellidos",
                LABEL_NOMBRES: "Nombres",
                LABEL_TELEFONO: "Teléfono",
                LABEL_EMAIL: "Correo Electrónico",
                BUTTON: "Guardar Huésped",
            },
        },
    },

    REPORTE_DEPARTAMENTOS: {
        TITLE: "Reporte Reservas & Estadías - Mansión Real",
        TITLE_PAGE: "Reporte Reservas & Estadías",
    },

    REPORTE_CONSUMOS: {
        TITLE: "Reporte de Consumos - Mansión Real",
        TITLE_PAGE: "Reporte de Consumos por Categoría",
        ALERTS_SECTION: {
            ERROR_ALERT: {
                TITLE: "Error",
                COLOR: "red",
                MESSAGE: "Ocurrió un error al cargar los datos",
            },
            SUCCESS_ALERT: {
                TITLE: "Éxito",
                COLOR: "green",
                MESSAGE: "Reporte cargado correctamente",
            },
            SIN_DATOS_ALERT: {
                TITLE: "Sin datos",
                COLOR: "gray",
                MESSAGE:
                    "No hay datos para mostrar. Por favor, seleccione un rango de fechas y presione 'Buscar'.",
            },
            NOT_FOUND_ALERT: {
                TITLE: "Sin resultados",
                COLOR: "yellow",
                MESSAGE:
                    "No se encontraron consumos para el período seleccionado.",
            },
        },
        META_DATOS_SECTION: {
            PERIODO: "Período",
            GENERADO: "Generado",
            TOTAL_CATEGORIAS: "Total Categorías",
            TOTAL_PRODUCTOS: "Total Productos",
        },

        SEGMENTED_CONTROL: {
            POR_CATEGORIAS: "Por Categorías",
            VALUE_CATEGORIAS: "categorias",
            CONSOLIDADO: "Vista Consolidada",
            VALUE_CONSOLIDADO: "consolidado",
        },

        SECCIONES: {
            SECCION_CATEGORIAS: "Detalle por Categorías",
            SECCION_CONSOLIDADO: "Vista Consolidada - Todos los Productos",
        },

        CAMPOS_TABLA: {
            CATEGORIA: "Categoría",
            PRODUCTO: "Producto",
            CANTIDAD: "Cantidad",
            PRECIO_UNITARIO: "P. Unitario",
            SUBTOTAL: "Subtotal",
            IVA: "IVA",
            TOTAL: "Total",
        },

        TOTALES_GENERALES: {
            TITLE: "Totales Generales del Reporte",
            CANTIDAD_TOTAL_PRODUCTOS: {
                TITLE: "Cantidad Total de Productos",
                COLOR: "blue",
            },
            SUBTOTAL_GENERAL: {
                TITLE: "Subtotal General",
                COLOR: "cyan",
            },
            IVA_GENERAL: {
                TITLE: "IVA General",
                COLOR: "orange",
            },
            TOTAL_GENERAL: {
                TITLE: "Total General",
                COLOR: "green",
            },
        },
    },

    HISTORIAL_CONSUMOS: {
        TITLE: "Historial de Reservas - Mansión Real",
        TITLE_PAGE: "Historial de Reservas",

        CAMPOS_TABLA: {
            CODIGO_RESERVA: "Código de Reserva",
            ESTADO: "Estado",
            HUESPED: "Huésped",
            CHECKIN: "Check-in",
            CHECKOUT: "Check-out",
            DEPARTAMENTO: "Departamento",
            FACTURACION: "Facturación",
            SIN_FACTURA: "SIN FACTURA",
            TOTAL: "Total",
            VER_FACTURA: "Ver Factura",
            VOLVER_GENERAR_FACTURA: "Volver a Generar Factura",
            VER_DETALLES: "Ver Detalles",
        },
    },

    DEPARTAMENTOS: {
        TITLE: "Gestión de Departamentos - Mansión Real",
        TITLE_PAGE: "Gestión de Departamentos",
        BUTTONS: {
            NUEVO_DEPARTAMENTO: "Nuevo Departamento",
        },
        ACTIVAR_ELEMENTO: {
            TITLE: "¿Deseas activar este departamento?",
        },
        CAMPOS_MODAL : {
            TITULO_MODAL: "Departamento",
            INPUT_NUMERO_DEPARTAMENTO: {
                LABEL: "Número de Departamento",
                PLACEHOLDER: "Ingrese número de departamento",
            },
            INPUT_TIPO_DEPARTAMENTO: {
                LABEL: "Tipo de Departamento",
                PLACEHOLDER: "Ingrese tipo de departamento",
                NOTHING_FOUND: "No se encontraron tipos de departamentos",
            },
            INPUT_CAPACIDAD: {
                LABEL: "Capacidad",
                PLACEHOLDER: "Ingrese capacidad",
            },
            INPUT_IMAGENES: {
                LABEL: "Imágenes del Departamento",
                PLACEHOLDER: "Seleccione imágenes",
            },
            BUTTON_GUARDAR: "Guardar Departamento",
        }
    },

    USUARIOS: {
        TITLE: "Gestión de Usuarios - Mansión Real",
        TITLE_PAGE: "Gestión de Usuarios",
        BUTTONS: {
            NUEVO_USUARIO: "Nuevo Usuario",
        },
        CAMPOS_TABLA: {
            NOMBRES_COMPLETOS: "Nombres Completos",
            CEDULA: "Cédula",
            EMAIL: "Correo",
            ROL: "Rol",
            ACTIVO: "Activo",
        },
        CAMPOS_MODAL: {
            TITULO_MODAL: "Usuario",
            INPUT_CEDULA: {
                LABEL: "Número de Cédula",
                PLACEHOLDER: "Ingrese número de cédula",
            },
            INPUT_APELLIDOS: {
                LABEL: "Apellidos",
                PLACEHOLDER: "Ingrese apellidos",
            },
            INPUT_NOMBRES: {
                LABEL: "Nombres",
                PLACEHOLDER: "Ingrese nombres",
            },
            INPUT_EMAIL: {
                LABEL: "Correo Electrónico",
                PLACEHOLDER: "Ingrese correo electrónico",
            },
            SELECT_ROL: {
                LABEL: "Rol",
                PLACEHOLDER: "Seleccione un rol",
                NOTHING_FOUND: "No se encontraron roles",
            },
            BUTTON_GUARDAR: "Guardar Usuario",
        },
    },


    PRODUCTOS: "Gestión de Productos - Mansión Real",
    REPORTES: "Reportes - Mansión Real",
    PAGOS: "Gestión de Pagos - Mansión Real",
    FACTURAS: "Gestión de Facturas - Mansión Real",

    IVA: "Gestión de IVA - Mansión Real",
    CATEGORIAS: "Gestión de Categorías - Mansión Real",
    CONSUMOS: "Gestión de Consumos - Mansión Real",
    GASTOS: "Gestión de Gastos - Mansión Real",
    SERVICIOS: "Gestión de Servicios - Mansión Real",
};
