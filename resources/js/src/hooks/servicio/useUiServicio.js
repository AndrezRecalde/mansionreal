import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalActivarServicio,
    rtkAbrirModalServicio,
} from "../../store/servicio/uiServicioSlice";

export const useUiServicio = () => {
    const { abrirModalServicio, abrirModalActivarServicio } = useSelector(
        (state) => state.uiServicio
    );
    const dispatch = useDispatch();

    const fnModalAbrirServicio = (abrir) => {
        dispatch(rtkAbrirModalServicio(abrir));
    };

    const fnModalAbrirActivarServicio = (abrir) => {
        dispatch(rtkAbrirModalActivarServicio(abrir));
    };

    return {
        abrirModalServicio,
        abrirModalActivarServicio,

        fnModalAbrirServicio,
        fnModalAbrirActivarServicio
    };
};
