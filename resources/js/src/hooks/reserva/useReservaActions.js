import { useCallback } from "react";
import {
    useReservaDepartamentoStore,
    useUiReservaDepartamento,
} from "../../hooks";

/**
 * Hook personalizado para manejar las acciones de reserva
 * @returns {Object} Funciones para manejar reservas y estadías
 */
export const useReservaActions = () => {
    const { fnAsignarTipoReserva } = useReservaDepartamentoStore();
    const { fnAbrirModalReservarDepartamento } = useUiReservaDepartamento();

    const handleReservar = useCallback(() => {
        fnAsignarTipoReserva("HOSPEDAJE");
        fnAbrirModalReservarDepartamento(true);
    }, [fnAsignarTipoReserva, fnAbrirModalReservarDepartamento]);

    const handleEstadia = useCallback(() => {
        fnAsignarTipoReserva("ESTADIA");
        fnAbrirModalReservarDepartamento(true);
    }, [fnAsignarTipoReserva, fnAbrirModalReservarDepartamento]);

    return {
        handleReservar,
        handleEstadia,
    };
};
