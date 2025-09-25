import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkAsignarEstadia,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarEstadias,
    rtkCargarMensaje,
    rtkLimpiarEstadias,
} from "../../store/reserva/estadiaSlice";
import apiAxios from "../../api/apiAxios";

export const useEstadiaStore = () => {
    const {
        cargando,
        cargandoPDFNotaVenta,
        cargandoPDFReporte,
        estadias,
        activarEstadia,
        mensaje,
        errores,
    } = useSelector((state) => state.estadia);
    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarEstadias = async (fecha = null) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/estadias", {
                fecha,
            });
            const { estadias } = data;
            dispatch(rtkCargarEstadias(estadias));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAgregarEstadia = async (estadia) => {
        try {
            if (estadia.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/estadia/${estadia.id}`,
                    estadia
                );
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                fnCargarEstadias();
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/estadia/nueva",
                estadia
            );
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            fnCargarEstadias();
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarEstadia = (estadia) => {
        dispatch(rtkAsignarEstadia(estadia));
    };

    const fnLimpiarEstadias = () => {
        dispatch(rtkLimpiarEstadias());
    };

    return {
        cargando,
        cargandoPDFNotaVenta,
        cargandoPDFReporte,
        estadias,
        activarEstadia,
        mensaje,
        errores,

        fnCargarEstadias,
        fnAgregarEstadia,
        fnAsignarEstadia,
        fnLimpiarEstadias,
    };
};
