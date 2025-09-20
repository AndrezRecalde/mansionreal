import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargarErrores,
    rtkCargandoHuespedesRecurrentes,
    rtkHuespedesRecurrentesCargados,
    rtkLimpiarHuespedesRecurrentes,
    rtkCargandoTotalHuespedes,
    rtkTotalHuespedesCargados,
    rtkLimpiarTotalHuespedes,
} from "../../store/dashboard/dashHuespedesSlice";
import apiAxios from "../../api/apiAxios";

export const useDashHuespedStore = () => {
    const {
        cargandoHuespedesRecurrentes,
        cargandoTotalHuedespes,
        huespedesRecurrentes,
        totalHuespedes,
        errores,
    } = useSelector((state) => state.dashHuesped);
    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    /* Zona de Huespedes Recurrentes */
    const fnCargarHuespedesRecurrentes = async ({
        fecha_inicio,
        fecha_fin,
        anio,
    }) => {
        try {
            dispatch(rtkCargandoHuespedesRecurrentes(true));
            const { data } = await apiAxios.post(
                "/gerencia/huespedes-recurrentes",
                {
                    fecha_inicio,
                    fecha_fin,
                    anio,
                }
            );
            const { result } = data;
            dispatch(rtkHuespedesRecurrentesCargados(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarHuespedesRecurrentes = () => {
        dispatch(rtkLimpiarHuespedesRecurrentes());
    };

    /* Zona de Huespedes Totalaes */
    const fnCargarTotalHuespedes = async ({
        fecha_inicio,
        fecha_fin,
        anio,
    }) => {
        try {
            dispatch(rtkCargandoTotalHuespedes(true));
            const { data } = await apiAxios.post(
                "/gerencia/total-huespedes-alojados",
                {
                    fecha_inicio,
                    fecha_fin,
                    anio,
                }
            );
            const { result } = data;
            dispatch(rtkTotalHuespedesCargados(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarTotalHuespedes = () => {
        dispatch(rtkLimpiarTotalHuespedes());
    };

    return {
        cargandoHuespedesRecurrentes,
        cargandoTotalHuedespes,
        huespedesRecurrentes,
        totalHuespedes,
        errores,

        // Huespedes Recurrentes
        fnCargarHuespedesRecurrentes,
        fnLimpiarHuespedesRecurrentes,

        // Huespedes Totales
        fnCargarTotalHuespedes,
        fnLimpiarTotalHuespedes,
    };
};
