import { createSlice } from "@reduxjs/toolkit";

export const estadiaSlice = createSlice({
    name: "estadia",
    initialState: {
        cargando: false,
        cargandoPDFNotaVenta: false,
        cargandoPDFReporte: false,
        estadias: [],
        activarEstadia: null,
        mensaje: undefined,
        errores: undefined,
    },
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargandoPDFNotaVenta: (state, { payload }) => {
            state.cargandoPDFNotaVenta = payload;
        },
        rtkCargandoPDFReporte: (state, { payload }) => {
            state.cargandoPDFReporte = payload;
        },
        rtkCargarEstadias: (state, { payload }) => {
            state.estadias = payload;
            state.cargando = false;
        },
        rtkAgregarEstadia: (state, { payload }) => {
            state.estadias.push(payload);
            state.cargando = false;
        },
        rtkActualizarEstadia: (state, { payload }) => {
            state.estadias = state.estadias.map((estadia) =>
                estadia.id === payload.id ? payload : estadia
            );
            state.cargando = false;
        },
        rtkAsignarEstadia: (state, { payload }) => {
            state.activarEstadia = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarEstadias: (state) => {
            state.estadias = [];
            state.activarEstadia = null;
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
    rtkCargandoPDFNotaVenta,
    rtkCargandoPDFReporte,
    rtkCargarEstadias,
    rtkAgregarEstadia,
    rtkActualizarEstadia,
    rtkAsignarEstadia,
    rtkLimpiarEstadias,
    rtkCargarMensaje,
    rtkCargarErrores,
} = estadiaSlice.actions;
