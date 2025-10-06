import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalEditarRegistroPago,
    rtkAbrirModalEliminarRegistroPago,
    rtkAbrirModalRegistroPago,
} from "../../store/pago/uiPagoSlice";

export const useUiPago = () => {
    const {
        abrirModalRegistroPago,
        abrirModalEditarRegistroPago,
        abrirModalEliminarRegistroPago,
    } = useSelector((state) => state.uiPago);
    const dispatch = useDispatch();

    const fnAbrirModalRegistroPago = (abrir) => {
        dispatch(rtkAbrirModalRegistroPago(abrir));
    };

    const fnAbrirModalEditarRegistroPago = (abrir) => {
        dispatch(rtkAbrirModalEditarRegistroPago(abrir));
    };

    const fnAbrirModalEliminarRegistroPago = (abrir) => {
        dispatch(rtkAbrirModalEliminarRegistroPago(abrir));
    };

    return {
        abrirModalRegistroPago,
        abrirModalEditarRegistroPago,
        abrirModalEliminarRegistroPago,

        fnAbrirModalRegistroPago,
        fnAbrirModalEditarRegistroPago,
        fnAbrirModalEliminarRegistroPago,
    };
};
