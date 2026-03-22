import { useMemo } from "react";

/**
 * Hook personalizado para construir el objeto de datos de reserva (solo HOSPEDAJE)
 * @param {Object} activarReserva - Datos de la reserva activa
 * @returns {Object|null} Objeto con los datos de la reserva o null
 */
export const useDatosReserva = (activarReserva) => {
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

        return null;
    }, [activarReserva]);
};
