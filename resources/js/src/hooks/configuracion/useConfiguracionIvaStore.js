import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarIva,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarIvas,
    rtkCargarMensaje,
    rtkLimpiarIvas,
} from "../../store/configuracion/configuracionIvaSlice";
import apiAxios from "../../api/apiAxios";

export const useConfiguracionIvaStore = () => {
    const { cargando, ivas, activarIva, mensaje, errores } = useSelector(
        (state) => state.configuracionIva
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarIvas = async ({ activo = null }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/gerencia/configuraciones-iva",
                { activo }
            );
            const { configuracionesIva } = data;
            dispatch(rtkCargarIvas(configuracionesIva));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAgregarIva = async (iva) => {
        try {
            if (iva.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/configuracion-iva/${iva.id}`,
                    iva
                );
                fnCargarIvas({});
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/configuracion-iva",
                iva
            );
            fnCargarIvas({});
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnActualizarStatusIva = async (iva) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/configuracion-iva/${iva.id}/status`,
                iva
            );
            fnCargarIvas({});
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarIva = (iva) => {
        dispatch(rtkActivarIva(iva));
    };

    const fnLimpiarIvas = () => {
        dispatch(rtkLimpiarIvas());
    };

    return {
        cargando,
        ivas,
        activarIva,
        mensaje,
        errores,

        //Metodos
        fnCargarIvas,
        fnAgregarIva,
        fnActualizarStatusIva,
        fnAsignarIva,
        fnLimpiarIvas,
    };
};
