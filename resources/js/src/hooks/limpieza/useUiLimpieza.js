import { useDispatch, useSelector } from "react-redux";
import { rtkAbrirModalLimpieza } from "../../store/limpieza/uiLimpiezaSlice";

export const useUiLimpieza = () => {
    const { abrirModalLimpieza } = useSelector((state) => state.uiLimpieza);

    const dispatch = useDispatch();

    const fnAbrirModalLimpieza = (estado) => {
        dispatch(rtkAbrirModalLimpieza(estado));
    };

    return {
        abrirModalLimpieza,

        fnAbrirModalLimpieza,
    };
};
