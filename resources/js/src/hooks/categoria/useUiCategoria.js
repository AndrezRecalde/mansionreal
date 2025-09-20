import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalActivarCategoria,
    rtkAbrirModalCategoria,
} from "../../store/categoria/uiCategoriaSlice";

export const useUiCategoria = () => {
    const { abrirModalCategoria, abrirModalActivarCategoria } = useSelector(
        (state) => state.uiCategoria
    );

    const dispatch = useDispatch();

    const fnModalAbrirCategoria = (abrir) => {
        dispatch(rtkAbrirModalCategoria(abrir));
    };

    const fnModalAbrirActivarCategoria = (abrir) => {
        dispatch(rtkAbrirModalActivarCategoria(abrir));
    };

    return {
        abrirModalCategoria,
        abrirModalActivarCategoria,

        fnModalAbrirCategoria,
        fnModalAbrirActivarCategoria,
    };
};
