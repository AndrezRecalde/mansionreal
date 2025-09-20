import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoOcupacionActual: false,
    ocupacionActual: [],
    errores: undefined,
};

export const dashOcupacionActualSlice = createSlice({
    name: "dashOcupacionActual",
    initialState,
    reducers: {
        rtkCargandoOcupacionActual: (state, { payload }) => {
            state.cargandoOcupacionActual = payload;
            state.errores = undefined;
        },
        rtkOcupacionActualCargada: (state, { payload }) => {
            state.cargandoOcupacionActual = false;
            state.ocupacionActual = payload;
            state.errores = undefined;
        },
        rtkLimpiarOcupacionActual: (state) => {
            state.cargandoOcupacionActual = false;
            state.ocupacionActual = [];
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoOcupacionActual = false;
        },
    },
});

export const {
    rtkCargandoOcupacionActual,
    rtkOcupacionActualCargada,
    rtkLimpiarOcupacionActual,
    rtkCargarErrores,
} = dashOcupacionActualSlice.actions;
