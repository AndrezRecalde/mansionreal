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
                consumo.id === payload.id ? payload : consumo,
            );
            state.cargando = false;
        },
        // ✅ NUEVO: Actualizar múltiples consumos (útil para aplicar descuentos masivos)
        rtkActualizarConsumos: (state, { payload }) => {
            state.consumos = state.consumos.map((consumo) => {
                const actualizado = payload.find((c) => c.id === consumo.id);
                return actualizado || consumo;
            });
            state.cargando = false;
        },
        rtkActivarConsumo: (state, { payload }) => {
            state.activarConsumo = payload;
            state.cargando = false;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        // ✅ NUEVO: Eliminar consumo de la lista
        rtkEliminarConsumo: (state, { payload }) => {
            state.consumos = state.consumos.filter(
                (consumo) => consumo.id !== payload,
            );
            state.cargando = false;
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
    rtkActualizarConsumos, // ✅ NUEVO
    rtkActivarConsumo,
    rtkEliminarConsumo, // ✅ NUEVO
    rtkLimpiarConsumos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = consumoSlice.actions;
