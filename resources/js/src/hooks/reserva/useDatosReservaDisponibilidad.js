import { useMemo } from "react";

/**
 * Hook para construir datos de reserva desde departamento o estadía
 * Versión específica para la página de disponibilidad
 * @param {Object} activarDepartamento - Departamento activo con reserva
 * @param {Object} activarEstadia - Estadía activa
 * @returns {Object|null} Datos formateados de la reserva
 */
export const useDatosReservaDisponibilidad = (
    activarDepartamento,
    activarEstadia
) => {
    console.log(activarEstadia);
    console.log(activarDepartamento);
    return useMemo(() => {
        if (activarDepartamento?.reserva) {
            return {
                departamento_id: activarDepartamento.id,
                tipo_departamento: activarDepartamento.tipo_departamento,
                numero_departamento: activarDepartamento.numero_departamento,
                codigo_reserva: activarDepartamento.reserva.codigo_reserva,
                reserva_id: activarDepartamento.reserva.id,
                huesped_id: activarDepartamento.reserva.huesped_id,
                huesped: activarDepartamento.reserva.huesped,
                fecha_checkin: activarDepartamento.reserva.fecha_checkin,
                fecha_checkout: activarDepartamento.reserva.fecha_checkout,
                total_noches: activarDepartamento.reserva.total_noches,
                estado: activarDepartamento.reserva.estado,
            };
        }

        if (activarEstadia) {
            return {
                codigo_reserva: activarEstadia.codigo_reserva,
                reserva_id: activarEstadia.id,
                huesped_id: activarEstadia.huesped_id,
                huesped: activarEstadia.huesped,
                fecha_checkin: activarEstadia.fecha_checkin,
                fecha_checkout: activarEstadia.fecha_checkout,
                total_noches: activarEstadia.total_noches,
                estado: activarEstadia.estado,
            };
        }

        return null;
    }, [activarDepartamento, activarEstadia]);
};
