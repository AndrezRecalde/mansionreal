import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalCancelarReserva,
    rtkAbrirModalInformacionReserva,
    rtkAbrirModalReservaFinalizar,
    rtkAbrirModalReservarDepartamento,
} from "../../store/reserva/uiReservaSlice";

export const useUiReservaDepartamento = () => {
    const {
        abrirModalReservarDepartamento,
        abrirModalReservaFinalizar,
        abrirModalCancelarReserva,
        abrirModalInformacionReserva,
    } = useSelector((state) => state.uiReserva);
    const dispatch = useDispatch();

    const fnAbrirModalReservarDepartamento = (estado) => {
        dispatch(rtkAbrirModalReservarDepartamento(estado));
    };

    const fnAbrirModalReservaFinalizar = (estado) => {
        dispatch(rtkAbrirModalReservaFinalizar(estado));
    };

    const fnAbrirModalCancelarReserva = (estado) => {
        dispatch(rtkAbrirModalCancelarReserva(estado));
    };

    const fnAbrirModalInformacionReserva = (estado) => {
        dispatch(rtkAbrirModalInformacionReserva(estado));
    };

    return {
        abrirModalReservarDepartamento,
        abrirModalReservaFinalizar,
        abrirModalCancelarReserva,
        abrirModalInformacionReserva,

        fnAbrirModalReservarDepartamento,
        fnAbrirModalReservaFinalizar,
        fnAbrirModalCancelarReserva,
        fnAbrirModalInformacionReserva,
    };
};
