import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalReservaFinalizar,
    rtkAbrirModalReservarDepartamento,
} from "../../store/reserva/uiReservaSlice";

export const useUiReservaDepartamento = () => {
    const { abrirModalReservarDepartamento, abrirModalReservaFinalizar } =
        useSelector((state) => state.uiReserva);
    const dispatch = useDispatch();

    const fnAbrirModalReservarDepartamento = (estado) => {
        dispatch(rtkAbrirModalReservarDepartamento(estado));
    };

    const fnAbrirModalReservaFinalizar = (estado) => {
        dispatch(rtkAbrirModalReservaFinalizar(estado));
    };

    return {
        abrirModalReservarDepartamento,
        abrirModalReservaFinalizar,

        fnAbrirModalReservarDepartamento,
        fnAbrirModalReservaFinalizar
    };
};
