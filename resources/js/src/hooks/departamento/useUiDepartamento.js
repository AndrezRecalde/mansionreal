import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerServiciosDepartamento,
    rtkAbrirModalActivarDepartamento,
    rtkAbrirModalActivarTipoDepartamento,
    rtkAbrirModalDepartamento,
    rtkAbrirModalTipoDepartamento,
} from "../../store/departamento/uiDepartamentoSlice";

export const useUiDepartamento = () => {
    const {
        abrirModalDepartamento,
        abrirModalActivarDepartamento,
        abrirDrawerServiciosDepartamento,
        abrirModalTipoDepartamento,
        abrirModalActivarTipoDepartamento,
    } = useSelector((state) => state.uiDepartamento);

    const dispatch = useDispatch();

    const fnModalAbrirDepartamento = (abrir) => {
        dispatch(rtkAbrirModalDepartamento(abrir));
    };

    const fnModalAbrirTipoDepartamento = (abrir) => {
        dispatch(rtkAbrirModalTipoDepartamento(abrir));
    };

    const fnModalAbrirActivarDepartamento = (abrir) => {
        dispatch(rtkAbrirModalActivarDepartamento(abrir));
    };

    const fnModalAbrirActivarTipoDepartamento = (abrir) => {
        dispatch(rtkAbrirModalActivarTipoDepartamento(abrir));
    };

    const fnDrawerAbrirServiciosDepartamento = (abrir) => {
        dispatch(rtkAbrirDrawerServiciosDepartamento(abrir));
    }

    return {
        abrirModalDepartamento,
        abrirModalActivarDepartamento,
        abrirDrawerServiciosDepartamento,
        abrirModalTipoDepartamento,
        abrirModalActivarTipoDepartamento,

        fnModalAbrirDepartamento,
        fnModalAbrirTipoDepartamento,
        fnModalAbrirActivarDepartamento,
        fnModalAbrirActivarTipoDepartamento,
        fnDrawerAbrirServiciosDepartamento
    };
};
