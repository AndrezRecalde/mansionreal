import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarFactura,
    rtkAgregarFactura,
    rtkActualizarFactura,
    rtkCargando,
    rtkCargandoPDF,
    rtkCargarConsumosAgrupados,
    rtkCargarErrores,
    rtkCargarEstadisticas,
    rtkCargarFactura,
    rtkCargarFacturas,
    rtkCargarMensaje,
    rtkCargarReporteIVA,
    rtkCargarResumenDescuentos,
    rtkLimpiarFacturas,
    rtkLimpiarResumenDescuentos,
    rtkSetFacturaActual,
    rtkSetPdfUrl,
    rtkCargandoDetalle,
} from "../../store/facturacion/facturaSlice";
import apiAxios from "../../api/apiAxios";

export const useFacturaStore = () => {
    const {
        cargando,
        cargandoPDF,
        facturas,
        factura,
        facturaActual,
        pdfUrl,
        activarFactura,
        consumosAgrupados,
        resumenDescuentos,
        estadisticas,
        reporteIVA,
        mensaje,
        errores,
    } = useSelector((state) => state.factura);

    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    /**
     * Listar facturas con filtros
     */
    const fnCargarFacturas = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/facturas", {
                params: filtros,
            });
            const { facturas } = data;
            dispatch(rtkCargarFacturas(facturas));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Cargar estadísticas de facturación
     */
    const fnCargarEstadisticasFacturacion = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                "/facturas/estadisticas/generales",
                {
                    params: filtros,
                },
            );
            dispatch(rtkCargarEstadisticas(data));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener detalle completo de una factura (con resumen de descuentos)
     */
    const fnCargarFactura = async (facturaId) => {
        try {
            dispatch(rtkCargandoDetalle(true));
            const { data } = await apiAxios.get(`/facturas/${facturaId}`);

            dispatch(rtkCargarFactura(data.factura));

            if (data.consumos_agrupados) {
                dispatch(rtkCargarConsumosAgrupados(data.consumos_agrupados));
            }

            // NUEVO: Cargar resumen de descuentos
            if (data.resumen_descuentos) {
                dispatch(rtkCargarResumenDescuentos(data.resumen_descuentos));
            }
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoDetalle(false));
        }
    };

    /**
     * Generar factura (con descuentos en consumos)
     */
    const fnGenerarFactura = async (datosFactura) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/facturas/generar",
                datosFactura,
            );

            dispatch(rtkAgregarFactura(data.factura));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.factura;
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Anular factura
     */
    const fnAnularFactura = async (facturaId, motivo) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/facturas/${facturaId}/anular`,
                { motivo_anulacion: motivo },
            );

            dispatch(rtkActualizarFactura(data.factura));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.factura;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Verificar si una reserva puede facturar
     */
    const fnVerificarPuedeFacturar = async (reservaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/facturas/verificar-reserva/${reservaId}`,
            );
            return data;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener factura por reserva
     */
    const fnCargarFacturaPorReserva = async (reservaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/facturas/reserva/${reservaId}`,
            );
            dispatch(rtkCargarFactura(data.factura));
            return data.factura;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * ✅ ACTUALIZADO: Recalcular totales desde consumos
     */
    const fnRecalcularTotales = async (facturaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/facturas/${facturaId}/recalcular-totales`,
            );

            dispatch(rtkActualizarFactura(data.factura));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.factura;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Previsualizar factura en PDF
     */
    const fnPrevisualizarFacturaPDF = async (facturaId) => {
        try {
            dispatch(rtkCargandoPDF(true));
            const response = await apiAxios.get(`/facturas/${facturaId}/pdf`, {
                responseType: "blob",
            });

            const pdfBlob = new Blob([response.data], {
                type: "application/pdf",
            });
            const url = window.URL.createObjectURL(pdfBlob);

            dispatch(rtkSetPdfUrl(url));
            return url;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargandoPDF(false));
        }
    };

    /**
     * Limpiar URL del PDF
     */
    const fnLimpiarPdfUrl = () => {
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
            dispatch(rtkSetPdfUrl(null));
        }
    };

    /**
     * Descargar factura en PDF
     */
    const fnDescargarFacturaPDF = async (facturaId) => {
        try {
            dispatch(rtkCargandoPDF(true));
            const response = await apiAxios.get(`/facturas/${facturaId}/pdf`, {
                responseType: "blob",
            });

            const pdfBlob = new Blob([response.data], {
                type: "application/pdf",
            });
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `factura_${facturaId}.pdf`;
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
            dispatch(rtkCargandoPDF(false));
        }
    };

    /**
     * Cargar estadísticas generales
     */
    const fnCargarEstadisticas = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                "/facturas/estadisticas/generales",
                {
                    params: filtros,
                },
            );
            dispatch(rtkCargarEstadisticas(data));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Cargar reporte de IVA
     */
    const fnCargarReporteIVA = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/facturas/reporte-iva", {
                params: filtros,
            });
            dispatch(rtkCargarReporteIVA(data));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Cargar reporte por cliente
     */
    const fnCargarReportePorCliente = async (clienteId, filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/facturas/reportes/cliente/${clienteId}`,
                {
                    params: filtros,
                },
            );
            return data;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Activar/seleccionar factura
     */
    const fnActivarFactura = (factura) => {
        dispatch(rtkActivarFactura(factura));
    };

    /**
     * Limpiar facturas del estado
     */
    const fnLimpiarFacturas = () => {
        dispatch(rtkLimpiarFacturas());
    };

    /**
     * ✅ NUEVO: Limpiar solo el resumen de descuentos
     */
    const fnLimpiarResumenDescuentos = () => {
        dispatch(rtkLimpiarResumenDescuentos());
    };

    return {
        // Estado
        cargando,
        cargandoPDF,
        facturas,
        factura,
        facturaActual,
        pdfUrl,
        activarFactura,
        consumosAgrupados,
        resumenDescuentos, // ✅ NUEVO
        estadisticas,
        reporteIVA,
        mensaje,
        errores,

        // Métodos
        fnCargarFacturas,
        fnCargarEstadisticasFacturacion,
        fnCargarFactura,
        fnGenerarFactura,
        fnAnularFactura,
        fnVerificarPuedeFacturar,
        fnCargarFacturaPorReserva,
        fnRecalcularTotales,
        fnPrevisualizarFacturaPDF,
        fnLimpiarPdfUrl,
        fnDescargarFacturaPDF,
        fnCargarEstadisticas,
        fnCargarReporteIVA,
        fnCargarReportePorCliente,
        fnActivarFactura,
        fnLimpiarFacturas,
        fnLimpiarResumenDescuentos, // ✅ NUEVO
    };
};
