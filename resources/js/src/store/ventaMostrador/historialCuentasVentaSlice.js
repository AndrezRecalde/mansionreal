import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    historialCuentas: [],
    mensaje: undefined,
    errores: undefined,
};

export const historialCuentasVentaSlice = createSlice({
    name: "historialCuentasVenta",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarHistorial: (state, { payload }) => {
            state.historialCuentas = payload;
        },
        rtkLimpiarHistorial: (state) => {
            state.historialCuentas = [];
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
    rtkCargarHistorial,
    rtkLimpiarHistorial,
    rtkCargarMensaje,
    rtkCargarErrores,
} = historialCuentasVentaSlice.actions;
