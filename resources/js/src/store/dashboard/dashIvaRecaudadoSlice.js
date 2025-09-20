import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoIvaRecaudado: false,
    ivaRecaudado: [],
    errores: undefined,
};

export const dashIvaRecaudadoSlice = createSlice({
    name: "dashIvaRecaudado",
    initialState,
    reducers: {
        rtkCargandoIvaRecaudado: (state, { payload }) => {
            state.cargandoIvaRecaudado = payload;
            state.errores = undefined;
        },
        rtkIvaRecaudadoCargado: (state, { payload }) => {
            state.cargandoIvaRecaudado = false;
            state.ivaRecaudado = payload;
            state.errores = undefined;
        },
        rtkLimpiarIvaRecaudado: (state) => {
            state.cargandoIvaRecaudado = false;
            state.ivaRecaudado = [];
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoIvaRecaudado = false;
        },
    },
});

export const {
    rtkCargandoIvaRecaudado,
    rtkIvaRecaudadoCargado,
    rtkLimpiarIvaRecaudado,
    rtkCargarErrores,
} = dashIvaRecaudadoSlice.actions;
