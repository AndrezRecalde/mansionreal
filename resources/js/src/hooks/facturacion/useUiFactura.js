import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerFacturacion,
    rtkAbrirModalAnularFactura,
    rtkAbrirModalGenerarFactura,
    rtkAbrirModalVerFactura,
} from "../../store/facturacion/uiFacturaSlice";

export const useUiFactura = () => {
    const {
        abrirModalGenerarFactura,
        abrirModalVerFactura,
        abrirModalAnularFactura,
        abrirDrawerFacturacion,
    } = useSelector((state) => state.uiFactura);

    const dispatch = useDispatch();

    const fnAbrirModalGenerarFactura = (abrir) => {
        dispatch(rtkAbrirModalGenerarFactura(abrir));
    };

    const fnAbrirModalVerFactura = (abrir) => {
        dispatch(rtkAbrirModalVerFactura(abrir));
    };

    const fnAbrirModalAnularFactura = (abrir) => {
        dispatch(rtkAbrirModalAnularFactura(abrir));
    };

    const fnAbrirDrawerFacturacion = (abrir) => {
        dispatch(rtkAbrirDrawerFacturacion(abrir));
    };

    return {
        abrirModalGenerarFactura,
        abrirModalVerFactura,
        abrirModalAnularFactura,
        abrirDrawerFacturacion,

        fnAbrirModalGenerarFactura,
        fnAbrirModalVerFactura,
        fnAbrirModalAnularFactura,
        fnAbrirDrawerFacturacion,
    };
};
