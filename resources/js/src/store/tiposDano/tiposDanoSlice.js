import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    tiposDano: [],
    activarTipoDano: null,
    mensaje: undefined,
    errores: undefined,
};

export const tiposDanoSlice = createSlice({
    name: "tiposDano",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarTiposDano: (state, { payload }) => {
            state.tiposDano = payload;
        },
        rtkAsignarTipoDano: (state, { payload }) => {
            state.tiposDano.push(payload);
            state.cargando = false;
        },
        rtkLimpiarTiposDano: (state) => {
            state.tiposDano = [];
            state.activarTipoDano = null;
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
    rtkCargarTiposDano,
    rtkAsignarTipoDano,
    rtkLimpiarTiposDano,
    rtkCargarMensaje,
    rtkCargarErrores,
} = tiposDanoSlice.actions;
