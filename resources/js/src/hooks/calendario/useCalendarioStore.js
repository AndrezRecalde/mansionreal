import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarReserva,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarEstadisticasOcupacion,
    rtkCargarReservas,
    rtkCargarRecursosDepartamentos,
    rtkLimpiarReservas,
} from "../../store/calendario/calendarioSlice";
import apiAxios from "../../api/apiAxios";

export const useCalendarioStore = () => {
    const {
        cargando,
        reservas,
        activarReserva,
        mensaje,
        errores,
        recursosDepartamentos,
        estadisticasOcupacion,
    } = useSelector((state) => state.calendario);

    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarReservasCalendario = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                "/general/calendario/reservas",
                {
                    params: filtros,
                }
            );
            const { eventos } = data;

            dispatch(rtkCargarReservas(eventos));
        } catch (error) {
            //console.error("Error al cargar reservas:", error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCargarRecursosDepartamentos = async () => {
        try {
            const { data } = await apiAxios.get(
                "/general/calendario/recursos-departamentos"
            );
            const { recursos } = data;
            dispatch(rtkCargarRecursosDepartamentos(recursos));
        } catch (error) {
            //console.error("Error al cargar recursos:", error);
            ExceptionMessageError(error);
        }
    };

    const fnCargarEstadisticasOcupacion = async (filtros = {}) => {
        try {
            const { data } = await apiAxios.get(
                "/general/calendario/estadisticas-ocupacion",
                {
                    params: filtros,
                }
            );

            dispatch(rtkCargarEstadisticasOcupacion(data));
        } catch (error) {
            //console.error("Error al cargar estadisticas:", error);
            ExceptionMessageError(error);
        }
    };

    const fnCargarDatosCalendario = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));

            // Cargar reservas primero
            const { data: dataEventos } = await apiAxios.get(
                "/general/calendario/reservas",
                {
                    params: filtros,
                }
            );

            const { eventos } = dataEventos;

            dispatch(rtkCargarReservas(eventos));

            // Luego cargar recursos
            const { data: recursosData } = await apiAxios.get(
                "/general/calendario/recursos-departamentos"
            );

            const { recursos } = recursosData;

            dispatch(
                rtkCargarRecursosDepartamentos(recursos)
            );
        } catch (error) {
            //console.error("Error al cargar datos del calendario:", error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAsignarReserva = (reserva) => {
        dispatch(rtkActivarReserva(reserva));
    };

    const fnLimpiarReservasCalendario = () => {
        dispatch(rtkLimpiarReservas());
    };

    return {
        cargando,
        reservas,
        activarReserva,
        mensaje,
        errores,
        recursosDepartamentos,
        estadisticasOcupacion,
        fnCargarReservasCalendario,
        fnCargarRecursosDepartamentos,
        fnCargarEstadisticasOcupacion,
        fnCargarDatosCalendario,
        fnAsignarReserva,
        fnLimpiarReservasCalendario,
    };
};
