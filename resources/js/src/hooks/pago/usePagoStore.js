import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarPago,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarPagos,
    rtkCargarTotalesPagos,
    rtkLimpiarPagos,
} from "../../store/pago/pagoSlice";
import apiAxios from "../../api/apiAxios";

export const usePagoStore = () => {
    const { cargando, pagos, totalesPagos, activarPago, mensaje, errores } =
        useSelector((state) => state.pago);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarPagos = async ({ reserva_id }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/pagos", {
                reserva_id,
            });
            const { pagos } = data;
            dispatch(rtkCargarPagos(pagos));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAgregarPago = async (pago) => {
        try {
            if (pago.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/pago/${pago.id}`,
                    pago
                );
                fnCargarPagos({ reserva_id: pago.reserva_id });
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                `/gerencia/reserva/${pago.reserva_id}/pago`,
                pago
            );
            fnCargarPagos({ reserva_id: pago.reserva_id });
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnEliminarPago = async (pago) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.delete(`/gerencia/pago/${pago.id}`);
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCargarTotalesPorReserva = async ({ reserva_id }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/totales-pagos", {
                reserva_id,
            });
            const { result } = data;
            dispatch(rtkCargarTotalesPagos(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAsignarPago = (pago) => {
        dispatch(rtkActivarPago(pago));
    };

    const fnLimpiarPago = () => {
        dispatch(rtkLimpiarPagos());
    };

    return {
        cargando,
        pagos,
        totalesPagos,
        activarPago,
        mensaje,
        errores,

        fnCargarPagos,
        fnAgregarPago,
        fnEliminarPago,
        fnCargarTotalesPorReserva,
        fnAsignarPago,
        fnLimpiarPago,
    };
};
