import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerConsumosDepartamento,
    rtkAbrirModalConsumo,
    rtkAbrirModalEditarConsumo,
    rtkAbrirModalEliminarConsumo,
} from "../../store/consumo/uiConsumoSlice";

export const useUiConsumo = () => {
    const {
        abrirModalConsumo,
        abrirDrawerConsumosDepartamento,
        abrirModalEditarConsumo,
        abrirModalEliminarConsumo,
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
    }

    const fnAbrirModalEliminarConsumo = (abrir) => {
        dispatch(rtkAbrirModalEliminarConsumo(abrir));
    }

    return {
        abrirModalConsumo,
        abrirDrawerConsumosDepartamento,
        abrirModalEditarConsumo,
        abrirModalEliminarConsumo,

        fnAbrirModalConsumo,
        fnAbrirDrawerConsumosDepartamento,
        fnAbrirModalEditarConsumo,
        fnAbrirModalEliminarConsumo
    };
};
