import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarConsumo,
    rtkActualizarConsumo,
    rtkActualizarConsumos, // ✅ NUEVO
    rtkCargando,
    rtkCargandoPDFReporte,
    rtkCargarConsumos,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarReporteConsumosCategoria,
    rtkEliminarConsumo, // ✅ NUEVO
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

    /**
     * Cargar consumos de una reserva
     */
    const fnCargarConsumos = async ({ reserva_id }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/general/consumo-reserva", {
                params: { reserva_id },
            });
            const { consumos } = data;
            dispatch(rtkCargarConsumos(consumos));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Cargar reporte de consumos por categoría
     */
    const fnCargarReporteConsumosCategoria = async (filtros) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/general/reporte-consumos",
                filtros,
            );
            const { reporteData } = data;
            dispatch(rtkCargarReporteConsumosCategoria(reporteData));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Exportar reporte de consumos a PDF
     */
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
                },
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
                }),
            );
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoPDFReporte(false));
        }
    };

    /**
     * Agregar o actualizar consumo
     */
    const fnAgregarConsumo = async (consumo) => {
        try {
            if (consumo.id) {
                // Actualizando
                const { data } = await apiAxios.put(
                    `/general/consumo/${consumo.id}`,
                    consumo,
                );
                fnCargarConsumos({ reserva_id: consumo.reserva_id });
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            // Creando
            const { data } = await apiAxios.post("/general/consumo", consumo);
            fnCargarConsumos({ reserva_id: consumo.reserva_id });
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            ExceptionMessageError(error);
        }
    };

    /**
     * Eliminar consumo
     */
    const fnEliminarConsumo = async (consumo) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.delete(
                `/general/consumo/${consumo.id}`,
                {
                    data: {
                        dni: consumo.dni,
                    },
                },
            );
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            await fnCargarConsumos({ reserva_id: consumo.reserva_id });
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * ✅ NUEVO: Aplicar descuento a un consumo
     */
    const fnAplicarDescuentoConsumo = async (consumoId, datosDescuento) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/general/consumo/${consumoId}/aplicar-descuento`,
                datosDescuento,
            );

            // Actualizar el consumo en el estado
            dispatch(rtkActualizarConsumo(data.consumo));

            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);
            //console.log(data.consumo);
            return data.consumo;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * ✅ NUEVO: Eliminar descuento de un consumo
     */
    const fnEliminarDescuentoConsumo = async (consumoId, reservaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.delete(
                `/general/consumo/${consumoId}/eliminar-descuento`,
            );

            // Actualizar el consumo en el estado
            dispatch(rtkActualizarConsumo(data.consumo));

            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.consumo;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * ✅ NUEVO: Aplicar descuentos masivos a múltiples consumos
     */
    const fnAplicarDescuentosMasivos = async (descuentos) => {
        try {
            dispatch(rtkCargando(true));

            const promesas = descuentos.map(({ consumoId, datosDescuento }) =>
                apiAxios.post(
                    `/general/consumo/${consumoId}/aplicar-descuento`,
                    datosDescuento,
                ),
            );

            const resultados = await Promise.all(promesas);
            const consumosActualizados = resultados.map((r) => r.data.consumo);

            // Actualizar múltiples consumos en el estado
            dispatch(rtkActualizarConsumos(consumosActualizados));

            dispatch(
                rtkCargarMensaje({
                    status: "success",
                    msg: `Se aplicaron descuentos a ${consumosActualizados.length} consumos`,
                }),
            );
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return consumosActualizados;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Activar/seleccionar consumo
     */
    const fnAsignarConsumo = (consumo) => {
        dispatch(rtkActivarConsumo(consumo));
    };

    /**
     * Limpiar consumos del estado
     */
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
        // ✅ NUEVAS funciones para descuentos
        fnAplicarDescuentoConsumo,
        fnEliminarDescuentoConsumo,
        fnAplicarDescuentosMasivos,
    };
};
