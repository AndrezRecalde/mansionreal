import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarConsumo,
    rtkCargando,
    rtkCargandoPDFReporte,
    rtkCargarConsumos,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarReporteConsumosCategoria,
    rtkLimpiarConsumos,
} from "../../store/consumo/consumoSlice";
import apiAxios from "../../api/apiAxios";

export const useConsumoStore = () => {
    const {
        cargando,
        cargandoPDFReporte,
        consumos,
        reporteConsumosCategoria,
        activarConsumo,
        mensaje,
        errores,
    } = useSelector((state) => state.consumo);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarConsumos = async ({ reserva_id }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/general/consumo-reserva", {
                reserva_id,
            });
            const { consumos } = data;
            dispatch(rtkCargarConsumos(consumos));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCargarReporteConsumosCategoria = async (filtros) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/general/reporte-consumos",
                filtros
            );
            const { reporteData } = data;
            dispatch(rtkCargarReporteConsumosCategoria(reporteData));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnExportarReporteConsumosPDF = async ({
        p_fecha_inicio,
        p_fecha_fin,
        p_anio,
    }) => {
        try {
            dispatch(rtkCargandoPDFReporte(true));

            const payload = {};

            if (p_fecha_inicio && p_fecha_fin) {
                payload.p_fecha_inicio = p_fecha_inicio;
                payload.p_fecha_fin = p_fecha_fin;
            } else if (p_anio) {
                payload.p_anio = p_anio;
            }

            const response = await apiAxios.post(
                "/general/consumos/categoria/pdf",
                payload,
                {
                    responseType: "blob",
                }
            );

            // Crear blob y descargar
            const pdfBlob = new Blob([response.data], {
                type: "application/pdf",
            });
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;

            const nombreArchivo =
                p_fecha_inicio && p_fecha_fin
                    ? `reporte_consumos_${p_fecha_inicio}_${p_fecha_fin}.pdf`
                    : `reporte_consumos_${
                          p_anio || new Date().getFullYear()
                      }.pdf`;

            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            dispatch(
                rtkCargarMensaje({
                    status: "success",
                    msg: "PDF descargado exitosamente",
                })
            );
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            dispatch(rtkCargandoPDFReporte(false));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoPDFReporte(false));
        }
    };

    const fnAgregarConsumo = async (consumo) => {
        try {
            if (consumo.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/general/consumo/${consumo.id}`,
                    consumo
                );
                fnCargarConsumos({ reserva_id: consumo.reserva_id });
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post("/general/consumo", consumo);
            fnCargarConsumos({ reserva_id: consumo.reserva_id });
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnEliminarConsumo = async (consumo) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.delete(
                `/general/consumo/${consumo.id}`, {
                    data: {
                        dni: consumo.dni,
                    },
                }
            );
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            await fnCargarConsumos({ reserva_id: consumo.reserva_id });
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarConsumo = (consumo) => {
        dispatch(rtkActivarConsumo(consumo));
    };

    const fnLimpiarConsumos = () => {
        dispatch(rtkLimpiarConsumos());
    };

    return {
        cargando,
        cargandoPDFReporte,
        consumos,
        reporteConsumosCategoria,
        activarConsumo,
        mensaje,
        errores,

        fnCargarConsumos,
        fnCargarReporteConsumosCategoria,
        fnExportarReporteConsumosPDF,
        fnAgregarConsumo,
        fnEliminarConsumo,
        fnAsignarConsumo,
        fnLimpiarConsumos,
    };
};
