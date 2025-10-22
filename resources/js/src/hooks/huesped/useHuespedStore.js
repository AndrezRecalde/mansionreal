import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarHuesped,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarHuespedes,
    rtkCargarMensaje,
    rtkCargarPaginacion,
    rtkLimpiarHuespedes,
} from "../../store/huesped/huespedSlice";
import apiAxios from "../../api/apiAxios";

export const useHuespedStore = () => {
    const {
        cargando,
        huespedes,
        paginacion,
        activarHuesped,
        mensaje,
        errores,
    } = useSelector((state) => state.huesped);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarHuespedes = async ({ page = 1, per_page = 20 } = {}) => {
        try {
            dispatch(rtkCargando(true));

            const { data } = await apiAxios.get("/huespedes", {
                params: { page, per_page },
            });
            const { huespedes, paginacion } = data;
            dispatch(rtkCargarHuespedes(huespedes));
            dispatch(rtkCargarPaginacion(paginacion));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAgregarHuesped = async (huesped) => {
        try {
            if (huesped.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/huesped/${huesped.id}`,
                    huesped
                );
                fnCargarHuespedes({
                    page: paginacion.pagina_actual,
                    per_page: paginacion.por_pagina,
                });
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post("/gerencia/huesped", huesped);
            fnCargarHuespedes({
                page: paginacion.pagina_actual,
                per_page: paginacion.por_pagina,
            });
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnBuscarHuespedPorDni = async (dni) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/huesped/buscar", {
                dni,
            });
            const { huesped } = data;
            dispatch(rtkActivarHuesped(huesped));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAsignarHuesped = (huesped) => {
        dispatch(rtkActivarHuesped(huesped));
    };

    const fnLimpiarHuespedes = () => {
        dispatch(rtkLimpiarHuespedes());
    };

    return {
        cargando,
        huespedes,
        paginacion,
        activarHuesped,
        mensaje,
        errores,

        fnCargarHuespedes,
        fnAgregarHuesped,
        fnBuscarHuespedPorDni,
        fnAsignarHuesped,
        fnLimpiarHuespedes,
    };
};
