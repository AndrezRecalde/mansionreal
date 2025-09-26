import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkAsignarEstadia,
    rtkCargando,
    rtkCargandoPDFReporte,
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

    const fnCargarReporteEstadiasPorFechas = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/reporte-estadias", {
                p_fecha_inicio,
                p_fecha_fin,
                p_anio,
            });
            const { result } = data;
            dispatch(rtkCargarEstadias(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnExportarConsumosEstadiasPDF = async ({
        p_fecha_inicio,
        p_fecha_fin,
        p_anio,
    }) => {
        try {
            dispatch(rtkCargandoPDFReporte(true));
            const response = await apiAxios.post(
                "/gerencia/reporte-estadias-pdf",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                },
                {
                    responseType: "blob",
                }
            );
            // Crear un enlace para descargar el PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "consumos_estadias.pdf"); // Nombre del archivo a descargar
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoPDFReporte(true));
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
        fnCargarReporteEstadiasPorFechas,
        fnExportarConsumosEstadiasPDF,
        fnAsignarEstadia,
        fnLimpiarEstadias,
    };
};
