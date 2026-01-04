export function capitalizarCadaPalabra(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(" ");
}

export const formatDateStr = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const formatFechaModal = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

export const formatFechaHoraModal = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatHora = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getNombreMes = (fecha) => {
    return fecha.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
    });
};

export const getEstadoColor = (theme, estadoColor) => {
    if (theme.colors[estadoColor]) {
        return theme.colors[estadoColor][7];
    }
    return estadoColor;
};

export const formatFechaNormal = (fecha) =>
    dayjs(fecha)
        .locale("es")
        .format("DD-MMMM")
        .replace(/-./, (s) => s.toUpperCase());
