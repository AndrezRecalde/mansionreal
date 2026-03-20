import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargando,
    rtkCargarCuentas,
    rtkAgregarCuenta,
    rtkCargarCuentaActiva,
    rtkLimpiarCuentaActiva,
    rtkCargarErrores,
    rtkCargarMensaje,
} from "../../store/ventaMostrador/ventaMostradorSlice";
import apiAxios from "../../api/apiAxios";
import Swal from "sweetalert2";

export const useVentaMostradorStore = () => {
    const {
        cargando,
        cuentas,
        cuentaActiva,
        mensaje,
        errores,
    } = useSelector((state) => state.ventaMostrador);

    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    // ─── CUENTAS DE VENTA ──────────────────────────────────────────────

    const fnCargarCuentas = async (estadoId = null) => {
        try {
            dispatch(rtkCargando(true));
            const params = estadoId ? { estado_id: estadoId } : {};
            const { data } = await apiAxios.get("/general/cuentas-ventas", { params });
            dispatch(rtkCargarCuentas(data.cuentas));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCrearCuenta = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/general/cuentas-ventas");
            dispatch(rtkAgregarCuenta(data.cuenta));
            dispatch(rtkCargarCuentaActiva(data.cuenta));
            dispatch(rtkCargarMensaje({ status: "success", msg: "Cuenta creada" }));
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 3000);
            return data.cuenta;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCargarCuentaActiva = async (id) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(`/general/cuentas-ventas/${id}`);
            dispatch(rtkCargarCuentaActiva(data.cuenta));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnSetCuentaActiva = (cuenta) => {
        dispatch(rtkCargarCuentaActiva(cuenta));
    };

    const fnLimpiarCuentaActiva = () => {
        dispatch(rtkLimpiarCuentaActiva());
    };

    // ─── CONSUMOS ──────────────────────────────────────────────────────

    const fnAgregarConsumo = async (cuentaId, item) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(`/general/cuentas-ventas/${cuentaId}/consumos`, {
                consumos: [item]
            });
            dispatch(rtkCargarCuentaActiva(data.cuenta));
            return data.cuenta;
        } catch (error) {
            const msg = error?.response?.data?.msg || "Error al agregar consumo.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnActualizarConsumo = async (cuentaId, consumoId, cantidad) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.put(`/general/cuentas-ventas/${cuentaId}/consumos/${consumoId}`, {
                cantidad
            });
            dispatch(rtkCargarCuentaActiva(data.cuenta));
        } catch (error) {
            const msg = error?.response?.data?.msg || "Error al actualizar consumo.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnEliminarConsumo = async (cuentaId, consumoId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.delete(`/general/cuentas-ventas/${cuentaId}/consumos/${consumoId}`);
            dispatch(rtkCargarCuentaActiva(data.cuenta));
        } catch (error) {
            const msg = error?.response?.data?.msg || "Error al eliminar consumo.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    // ─── PAGOS ─────────────────────────────────────────────────────────

    const fnRegistrarPago = async (cuentaId, pago) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(`/general/cuentas-ventas/${cuentaId}/pagos`, pago);
            dispatch(rtkCargarCuentaActiva(data.cuenta));
            dispatch(rtkCargarMensaje({ status: "success", msg: "Pago registrado exitosamente" }));
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 3000);
            return data.cuenta;
        } catch (error) {
            const msg = error?.response?.data?.msg || "Error al registrar el pago.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    // ─── CIERRE Y FACTURACIÓN ──────────────────────────────────────────

    const fnGenerarFactura = async ({ consumoIds, clienteFacturacionId, observaciones, solicitaFacturaDetallada = false }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/general/facturas/generar-externa", {
                consumo_ids: consumoIds,
                cliente_facturacion_id: clienteFacturacionId,
                observaciones: observaciones || null,
                solicita_factura_detallada: solicitaFacturaDetallada,
            });
            dispatch(rtkCargarMensaje({ status: "success", msg: "Factura generada correctamente" }));
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 3000);
            return data.factura;
        } catch (error) {
            const msg = error?.response?.data?.msg || "Error al generar la factura.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCerrarCuenta = async (cuentaId, facturaId = null) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(`/general/cuentas-ventas/${cuentaId}/cerrar`, {
                factura_id: facturaId
            });
            dispatch(rtkCargarCuentaActiva(data.cuenta));
            dispatch(rtkCargarMensaje({ status: "success", msg: "Cuenta cerrada correctamente" }));
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 3000);
            return data.cuenta;
        } catch (error) {
            const msg = error?.response?.data?.msg || "Error al cerrar la cuenta.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnDescargarFacturaPDF = async (facturaId) => {
        try {
            dispatch(rtkCargando(true));
            const response = await apiAxios.get(
                `/general/facturas/${facturaId}/pdf`,
                { responseType: "blob" }
            );
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
        cuentas,
        cuentaActiva,
        mensaje,
        errores,

        fnCargarCuentas,
        fnCrearCuenta,
        fnCargarCuentaActiva,
        fnSetCuentaActiva,
        fnLimpiarCuentaActiva,

        fnAgregarConsumo,
        fnActualizarConsumo,
        fnEliminarConsumo,

        fnRegistrarPago,
        
        fnGenerarFactura,
        fnCerrarCuenta,
        fnDescargarFacturaPDF,
    };
};
