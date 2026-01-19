import { useMemo } from "react";

/**
 * Hook personalizado para construir el objeto de datos de reserva
 * @param {Object} activarReserva - Datos de la reserva activa
 * @param {Object} activarEstadia - Datos de la estadía activa
 * @returns {Object|null} Objeto con los datos de la reserva o null
 */
export const useDatosReserva = (activarReserva, activarEstadia) => {
    console.log(activarEstadia);
    console.log(activarReserva);
    return useMemo(() => {
        if (activarReserva) {
            return {
                departamento_id: activarReserva.departamento_id,
                tipo_departamento: activarReserva.tipo_departamento,
                numero_departamento: activarReserva.numero_departamento,
                codigo_reserva: activarReserva.codigo_reserva,
                reserva_id: activarReserva.reserva_id,
                huesped_id: activarReserva.huesped_id,
                huesped: activarReserva.huesped,
                fecha_checkin: activarReserva.fecha_checkin,
                fecha_checkout: activarReserva.fecha_checkout,
                total_noches: activarReserva.total_noches,
                estado: activarReserva.estado,
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
    }, [activarReserva, activarEstadia]);
};
