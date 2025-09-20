import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalActivarProductoInventario,
    rtkAbrirModalInventario,
} from "../../store/inventario/uiInventarioSlice";

export const useUiInventario = () => {
    const { abrirModalInventario, abrirModalActivarProductoInventario } =
        useSelector((state) => state.uiInventario);

    const dispatch = useDispatch();

    const fnModalInventario = (abrir) => {
        dispatch(rtkAbrirModalInventario(abrir));
    };

    const fnModalAbrirActivarInventario = (abrir) => {
        dispatch(rtkAbrirModalActivarProductoInventario(abrir));
    };

    return {
        abrirModalInventario,
        abrirModalActivarProductoInventario,

        fnModalInventario,
        fnModalAbrirActivarInventario
    };
};
