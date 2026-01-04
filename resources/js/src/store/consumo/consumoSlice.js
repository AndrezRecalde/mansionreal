import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    cargandoPDFReporte: false,
    consumos: [],
    reporteConsumosCategoria: null,
    activarConsumo: false,
    mensaje: undefined,
    errores: undefined,
};

export const consumoSlice = createSlice({
    name: "consumo",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargandoPDFReporte: (state, { payload }) => {
            state.cargandoPDFReporte = payload;
        },
        rtkCargarConsumos: (state, { payload }) => {
            state.consumos = payload;
            state.cargando = false;
        },
        rtkCargarReporteConsumosCategoria: (state, { payload }) => {
            state.reporteConsumosCategoria = payload;
            state.cargando = false;
        },
        rtkAgregarConsumo: (state, { payload }) => {
            state.consumos.push(payload);
            state.cargando = false;
        },
        rtkActualizarConsumo: (state, { payload }) => {
            state.consumos = state.consumos.map((consumo) =>
                consumo.id === payload.id ? payload : consumo
            );
            state.cargando = false;
        },
        rtkActivarConsumo: (state, { payload }) => {
            state.activarConsumo = payload;
            state.cargando = false;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarConsumos: (state) => {
            state.consumos = [];
            state.reporteConsumosCategoria = null;
            state.cargando = false;
            state.cargandoPDFReporte = false;
            state.activarConsumo = false;
            state.errores = undefined;
            state.mensaje = undefined;
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
    rtkCargandoPDFReporte,
    rtkCargarConsumos,
    rtkCargarReporteConsumosCategoria,
    rtkAgregarConsumo,
    rtkActualizarConsumo,
    rtkActivarConsumo,
    rtkLimpiarConsumos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = consumoSlice.actions;
