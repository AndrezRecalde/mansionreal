import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    conceptosPagos: [],
    mensaje: undefined,
    errores: undefined,
};

export const conceptoPagoSlice = createSlice({
    name: "conceptoPago",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarConceptosPagos: (state, { payload }) => {
            state.conceptosPagos = payload;
            state.cargando = false;
        },
        rtkLimpiarConceptosPagos: (state) => {
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
    rtkCargarConceptosPagos,
    rtkLimpiarConceptosPagos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = conceptoPagoSlice.actions;
