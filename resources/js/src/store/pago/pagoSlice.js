import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    pagos: [],
    activarPago: false,
    mensaje: undefined,
    errores: undefined,
};

export const pagoSlice = createSlice({
    name: "pago",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarPagos: (state, { payload }) => {
            state.pagos = payload;
            state.cargando = false;
        },
        rtkAgregarPago: (state, { payload }) => {
            state.pagos.push(payload);
            state.cargando = false;
        },
        rtkActivarPago: (state, { payload }) => {
            state.activarPago = payload;
            state.cargando = false;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarPagos: (state) => {
            state.activarPago = false;
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
    rtkCargarPagos,
    rtkAgregarPago,
    rtkActivarPago,
    rtkLimpiarPagos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = pagoSlice.actions;
