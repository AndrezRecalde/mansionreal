import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import apiAxios from "../../api/apiAxios";
import {
    rtkCargando,
    rtkCargarHistorial,
    rtkLimpiarHistorial,
    rtkCargarMensaje,
    rtkCargarErrores,
    rtkActualizarCuenta,
} from "../../store/ventaMostrador/historialCuentasVentaSlice";

export const useHistorialCuentasVenta = () => {
    const dispatch = useDispatch();
    const { cargando, historialCuentas, errores } = useSelector(
        (state) => state.historialCuentasVenta,
    );

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarHistorialCuentas = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/general/cuentas-ventas-historial",
                filtros,
            );
            dispatch(rtkCargarHistorial(data.cuentas || []));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnLimpiarHistorialCuentas = () => {
        dispatch(rtkLimpiarHistorial());
    };

    const fnAnularFacturaCuenta = async (cuentaId, motivo) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/general/cuentas-ventas/${cuentaId}/anular-factura`,
                { motivo_anulacion: motivo },
            );
            dispatch(rtkActualizarCuenta(data.cuenta));
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);
            return data.cuenta;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    return {
        cargando,
        historialCuentas,
        errores,

        fnCargarHistorialCuentas,
        fnLimpiarHistorialCuentas,
        fnAnularFacturaCuenta,
    };
};

