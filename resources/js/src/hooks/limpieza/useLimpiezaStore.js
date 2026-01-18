import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarLimpieza,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarLimpiezas,
    rtkCargarMensaje,
    rtkCargarPaginacion,
    rtkGuardarUltimosFiltros,
    rtkLimpiarLimpiezas,
} from "../../store/limpieza/limpiezaSlice";
import apiAxios from "../../api/apiAxios";

export const useLimpiezaStore = () => {
    const {
        cargando,
        limpiezas,
        paginacion,
        ultimosFiltros,
        activarLimpieza,
        mensaje,
        errores,
    } = useSelector((state) => state.limpieza);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarLimpiezas = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio = null,
        page = 1,
        per_page = 20,
    } = {}) => {
        try {
            dispatch(rtkCargando(true));
            const params = {
                page,
                per_page,
            };

            if (p_fecha_inicio) params.p_fecha_inicio = p_fecha_inicio;
            if (p_fecha_fin) params.p_fecha_fin = p_fecha_fin;
            if (p_anio) params.p_anio = p_anio;

            const { data } = await apiAxios.get("/gerencia/limpieza/buscar", {
                params,
            });

            const { limpiezas, paginacion } = data;
            dispatch(rtkCargarLimpiezas(limpiezas));
            dispatch(rtkCargarPaginacion(paginacion));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAgregarLimpieza = async (limpieza) => {
        try {
            if (limpieza.id) {
                dispatch(rtkCargando(true));
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/limpieza/${limpieza.id}`,
                    limpieza,
                );

                if (
                    ultimosFiltros?.p_fecha_inicio ||
                    ultimosFiltros?.p_fecha_fin ||
                    ultimosFiltros?.p_anio
                ) {
                    await fnCargarLimpiezas(ultimosFiltros);
                }

                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }

            //creando
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/gerencia/limpieza",
                limpieza,
            );
            if (
                ultimosFiltros?.p_fecha_inicio ||
                ultimosFiltros?.p_fecha_fin ||
                ultimosFiltros?.p_anio
            ) {
                await fnCargarLimpiezas(ultimosFiltros);
            }

            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnGuardarUltimosFiltros = (filtros) => {
        dispatch(rtkGuardarUltimosFiltros(filtros));
    };

    const fnAsignarLimpieza = (limpieza) => {
        dispatch(rtkActivarLimpieza(limpieza));
    };

    const fnLimpiarLimpiezas = () => {
        dispatch(rtkLimpiarLimpiezas());
    };

    return {
        cargando,
        limpiezas,
        paginacion,
        activarLimpieza,
        mensaje,
        errores,

        fnCargarLimpiezas,
        fnAgregarLimpieza,
        fnAsignarLimpieza,
        fnLimpiarLimpiezas,
        fnGuardarUltimosFiltros,
    };
};
