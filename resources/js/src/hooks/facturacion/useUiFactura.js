import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirDrawerFacturacion,
    rtkAbrirModalAnularFactura,
    rtkAbrirModalGenerarFactura,
    rtkAbrirModalVerFactura,
    rtkAbrirModalDetalleFactura,
    rtkAbrirModalPdfFactura,
} from "../../store/facturacion/uiFacturaSlice";

export const useUiFactura = () => {
    const {
        // Estados existentes
        abrirModalGenerarFactura,
        abrirModalVerFactura,
        abrirModalAnularFactura,
        abrirDrawerFacturacion,

        // ✅ NUEVOS: Estados para gestión de facturas
        abrirModalDetalleFactura,
        abrirModalPdfFactura,
    } = useSelector((state) => state.uiFactura);

    const dispatch = useDispatch();

    // Funciones existentes
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

    // ✅ NUEVAS: Funciones para gestión de facturas
    const fnAbrirModalDetalleFactura = (abrir) => {
        dispatch(rtkAbrirModalDetalleFactura(abrir));
    };

    const fnAbrirModalPdfFactura = (abrir) => {
        dispatch(rtkAbrirModalPdfFactura(abrir));
    };

    return {
        // Estados existentes
        abrirModalGenerarFactura,
        abrirModalVerFactura,
        abrirModalAnularFactura,
        abrirDrawerFacturacion,

        // ✅ NUEVOS: Estados para gestión de facturas
        abrirModalDetalleFactura,
        abrirModalPdfFactura,

        // Funciones existentes
        fnAbrirModalGenerarFactura,
        fnAbrirModalVerFactura,
        fnAbrirModalAnularFactura,
        fnAbrirDrawerFacturacion,

        // ✅ NUEVAS: Funciones para gestión de facturas
        fnAbrirModalDetalleFactura,
        fnAbrirModalPdfFactura,
    };
};
