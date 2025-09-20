import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkAsignarReserva,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarReservas,
    rtkLimpiarReservas,
} from "../../store/reserva/reservaSlice";
import apiAxios from "../../api/apiAxios";
import { useDepartamentoStore } from "../departamento/useDepartamentoStore";

export const useReservaDepartamentoStore = () => {
    const { cargando, reservas, activarReserva, mensaje, errores } =
        useSelector((state) => state.reserva);
    const { fnConsultarDisponibilidadDepartamentos } = useDepartamentoStore();
    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnAgregarReserva = async (reserva) => {
        try {
            if (reserva.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/reserva/${reserva.id}`,
                    reserva
                );
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                fnConsultarDisponibilidadDepartamentos();
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/reserva/nueva",
                reserva
            );
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            fnConsultarDisponibilidadDepartamentos();
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCambiarEstadoReserva = async ({ id, nombre_estado }) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/reserva/${id}/estado`,
                { nombre_estado }
            );
            // Recargar datos y mostrar mensaje
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            fnConsultarDisponibilidadDepartamentos();
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnEliminarReserva = async (reserva) => {
        try {
            const { data } = await apiAxios.delete(
                `/gerencia/reserva/${reserva.id}`
            );
            // Recargar datos y mostrar mensaje
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCargarReporteDepartamentosPorFechas = async ({
        fecha_inicio = null,
        fecha_fin = null,
        anio
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/gerencia/reporte-departamentos",
                {
                    fecha_inicio,
                    fecha_fin,
                    anio
                }
            );
            const { result } = data;
            dispatch(rtkCargarReservas(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnBuscarReservas = async ({
        fecha_inicio = null,
        fecha_fin = null,
        codigo_reserva = null,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/reservas/buscar", {
                fecha_inicio,
                fecha_fin,
                codigo_reserva,
            });
            const { reservas } = data;
            dispatch(rtkCargarReservas(reservas));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAsignarReserva = (reserva) => {
        dispatch(rtkAsignarReserva(reserva));
    }

    const fnLimpiarReservas = () => {
        dispatch(rtkLimpiarReservas());
    };

    return {
        cargando,
        reservas,
        activarReserva,
        mensaje,
        errores,

        fnAgregarReserva,
        fnCambiarEstadoReserva,
        fnEliminarReserva,
        fnCargarReporteDepartamentosPorFechas,
        fnBuscarReservas,
        fnAsignarReserva,
        fnLimpiarReservas
    };
};
