import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    ivas: [],
    activarIva: null,
    mensaje: undefined,
    errores: undefined,
};

export const configuracionIvaSlice = createSlice({
    name: "configuracionIva",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarIvas: (state, { payload }) => {
            state.ivas = payload;
            state.cargando = false;
        },
        rtkAgregarIva: (state, { payload }) => {
            state.ivas.push(payload);
            state.cargando = false;
        },
        rtkActualizarIva: (state, { payload }) => {
            state.ivas = state.ivas.map((iva) =>
                iva.id === payload.id ? payload : iva
            );
            state.cargando = false;
        },
        rtkActivarIva: (state, { payload }) => {
            state.activarIva = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarIvas: (state) => {
            state.ivas = [];
            state.activarIva = null;
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
    rtkCargarIvas,
    rtkAgregarIva,
    rtkActualizarIva,
    rtkActivarIva,
    rtkLimpiarIvas,
    rtkCargarMensaje,
    rtkCargarErrores,
} = configuracionIvaSlice.actions;
