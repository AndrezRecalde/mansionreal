import { createSlice } from "@reduxjs/toolkit";

export const facturaSlice = createSlice({
    name: "factura",
    initialState: {
        cargando: false,
        cargandoPDF: false,
        cargandoDetalle: false,
        facturas: [],
        ultimosFiltros: {
            estado: null,
            cliente_id: null,
            p_fecha_inicio: null,
            p_fecha_fin: null,
            p_anio: null,
        },
        factura: null,
        facturaActual: null,
        pdfUrl: null,
        activarFactura: null,
        consumosAgrupados: {},
        // ✅ NUEVO: Estado para resumen de descuentos
        resumenDescuentos: null,
        estadisticas: null,
        reporteIVA: null,
        mensaje: undefined,
        errores: undefined,
    },
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargandoPDF: (state, { payload }) => {
            state.cargandoPDF = payload;
        },
        rtkCargandoDetalle: (state, { payload }) => {
            state.cargandoDetalle = payload;
        },
        rtkCargarFacturas: (state, { payload }) => {
            state.facturas = payload;
            state.cargando = false;
        },
        rtkGuardarUltimosFiltros: (state, { payload }) => {
            state.ultimosFiltros = payload;
        },
        rtkCargarFactura: (state, { payload }) => {
            state.factura = payload;
            state.cargando = false;
        },
        rtkCargarConsumosAgrupados: (state, { payload }) => {
            state.consumosAgrupados = payload;
            state.cargandoDetalle = false;
        },
        // ✅ NUEVO: Cargar resumen de descuentos de la factura
        rtkCargarResumenDescuentos: (state, { payload }) => {
            state.resumenDescuentos = payload;
        },
        rtkAgregarFactura: (state, { payload }) => {
            state.facturas.unshift(payload);
            state.factura = payload;
            state.cargando = false;
        },
        rtkActualizarFactura: (state, { payload }) => {
            state.facturas = state.facturas.map((factura) =>
                factura.id === payload.id ? payload : factura,
            );
            state.factura = payload;
            state.cargando = false;
        },
        rtkActivarFactura: (state, { payload }) => {
            state.activarFactura = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkCargarEstadisticas: (state, { payload }) => {
            state.estadisticas = payload;
            state.cargando = false;
        },
        rtkCargarReporteIVA: (state, { payload }) => {
            state.reporteIVA = payload;
            state.cargando = false;
        },
        rtkSetPdfUrl: (state, { payload }) => {
            state.pdfUrl = payload;
        },
        rtkSetFacturaActual: (state, { payload }) => {
            state.facturaActual = payload;
        },
        rtkLimpiarFacturas: (state) => {
            state.facturas = [];
            state.factura = null;
            state.ultimosFiltros = {
                estado: null,
                cliente_id: null,
                p_fecha_inicio: null,
                p_fecha_fin: null,
                p_anio: null,
            };
            state.facturaActual = null;
            state.pdfUrl = null;
            state.activarFactura = null;
            state.consumosAgrupados = {};
            state.resumenDescuentos = null; // ✅ NUEVO
            state.estadisticas = null;
            state.reporteIVA = null;
            state.cargando = false;
            state.cargandoPDF = false;
            state.cargandoDetalle = false;
            state.mensaje = undefined;
            state.errores = undefined;
        },
        // ✅ NUEVO: Limpiar solo el resumen de descuentos
        rtkLimpiarResumenDescuentos: (state) => {
            state.resumenDescuentos = null;
        },
        rtkCargarMensaje: (state, { payload }) => {
            state.mensaje = payload;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
        },
    },
});

export const {
    rtkCargando,
    rtkCargandoPDF,
    rtkCargandoDetalle,
    rtkCargarFacturas,
    rtkGuardarUltimosFiltros,
    rtkCargarFactura,
    rtkCargarConsumosAgrupados,
    rtkCargarResumenDescuentos, // ✅ NUEVO
    rtkAgregarFactura,
    rtkActualizarFactura,
    rtkActivarFactura,
    rtkCargarEstadisticas,
    rtkCargarReporteIVA,
    rtkSetPdfUrl,
    rtkSetFacturaActual,
    rtkLimpiarFacturas,
    rtkLimpiarResumenDescuentos, // ✅ NUEVO
    rtkCargarMensaje,
    rtkCargarErrores,
} = facturaSlice.actions;
