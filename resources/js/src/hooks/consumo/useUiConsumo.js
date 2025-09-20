import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerConsumosDepartamento,
    rtkAbrirModalConsumo,
} from "../../store/consumo/uiConsumoSlice";

export const useUiConsumo = () => {
    const { abrirModalConsumo, abrirDrawerConsumosDepartamento } = useSelector(
        (state) => state.uiConsumo
    );
    const dispatch = useDispatch();

    const fnAbrirModalConsumo = (abrir) => {
        dispatch(rtkAbrirModalConsumo(abrir));
    };

    const fnAbrirDrawerConsumosDepartamento = (abrir) => {
        dispatch(rtkAbrirDrawerConsumosDepartamento(abrir));
    };

    return {
        abrirModalConsumo,
        abrirDrawerConsumosDepartamento,

        fnAbrirModalConsumo,
        fnAbrirDrawerConsumosDepartamento,
    };
};
