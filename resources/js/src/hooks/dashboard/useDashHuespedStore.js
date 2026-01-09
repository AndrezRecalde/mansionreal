import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargarErrores,
    rtkCargandoHuespedesRecurrentes,
    rtkHuespedesRecurrentesCargados,
    rtkLimpiarHuespedesRecurrentes,
} from "../../store/dashboard/dashHuespedesSlice";
import apiAxios from "../../api/apiAxios";

export const useDashHuespedStore = () => {
    const { cargandoHuespedesRecurrentes, huespedesRecurrentes, errores } =
        useSelector((state) => state.dashHuespedes);
    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    /* Zona de Huespedes Recurrentes */
    const fnCargarHuespedesRecurrentes = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio = null,
    }) => {
        try {
            dispatch(rtkCargandoHuespedesRecurrentes(true));
            const { data } = await apiAxios.post(
                "/gerencia/dashboard/huespedes-recurrentes",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                }
            );
            const { result } = data;
            dispatch(rtkHuespedesRecurrentesCargados(result));
        } catch (error) {
            //console.log(error);
            dispatch(rtkCargandoHuespedesRecurrentes(false));
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarHuespedesRecurrentes = () => {
        dispatch(rtkLimpiarHuespedesRecurrentes());
    };

    return {
        cargandoHuespedesRecurrentes,
        huespedesRecurrentes,
        errores,

        // Huespedes Recurrentes
        fnCargarHuespedesRecurrentes,
        fnLimpiarHuespedesRecurrentes,
    };
};
