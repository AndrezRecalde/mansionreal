import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalActivarProductoInventario,
    rtkAbrirModalAgregarStock,
    rtkAbrirModalInventario,
} from "../../store/inventario/uiInventarioSlice";

export const useUiInventario = () => {
    const {
        abrirModalInventario,
        abrirModalActivarProductoInventario,
        abrirModalAgregarStock,
    } = useSelector((state) => state.uiInventario);

    const dispatch = useDispatch();

    const fnModalInventario = (abrir) => {
        dispatch(rtkAbrirModalInventario(abrir));
    };

    const fnModalAbrirActivarInventario = (abrir) => {
        dispatch(rtkAbrirModalActivarProductoInventario(abrir));
    };

    const fnAbrirModalAgregarStock = (abrir) => {
        dispatch(rtkAbrirModalAgregarStock(abrir));
    };

    return {
        abrirModalInventario,
        abrirModalActivarProductoInventario,
        abrirModalAgregarStock,

        fnModalInventario,
        fnModalAbrirActivarInventario,
        fnAbrirModalAgregarStock,
    };
};
