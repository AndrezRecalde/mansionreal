import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerMobile,
    rtkAbrirLinksConfiguracion,
    rtkAbrirLinksGerencia,
    rtkAbrirLinksInventario,
    rtkAbrirLinksFacturas,
} from "../../store/layout/uiHeaderMenuSlice";

export const useUiHeaderMenu = () => {
    const { abrirDrawerMobile, abrirLinksConfiguracion, abrirLinksGerencia, abrirLinksInventario, abrirLinksFacturas } =
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

    const fnLinksInventario = (abrir) => {
        dispatch(rtkAbrirLinksInventario(abrir));
    };

    const fnLinksFacturas = (abrir) => {
        dispatch(rtkAbrirLinksFacturas(abrir));
    };

    return {
        // Propiedades
        abrirDrawerMobile,
        abrirLinksConfiguracion,
        abrirLinksGerencia,
        abrirLinksInventario,
        abrirLinksFacturas,

        fnDrawerMobile,
        fnLinksConfiguracion,
        fnLinksGerencia,
        fnLinksInventario,
        fnLinksFacturas,
    };
};
