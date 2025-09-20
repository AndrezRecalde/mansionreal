import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerMobile,
    rtkAbrirLinksConfiguracion,
    rtkAbrirLinksGerencia,
} from "../../store/layout/uiHeaderMenuSlice";

export const useUiHeaderMenu = () => {
    const { abrirDrawerMobile, abrirLinksConfiguracion, abrirLinksGerencia } =
        useSelector((state) => state.uiHeaderMenu);
    const dispatch = useDispatch();

    const fnDrawerMobile = (abrir) => {
        dispatch(rtkAbrirDrawerMobile(abrir));
    };

    const fnLinksConfiguracion = (abrir) => {
        dispatch(rtkAbrirLinksConfiguracion(abrir));
    };

    const fnLinksGerencia = (abrir) => {
        dispatch(rtkAbrirLinksGerencia(abrir));
    };

    return {
        // Propiedades
        abrirDrawerMobile,
        abrirLinksConfiguracion,
        abrirLinksGerencia,

        fnDrawerMobile,
        fnLinksConfiguracion,
        fnLinksGerencia,
    };
};
