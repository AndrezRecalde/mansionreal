import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalInformacionReserva,
    rtkAbrirModalReservaFinalizar,
    rtkAbrirModalReservarDepartamento,
} from "../../store/reserva/uiReservaSlice";

export const useUiReservaDepartamento = () => {
    const {
        abrirModalReservarDepartamento,
        abrirModalReservaFinalizar,
        abrirModalInformacionReserva,
    } = useSelector((state) => state.uiReserva);
    const dispatch = useDispatch();

    const fnAbrirModalReservarDepartamento = (estado) => {
        dispatch(rtkAbrirModalReservarDepartamento(estado));
    };

    const fnAbrirModalReservaFinalizar = (estado) => {
        dispatch(rtkAbrirModalReservaFinalizar(estado));
    };

    const fnAbrirModalInformacionReserva = (estado) => {
        dispatch(rtkAbrirModalInformacionReserva(estado));
    };

    return {
        abrirModalReservarDepartamento,
        abrirModalReservaFinalizar,
        abrirModalInformacionReserva,

        fnAbrirModalReservarDepartamento,
        fnAbrirModalReservaFinalizar,
        fnAbrirModalInformacionReserva,
    };
};
