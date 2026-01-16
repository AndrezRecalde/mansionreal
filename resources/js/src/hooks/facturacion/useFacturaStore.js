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
    rtkLimpiarFactura,
    rtkLimpiarFacturas,
} from "../../store/facturacion/facturaSlice";
import apiAxios from "../../api/apiAxios";

export const useFacturaStore = () => {
    const {
        cargando,
        cargandoPDF,
        facturas,
        factura,
        activarFactura,
        consumosAgrupados,
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
            dispatch(rtkCargarFacturas(data.facturas.data || data.facturas));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener detalle completo de una factura
     */
    const fnCargarFactura = async (facturaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(`/facturas/${facturaId}`);
            dispatch(rtkCargarFactura(data.factura));
            if (data.consumos_agrupados) {
                dispatch(rtkCargarConsumosAgrupados(data.consumos_agrupados));
            }
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Generar factura para una reserva
     */
    const fnGenerarFactura = async (datosFactura) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/facturas/generar",
                datosFactura
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
                { motivo_anulacion: motivo }
            );

            dispatch(rtkActualizarFactura(data.factura));
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
     * Verificar si una reserva puede generar factura
     */
    const fnVerificarPuedeFacturar = async (reservaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/facturas/verificar-reserva/${reservaId}`
            );
            return data;
        } catch (error) {
            ExceptionMessageError(error);
            return { puede_facturar: false, motivos: ["Error al verificar"] };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener factura de una reserva
     */
    const fnCargarFacturaPorReserva = async (reservaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/facturas/reserva/${reservaId}`
            );

            if (data.factura) {
                dispatch(rtkCargarFactura(data.factura));
            }

            return data.factura;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Recalcular totales de una factura
     */
    const fnRecalcularTotales = async (facturaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/facturas/${facturaId}/recalcular-totales`
            );

            dispatch(rtkActualizarFactura(data.factura));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.factura;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
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

            // Crear URL del blob
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            // Abrir en nueva pestaña
            window.open(url, "_blank");

            // Limpiar URL después de un tiempo
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoPDF(false));
        }
    };

    /**
     * Obtener estadísticas de facturación
     */
    const fnCargarEstadisticas = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/facturas/estadisticas", {
                params: filtros,
            });
            dispatch(rtkCargarEstadisticas(data.estadisticas));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Reporte de IVA para SRI
     */
    const fnCargarReporteIVA = async (mes, anio) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/facturas/reporte-iva", {
                mes,
                anio,
            });
            dispatch(rtkCargarReporteIVA(data.reporte));
            return data.reporte;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Reporte de facturas por cliente
     */
    const fnCargarReportePorCliente = async (clienteId, filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/facturas/cliente/${clienteId}/reporte`,
                { params: filtros }
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
     * Activar factura (seleccionarla)
     */
    const fnActivarFactura = (factura) => {
        dispatch(rtkActivarFactura(factura));
    };

    /**
     * Limpiar estado
     */
    const fnLimpiarFacturas = () => {
        dispatch(rtkLimpiarFacturas());
    };

    const fnLimpiarFactura = () => {
        dispatch(rtkLimpiarFactura());
    };

    return {
        // Estado
        cargando,
        cargandoPDF,
        facturas,
        factura,
        activarFactura,
        consumosAgrupados,
        estadisticas,
        reporteIVA,
        mensaje,
        errores,

        // Métodos
        fnCargarFacturas,
        fnCargarFactura,
        fnGenerarFactura,
        fnAnularFactura,
        fnVerificarPuedeFacturar,
        fnCargarFacturaPorReserva,
        fnRecalcularTotales,
        fnDescargarFacturaPDF,
        fnCargarEstadisticas,
        fnCargarReporteIVA,
        fnCargarReportePorCliente,
        fnActivarFactura,
        fnLimpiarFacturas,
        fnLimpiarFactura,
    };
};
