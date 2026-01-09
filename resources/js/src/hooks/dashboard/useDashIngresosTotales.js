import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargandoIngresosTotales,
    rtkCargarErrores,
    rtkLimpiarIngresosTotales,
} from "../../store/dashboard/dashIngresosTotalesSlice";
import apiAxios from "../../api/apiAxios";

export const useDashIngresosTotales = () => {
    const { cargandoIngresosTotales, ingresosTotales, errores } = useSelector(
        (state) => state.dashIngresosTotales
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarIngresosTotales = async ({
        fecha_inicio,
        fecha_fin,
        anio,
    }) => {
        try {
            dispatch(rtkCargandoIngresosTotales(true));
            const { data } = await apiAxios.post(
                "/dashboard/ingresos-totales",
                {
                    fecha_inicio,
                    fecha_fin,
                    anio,
                }
            );
            const { result } = data;
            dispatch(rtkIngresosTotalesCargados(result));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarIngresosTotales = () => {
        dispatch(rtkLimpiarIngresosTotales());
    };

    return {
        cargandoIngresosTotales,
        ingresosTotales,
        errores,

        fnCargarIngresosTotales,
        fnLimpiarIngresosTotales,
    };
};
