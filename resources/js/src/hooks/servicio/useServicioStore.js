import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarServicio,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarServicios,
    rtkLimpiarServicios,
} from "../../store/servicio/servicioSlice";
import apiAxios from "../../api/apiAxios";

export const useServicioStore = () => {
    const { cargando, servicios, activarServicio, mensaje, errores } =
        useSelector((state) => state.servicio);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarServicios = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/gerencia/servicios");
            const { servicios } = data;
            dispatch(rtkCargarServicios(servicios));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCargarServiciosAgrupados = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                "/gerencia/servicios-agrupados"
            );
            const { servicios } = data;
            dispatch(rtkCargarServicios(servicios));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAgregarServicio = async (servicio) => {
        try {
            if (servicio.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/servicio/${servicio.id}`,
                    servicio
                );
                fnCargarServicios();
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/servicio",
                servicio
            );
            fnCargarServicios();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarServicio = (servicio) => {
        dispatch(rtkActivarServicio(servicio));
    };

    const fnLimpiarServicios = () => {
        dispatch(rtkLimpiarServicios());
    };

    return {
        cargando,
        servicios,
        activarServicio,
        mensaje,
        errores,

        //Metodos
        fnCargarServicios,
        fnCargarServiciosAgrupados,
        fnAgregarServicio,
        fnAsignarServicio,
        fnLimpiarServicios,
    };
};
