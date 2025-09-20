import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirEliminarModalGasto,
    rtkAbrirModalGasto,
} from "../../store/gasto/uiGastoSlice";

export const useUiGasto = () => {
    const { abrirModalGasto, abrirEliminarModalGasto } = useSelector(
        (state) => state.uiGasto
    );

    const dispatch = useDispatch();

    const fnAbrirModalGasto = (abrir) => {
        dispatch(rtkAbrirModalGasto(abrir));
    };

    const fnAbrirEliminarModalGasto = (abrir) => {
        dispatch(rtkAbrirEliminarModalGasto(abrir));
    };

    return {
        abrirModalGasto,
        abrirEliminarModalGasto,

        fnAbrirModalGasto,
        fnAbrirEliminarModalGasto
    };
};
