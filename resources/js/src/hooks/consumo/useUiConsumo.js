import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerConsumosDepartamento,
    rtkAbrirModalConsumo,
    rtkAbrirModalEditarConsumo,
    rtkAbrirModalEliminarConsumo,
    rtkAbrirModalAplicarDescuento, // ✅ NUEVO
    rtkAbrirModalDescuentoMasivo, // ✅ NUEVO
} from "../../store/consumo/uiConsumoSlice";

export const useUiConsumo = () => {
    const {
        abrirModalConsumo,
        abrirDrawerConsumosDepartamento,
        abrirModalEditarConsumo,
        abrirModalEliminarConsumo,
        abrirModalAplicarDescuento, // ✅ NUEVO
        abrirModalDescuentoMasivo, // ✅ NUEVO
    } = useSelector((state) => state.uiConsumo);

    const dispatch = useDispatch();

    const fnAbrirModalConsumo = (abrir) => {
        dispatch(rtkAbrirModalConsumo(abrir));
    };

    const fnAbrirDrawerConsumosDepartamento = (abrir) => {
        dispatch(rtkAbrirDrawerConsumosDepartamento(abrir));
    };

    const fnAbrirModalEditarConsumo = (abrir) => {
        dispatch(rtkAbrirModalEditarConsumo(abrir));
    };

    const fnAbrirModalEliminarConsumo = (abrir) => {
        dispatch(rtkAbrirModalEliminarConsumo(abrir));
    };

    // ✅ NUEVAS funciones para descuentos
    const fnAbrirModalAplicarDescuento = (abrir) => {
        dispatch(rtkAbrirModalAplicarDescuento(abrir));
    };

    const fnAbrirModalDescuentoMasivo = (abrir) => {
        dispatch(rtkAbrirModalDescuentoMasivo(abrir));
    };

    return {
        abrirModalConsumo,
        abrirDrawerConsumosDepartamento,
        abrirModalEditarConsumo,
        abrirModalEliminarConsumo,
        abrirModalAplicarDescuento, // ✅ NUEVO
        abrirModalDescuentoMasivo, // ✅ NUEVO

        fnAbrirModalConsumo,
        fnAbrirDrawerConsumosDepartamento,
        fnAbrirModalEditarConsumo,
        fnAbrirModalEliminarConsumo,
        fnAbrirModalAplicarDescuento, // ✅ NUEVO
        fnAbrirModalDescuentoMasivo, // ✅ NUEVO
    };
};
