import { createSlice } from "@reduxjs/toolkit";

export const secuenciaFacturaSlice = createSlice({
    name: "secuenciaFactura",
    initialState: {
        cargando: false,
        secuencias: [],
        secuencia: null,
        secuenciaActiva: null,
        activarSecuencia: null,
        disponibilidad: null,
        mensaje: undefined,
        errores: undefined,
    },
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarSecuencias: (state, { payload }) => {
            state.secuencias = payload;
            state.cargando = false;
        },
        rtkCargarSecuencia: (state, { payload }) => {
            state.secuencia = payload;
            state.cargando = false;
        },
        rtkCargarSecuenciaActiva: (state, { payload }) => {
            state.secuenciaActiva = payload;
            state.cargando = false;
        },
        rtkAgregarSecuencia: (state, { payload }) => {
            state.secuencias.unshift(payload);
            state.secuencia = payload;
            state.cargando = false;
        },
        rtkActualizarSecuencia: (state, { payload }) => {
            state.secuencias = state.secuencias.map((secuencia) =>
                secuencia.id === payload.id ? payload : secuencia
            );
            state.secuencia = payload;
            state.cargando = false;
        },
        rtkActivarSecuencia: (state, { payload }) => {
            state.activarSecuencia = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkCargarDisponibilidad: (state, { payload }) => {
            state.disponibilidad = payload;
            state.cargando = false;
        },
        rtkLimpiarSecuencias: (state) => {
            state.secuencias = [];
            state.secuencia = null;
            state.secuenciaActiva = null;
            state.activarSecuencia = null;
            state.disponibilidad = null;
            state.mensaje = undefined;
            state.errores = undefined;
        },
        rtkLimpiarSecuencia: (state) => {
            state.secuencia = null;
            state.activarSecuencia = null;
            state.disponibilidad = null;
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
    rtkCargarSecuencias,
    rtkCargarSecuencia,
    rtkCargarSecuenciaActiva,
    rtkAgregarSecuencia,
    rtkActualizarSecuencia,
    rtkActivarSecuencia,
    rtkCargarDisponibilidad,
    rtkLimpiarSecuencias,
    rtkLimpiarSecuencia,
    rtkCargarMensaje,
    rtkCargarErrores,
} = secuenciaFacturaSlice.actions;
