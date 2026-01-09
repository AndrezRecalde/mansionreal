import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargandoGastosDanios,
    rtkCargarErrores,
    rtkGastosDaniosCargados,
    rtkLimpiarGastosDanios,
} from "../../store/dashboard/dashGastosDaniosSlice";

export const useDashGastosDaniosStore = () => {
    const { cargandoGastosDanios, gastosDanios, errores } = useSelector(
        (state) => state.dashGastosDanios
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarGastosDanios = async ({
        fecha_inicio = null,
        fecha_fin = null,
        anio = null,
    }) => {
        try {
            dispatch(rtkCargandoGastosDanios(true));
            const { data } = await apiAxios.post(
                "/gerencia/dashboard/gastos-por-danios",
                {
                    fecha_inicio,
                    fecha_fin,
                    anio,
                }
            );
            const { result } = data;
            dispatch(rtkGastosDaniosCargados(result));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarGastosDanios = () => {
        dispatch(rtkLimpiarGastosDanios());
    };

    return {
        cargandoGastosDanios,
        gastosDanios,
        errores,

        fnCargarGastosDanios,
        fnLimpiarGastosDanios,
    };
};
