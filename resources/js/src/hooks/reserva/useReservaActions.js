import { useCallback } from "react";
import {
    useReservaDepartamentoStore,
    useUiReservaDepartamento,
} from "../../hooks";

/**
 * Hook personalizado para manejar las acciones de reserva
 * Solo existe el tipo HOSPEDAJE
 * @returns {Object} Función para iniciar una reserva de hospedaje
 */
export const useReservaActions = () => {
    const { fnAsignarTipoReserva } = useReservaDepartamentoStore();
    const { fnAbrirModalReservarDepartamento } = useUiReservaDepartamento();

    const handleReservar = useCallback(() => {
        fnAsignarTipoReserva("HOSPEDAJE");
        fnAbrirModalReservarDepartamento(true);
    }, [fnAsignarTipoReserva, fnAbrirModalReservarDepartamento]);

    return {
        handleReservar,
    };
};
