import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargando,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarConsumosCarrito,
    rtkAgregarItemCarrito,
    rtkEliminarItemCarrito,
    rtkActualizarCantidadCarrito,
    rtkLimpiarCarrito,
    rtkCargarFactura,
    rtkCargarPagos,
} from "../../store/ventaMostrador/ventaMostradorSlice";
import apiAxios from "../../api/apiAxios";
import Swal from "sweetalert2";

export const useVentaMostradorStore = () => {
    const {
        cargando,
        carrito,
        consumosConfirmados,
        factura,
        pagos,
        mensaje,
        errores,
    } = useSelector((state) => state.ventaMostrador);

    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    // ─── CARRITO ──────────────────────────────────────────────────────

    const fnAgregarAlCarrito = (item) => {
        dispatch(rtkAgregarItemCarrito(item));
    };

    const fnEliminarDelCarrito = (inventarioId) => {
        dispatch(rtkEliminarItemCarrito(inventarioId));
    };

    const fnActualizarCantidad = (inventarioId, cantidad) => {
        dispatch(rtkActualizarCantidadCarrito({ inventarioId, cantidad }));
    };

    const fnLimpiarCarrito = () => {
        dispatch(rtkLimpiarCarrito());
    };

    // ─── CONSUMOS EXTERNOS ────────────────────────────────────────────

    /**
     * Registrar los productos del carrito como consumos externos (sin reserva).
     * Muestra el mensaje real del backend si hay error de negocio (ej. stock insuficiente).
     */
    const fnRegistrarVenta = async () => {
        try {
            dispatch(rtkCargando(true));
            const payload = {
                consumos: carrito.map((item) => ({
                    inventario_id: item.inventario_id,
                    cantidad: item.cantidad,
                })),
            };
            const { data } = await apiAxios.post(
                "/general/consumos-externos",
                payload,
            );
            dispatch(rtkCargarConsumosCarrito(data.consumos));
            dispatch(
                rtkCargarMensaje({
                    status: "success",
                    msg: data.msg || "Venta registrada correctamente",
                }),
            );
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 3000);
            return data.consumos;
        } catch (error) {
            // Mostrar el mensaje real del backend (ej. "Stock insuficiente para Coca Cola")
            const msg =
                error?.response?.data?.msg ||
                "Error al registrar la venta. Intenta nuevamente.";
            Swal.fire({ icon: "error", title: "Error en la venta", text: msg });
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    // ─── PAGOS EXTERNOS ───────────────────────────────────────────────

    /**
     * Registrar un pago externo (sin reserva).
     */
    const fnRegistrarPago = async (pago) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/general/pagos-externos",
                pago,
            );
            dispatch(rtkCargarPagos([...(pagos || []), data.pago]));
            dispatch(
                rtkCargarMensaje({
                    status: "success",
                    msg: "Pago registrado correctamente",
                }),
            );
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 3000);
            return data.pago;
        } catch (error) {
            const msg =
                error?.response?.data?.msg || "Error al registrar el pago.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Calcular totales para un conjunto de consumo IDs externos.
     */
    const fnCalcularTotales = async (consumoIds) => {
        try {
            const { data } = await apiAxios.post("/general/totales-externos", {
                consumo_ids: consumoIds,
            });
            return data.totales;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        }
    };

    // ─── FACTURACIÓN EXTERNA ──────────────────────────────────────────

    /**
     * Generar factura para consumos externos (venta de mostrador).
     */
    const fnGenerarFactura = async ({
        consumoIds,
        clienteFacturacionId,
        observaciones,
        solicitaFacturaDetallada = false,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/facturas/generar-externa", {
                consumo_ids: consumoIds,
                cliente_facturacion_id: clienteFacturacionId,
                observaciones: observaciones || null,
                solicita_factura_detallada: solicitaFacturaDetallada,
            });
            dispatch(rtkCargarFactura(data.factura));
            dispatch(
                rtkCargarMensaje({
                    status: "success",
                    msg: "Factura generada correctamente",
                }),
            );
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 3000);
            return data.factura;
        } catch (error) {
            const msg =
                error?.response?.data?.msg || "Error al generar la factura.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Descargar PDF de una factura.
     */
    const fnDescargarFacturaPDF = async (facturaId) => {
        try {
            dispatch(rtkCargando(true));
            const response = await apiAxios.get(`/facturas/${facturaId}/pdf`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" }),
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = `factura_${facturaId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    return {
        cargando,
        carrito,
        consumosConfirmados,
        factura,
        pagos,
        mensaje,
        errores,

        fnAgregarAlCarrito,
        fnEliminarDelCarrito,
        fnActualizarCantidad,
        fnLimpiarCarrito,
        fnRegistrarVenta,
        fnRegistrarPago,
        fnCalcularTotales,
        fnGenerarFactura,
        fnDescargarFacturaPDF,
    };
};
