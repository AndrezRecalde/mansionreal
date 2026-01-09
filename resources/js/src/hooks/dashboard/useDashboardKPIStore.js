import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargando,
    rtkCargarErrores,
    rtkCargarResumenKPI,
    rtkLimpiarResumenKPI,
} from "../../store/dashboard/dashResumenKPISlice";
import apiAxios from "../../api/apiAxios";

export const useDashboardKPIStore = () => {
    const { cargando, kpis, errores } = useSelector(
        (state) => state.dashResumenKPI
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarResumenKPI = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio = null,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/gerencia/dashboard/resumen-kpi",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                }
            );
            const { result } = data;
            dispatch(rtkCargarResumenKPI(result));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarResumenKPI = () => {
        dispatch(rtkLimpiarResumenKPI());
    };

    return {
        cargando,
        kpis,
        errores,

        fnCargarResumenKPI,
        fnLimpiarResumenKPI,
    };
};
