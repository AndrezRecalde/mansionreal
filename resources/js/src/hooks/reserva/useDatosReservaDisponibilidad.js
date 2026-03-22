import { useMemo } from "react";

/**
 * Hook para construir datos de reserva desde un departamento activo (solo HOSPEDAJE)
 * @param {Object} activarDepartamento - Departamento activo con reserva
 * @returns {Object|null} Datos formateados de la reserva
 */
export const useDatosReservaDisponibilidad = (activarDepartamento) => {
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

        return null;
    }, [activarDepartamento]);
};
