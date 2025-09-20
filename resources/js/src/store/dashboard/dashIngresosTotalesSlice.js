import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoIngresosTotales: false,
    ingresosTotales: [],
    errores: undefined,
};

export const dashIngresosTotalesSlice = createSlice({
    name: "dashIngresosTotales",
    initialState,
    reducers: {
        rtkCargandoIngresosTotales: (state, { payload }) => {
            state.cargandoIngresosTotales = payload;
            state.errores = undefined;
        },
        rtkIngresosTotalesCargados: (state, { payload }) => {
            state.cargandoIngresosTotales = false;
            state.ingresosTotales = payload;
            state.errores = undefined;
        },
        rtkLimpiarIngresosTotales: (state) => {
            state.cargandoIngresosTotales = false;
            state.ingresosTotales = [];
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoIngresosTotales = false;
        },
    },
});

export const {
    rtkCargandoIngresosTotales,
    rtkIngresosTotalesCargados,
    rtkLimpiarIngresosTotales,
    rtkCargarErrores,
} = dashIngresosTotalesSlice.actions;
