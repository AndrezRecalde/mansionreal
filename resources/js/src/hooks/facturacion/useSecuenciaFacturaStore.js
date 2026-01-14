import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarSecuencia,
    rtkAgregarSecuencia,
    rtkActualizarSecuencia,
    rtkCargando,
    rtkCargarDisponibilidad,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarSecuencia,
    rtkCargarSecuenciaActiva,
    rtkCargarSecuencias,
    rtkLimpiarSecuencia,
    rtkLimpiarSecuencias,
} from "../../store/facturacion/secuenciaFacturaSlice";
import apiAxios from "../../api/apiAxios";

export const useSecuenciaFacturaStore = () => {
    const {
        cargando,
        secuencias,
        secuencia,
        secuenciaActiva,
        activarSecuencia,
        disponibilidad,
        mensaje,
        errores,
    } = useSelector((state) => state.secuenciaFactura);

    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    /**
     * Listar todas las secuencias
     */
    const fnCargarSecuencias = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/secuencias-factura");
            dispatch(rtkCargarSecuencias(data.secuencias));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener secuencia específica
     */
    const fnCargarSecuencia = async (secuenciaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/secuencias-factura/${secuenciaId}`
            );
            dispatch(rtkCargarSecuencia(data.data.secuencia));
            return data.data;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener secuencia activa
     */
    const fnCargarSecuenciaActiva = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/secuencias-factura/activa");
            dispatch(rtkCargarSecuenciaActiva(data.secuencia));
            return data.secuencia;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Verificar disponibilidad de números
     */
    const fnVerificarDisponibilidad = async (secuenciaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/secuencias-factura/${secuenciaId}/verificar-disponibilidad`
            );
            dispatch(rtkCargarDisponibilidad(data));
            return data;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Crear nueva secuencia
     */
    const fnCrearSecuencia = async (datosSecuencia) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/secuencias-factura",
                datosSecuencia
            );

            dispatch(rtkAgregarSecuencia(data.secuencia));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.secuencia;
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Actualizar secuencia
     */
    const fnActualizarSecuencia = async (secuenciaId, datosSecuencia) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.put(
                `/secuencias-factura/${secuenciaId}`,
                datosSecuencia
            );

            dispatch(rtkActualizarSecuencia(data.secuencia));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.secuencia;
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Cambiar estado de secuencia (activar/desactivar)
     */
    const fnToggleEstadoSecuencia = async (secuenciaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.patch(
                `/secuencias-factura/${secuenciaId}/toggle-estado`
            );

            dispatch(rtkActualizarSecuencia(data.secuencia));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.secuencia;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Reiniciar secuencia (SOLO DESARROLLO/TESTING)
     */
    const fnReiniciarSecuencia = async (secuenciaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/secuencias-factura/${secuenciaId}/reiniciar`,
                { confirmacion: "REINICIAR_SECUENCIA" }
            );

            dispatch(rtkActualizarSecuencia(data.secuencia));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.secuencia;
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Activar secuencia (seleccionarla)
     */
    const fnActivarSecuencia = (secuencia) => {
        dispatch(rtkActivarSecuencia(secuencia));
    };

    /**
     * Limpiar estado
     */
    const fnLimpiarSecuencias = () => {
        dispatch(rtkLimpiarSecuencias());
    };

    const fnLimpiarSecuencia = () => {
        dispatch(rtkLimpiarSecuencia());
    };

    return {
        // Estado
        cargando,
        secuencias,
        secuencia,
        secuenciaActiva,
        activarSecuencia,
        disponibilidad,
        mensaje,
        errores,

        // Métodos
        fnCargarSecuencias,
        fnCargarSecuencia,
        fnCargarSecuenciaActiva,
        fnVerificarDisponibilidad,
        fnCrearSecuencia,
        fnActualizarSecuencia,
        fnToggleEstadoSecuencia,
        fnReiniciarSecuencia,
        fnActivarSecuencia,
        fnLimpiarSecuencias,
        fnLimpiarSecuencia,
    };
};
