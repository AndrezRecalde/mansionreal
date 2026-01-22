import { createSlice } from "@reduxjs/toolkit";

export const facturaSlice = createSlice({
    name: "factura",
    initialState: {
        cargando: false,
        cargandoPDF: false,
        facturas: [],
        paginacion: {},
        ultimosFiltros: {
            estado: null,
            cliente_id: null,
            p_fecha_inicio: null,
            p_fecha_fin: null,
            p_anio: null,
            page: 1,
            per_page: 20,
        },
        factura: null,
        facturaActual: null,
        pdfUrl: null,
        activarFactura: null,
        consumosAgrupados: {},
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
        rtkCargarFacturas: (state, { payload }) => {
            state.facturas = payload;
            state.cargando = false;
        },
        rtkCargarPaginacion: (state, { payload }) => {
            state.paginacion = payload;
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
        },
        rtkAgregarFactura: (state, { payload }) => {
            state.facturas.unshift(payload);
            state.factura = payload;
            state.cargando = false;
        },
        rtkActualizarFactura: (state, { payload }) => {
            state.facturas = state.facturas.map((factura) =>
                factura.id === payload.id ? payload : factura
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
            state.paginacion = {};
            state.ultimosFiltros = {
                estado: null,
                cliente_id: null,
                p_fecha_inicio: null,
                p_fecha_fin: null,
                p_anio: null,
                page: 1,
                per_page: 20,
            };
            state.facturaActual = null;
            state.pdfUrl = null;
            state.activarFactura = null;
            state.consumosAgrupados = {};
            state.estadisticas = null;
            state.reporteIVA = null;
            state.mensaje = undefined;
            state.errores = undefined;
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
    rtkCargarFacturas,
    rtkCargarPaginacion,
    rtkGuardarUltimosFiltros,
    rtkCargarFactura,
    rtkCargarConsumosAgrupados,
    rtkAgregarFactura,
    rtkActualizarFactura,
    rtkActivarFactura,
    rtkCargarEstadisticas,
    rtkCargarReporteIVA,
    rtkSetPdfUrl,
    rtkSetFacturaActual,
    rtkLimpiarFacturas,
    rtkCargarMensaje,
    rtkCargarErrores,
} = facturaSlice.actions;
