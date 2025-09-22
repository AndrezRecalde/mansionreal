// Configuración centralizada de acciones de departamento

import {
    IconBookmarksFilled,
    IconRosetteDiscountCheckFilled,
    IconSettingsShare,
    IconSpray,
    IconCash,
} from "@tabler/icons-react";

export const accionesDepartamento = {
    LIMPIEZA: {
        label: "Limpiar",
        icon: IconSpray,
        color: "orange",
        swal: {
            icon: "info",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en realizar <strong>limpieza</strong> en el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "LIMPIEZA",
        },
    },
    MANTENIMIENTO: {
        label: "Mantenimiento",
        icon: IconSettingsShare,
        color: "gray",
        swal: {
            icon: "question",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en realizar <strong>mantenimiento</strong> en el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "MANTENIMIENTO",
        },
    },
    RESERVA: {
        label: "Reservar",
        icon: IconBookmarksFilled,
        color: "indigo",
        swal: {
            icon: "info",
            title: "Reservar Departamento",
            getHtml: (d) =>
                `¿Confirmas en <strong>reservar</strong> el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "OCUPADO",
        },
    },
    PAGADO: {
        label: "Finalizar Reserva",
        icon: IconCash,
        color: "teal",
        swal: {
            icon: "question",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en <strong>finalizar</strong> la reserva del <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "PAGADO",
        },
    },
    CANCELADO: {
        label: "Cancelar Reserva",
        icon: IconRosetteDiscountCheckFilled,
        color: "red",
        swal: {
            icon: "warning",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en <strong>cancelar</strong> la reserva del <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "CANCELADO",
        },
    },
    DISPONIBLE: {
        label: "Volver Disponible",
        icon: IconRosetteDiscountCheckFilled,
        color: "teal",
        swal: {
            icon: "question",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en volver a <strong>disponible</strong> el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "DISPONIBLE",
        },
    },
};
// (Pega aquí la definición que ya tienes, puedes exportar cada uno si prefieres)
