import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargando,
    rtkCargarConceptosPagos,
    rtkCargarErrores,
    rtkLimpiarConceptosPagos,
} from "../../store/pago/conceptoPagoSlice";
import apiAxios from "../../api/apiAxios";

export const useConceptoPagoStore = () => {
    const { cargando, conceptosPagos } = useSelector(
        (state) => state.conceptoPago
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarConceptosPagos = async ({ activo = 1 }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/general/conceptos-pagos", {
                activo,
            });
            const { conceptos_pagos } = data;
            dispatch(rtkCargarConceptosPagos(conceptos_pagos));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarConceptosPagos = () => {
        dispatch(rtkLimpiarConceptosPagos());
    };

    return {
        cargando,
        conceptosPagos,

        fnCargarConceptosPagos,
        fnLimpiarConceptosPagos
    };
};
