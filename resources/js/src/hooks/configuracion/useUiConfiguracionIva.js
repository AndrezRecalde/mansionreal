import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalActivarConfiguracionIva,
    rtkAbrirModalConfiguracionIva,
} from "../../store/configuracion/uiConfiguracionIvaSlice";

export const useUiConfiguracionIva = () => {
    const { abrirModalConfiguracionIva, abrirModalActivarConfiguracionIva } =
        useSelector((state) => state.uiConfiguracionIva);

    const dispatch = useDispatch();

    const fnModalAbrirConfiguracionIva = (abrir) => {
        dispatch(rtkAbrirModalConfiguracionIva(abrir));
    };

    const fnModalAbrirActivarConfiguracionIva = (abrir) => {
        dispatch(rtkAbrirModalActivarConfiguracionIva(abrir));
    };

    return {
        abrirModalConfiguracionIva,
        abrirModalActivarConfiguracionIva,

        fnModalAbrirConfiguracionIva,
        fnModalAbrirActivarConfiguracionIva
    };
};
