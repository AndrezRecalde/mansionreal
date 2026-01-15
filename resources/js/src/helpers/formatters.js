import dayjs from "../config/dayjsConfig";

/**
 * Formatea fechas de manera segura usando Day.js
 * @param {string|Date|dayjs.Dayjs} fecha - Fecha a formatear
 * @param {string} formato - Formato de salida (default: 'DD/MM/YYYY')
 * @returns {string} Fecha formateada
 */
export const formatFecha = (fecha, formato = "DD/MM/YYYY") => {
    if (!fecha) return "N/A";

    const fechaDayjs = dayjs(fecha);

    // Validar que sea fecha válida
    if (!fechaDayjs.isValid()) return "N/A";

    return fechaDayjs.format(formato);
};

/**
 * Formatea fecha con hora
 * @param {string|Date|dayjs.Dayjs} fecha
 * @returns {string} Fecha con hora (ej: "15/01/2025 14:30")
 */
export const formatFechaHora = (fecha) => {
    return formatFecha(fecha, "DD/MM/YYYY HH:mm");
};

/**
 * Formatea fecha completa con día de la semana
 * @param {string|Date|dayjs. Dayjs} fecha
 * @returns {string} Fecha completa (ej: "Miércoles, 15 de Enero de 2025")
 */
export const formatFechaCompleta = (fecha) => {
    if (!fecha) return "N/A";

    const fechaDayjs = dayjs(fecha);
    if (!fechaDayjs.isValid()) return "N/A";

    return fechaDayjs.format("dddd, D [de] MMMM [de] YYYY");
};

/**
 * Formatea fecha corta
 * @param {string|Date|dayjs.Dayjs} fecha
 * @returns {string} Fecha corta (ej: "15 Ene 2025")
 */
export const formatFechaCorta = (fecha) => {
    return formatFecha(fecha, "D MMM YYYY");
};

/**
 * Formatea solo la hora
 * @param {string|Date|dayjs.Dayjs} fecha
 * @returns {string} Hora (ej: "14:30")
 */
export const formatHora = (fecha) => {
    return formatFecha(fecha, "HH:mm");
};

/**
 * Formatea fecha relativa (hace 2 días, en 3 horas, etc.)
 * @param {string|Date|dayjs. Dayjs} fecha
 * @returns {string} Fecha relativa
 */
export const formatFechaRelativa = (fecha) => {
    if (!fecha) return "N/A";

    const fechaDayjs = dayjs(fecha);
    if (!fechaDayjs.isValid()) return "N/A";

    return fechaDayjs.fromNow();
};

/**
 * Formatea fecha para inputs tipo date (YYYY-MM-DD)
 * @param {string|Date|dayjs.Dayjs} fecha
 * @returns {string}
 */
export const formatFechaInput = (fecha) => {
    return formatFecha(fecha, "YYYY-MM-DD");
};

/**
 * Formatea fecha para inputs tipo datetime-local (YYYY-MM-DDTHH:mm)
 * @param {string|Date|dayjs.Dayjs} fecha
 * @returns {string}
 */
export const formatFechaHoraInput = (fecha) => {
    return formatFecha(fecha, "YYYY-MM-DDTHH:mm");
};

/**
 * Formatea números como moneda
 * @param {number} valor
 * @param {string} moneda
 * @returns {string}
 */
export const formatMoneda = (valor, moneda = "USD") => {
    if (valor == null || isNaN(valor)) return "$0.00";

    return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: moneda,
    }).format(valor);
};

/**
 * Formatea identificación (cédula, RUC, pasaporte)
 * @param {string|number} identificacion
 * @returns {string}
 */
export const formatIdentificacion = (identificacion) => {
    if (!identificacion) return "N/A";

    const str = String(identificacion);

    // RUC (13 dígitos): 1234567890001 → 1234567890-001
    if (str.length === 13) {
        return `${str.slice(0, 10)}-${str.slice(10)}`;
    }

    // Cédula (10 dígitos): 1712345678 → 171234-5678
    if (str.length === 10) {
        return `${str.slice(0, 6)}-${str.slice(6)}`;
    }

    // Pasaporte u otro:  retornar tal cual
    return str;
};

/**
 * Calcula diferencia entre dos fechas en días
 * @param {string|Date|dayjs.Dayjs} fechaInicio
 * @param {string|Date|dayjs.Dayjs} fechaFin
 * @returns {number} Días de diferencia
 */
export const calcularDiferenciaDias = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 0;

    const inicio = dayjs(fechaInicio);
    const fin = dayjs(fechaFin);

    if (!inicio.isValid() || !fin.isValid()) return 0;

    return fin.diff(inicio, "day");
};

/**
 * Valida si una fecha está entre dos fechas
 * @param {string|Date|dayjs.Dayjs} fecha
 * @param {string|Date|dayjs.Dayjs} inicio
 * @param {string|Date|dayjs.Dayjs} fin
 * @returns {boolean}
 */
export const esFechaEntre = (fecha, inicio, fin) => {
    if (!fecha || !inicio || !fin) return false;

    const fechaDayjs = dayjs(fecha);
    const inicioDayjs = dayjs(inicio);
    const finDayjs = dayjs(fin);

    return fechaDayjs.isBetween(inicioDayjs, finDayjs, null, "[]");
};
