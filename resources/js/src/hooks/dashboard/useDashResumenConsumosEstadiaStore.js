import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargarErrores,
    rtkCargandoResumenConsumosEstadia,
    rtkResumenConsumosEstadiaCargados,
    rtkLimpiarResumenConsumosEstadia,
} from "../../store/dashboard/dashResumenConsumosEstadiaSlice";
import apiAxios from "../../api/apiAxios";

export const useDashResumenConsumosEstadiaStore = () => {
    const { cargandoResumenConsumosEstadia, resumenConsumosEstadia } =
        useSelector((state) => state.dashResumenConsumosEstadia);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarResumenConsumosEstadia = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio = null,
    }) => {
        try {
            dispatch(rtkCargandoResumenConsumosEstadia(true));
            const { data } = await apiAxios.post(
                "/gerencia/dashboard/resumen-consumos-estadia",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                }
            );
            const { result } = data;
            dispatch(rtkResumenConsumosEstadiaCargados(result));
        } catch (error) {
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarResumenConsumosEstadia = () => {
        dispatch(rtkLimpiarResumenConsumosEstadia());
    };

    return {
        cargandoResumenConsumosEstadia,
        resumenConsumosEstadia,

        // Métodos
        fnCargarResumenConsumosEstadia,
        fnLimpiarResumenConsumosEstadia,
    };
};
