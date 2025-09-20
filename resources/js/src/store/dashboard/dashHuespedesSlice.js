import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoHuespedesRecurrentes: false,
    cargandoTotalHuedespes: false,
    huespedesRecurrentes: [],
    totalHuespedes: [],
    errores: undefined,
};

export const dashHuespedesSlice = createSlice({
    name: "dashHuespedesSlice",
    initialState,
    reducers: {
        rtkCargandoHuespedesRecurrentes: (state, { payload }) => {
            state.cargandoHuespedesRecurrentes = payload;
            state.errores = undefined;
        },
        rtkHuespedesRecurrentesCargados: (state, { payload }) => {
            state.cargandoHuespedesRecurrentes = false;
            state.huespedesRecurrentes = payload;
            state.errores = undefined;
        },
        rtkCargandoTotalHuespedes: (state, { payload }) => {
            state.cargandoTotalHuedespes = payload;
            state.errores = undefined;
        },
        rtkTotalHuespedesCargados: (state, { payload }) => {
            state.cargandoTotalHuedespes = false;
            state.totalHuespedes = payload;
            state.errores = undefined;
        },
        rtkLimpiarHuespedesRecurrentes: (state) => {
            state.huespedesRecurrentes = [];
            state.errores = undefined;
        },
        rtkLimpiarTotalHuespedes: (state) => {
            state.totalHuespedes = [];
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoHuespedesRecurrentes = false;
            state.cargandoTotalHuedespes = false;
        },
    },
});

export const {
    rtkCargandoHuespedesRecurrentes,
    rtkHuespedesRecurrentesCargados,
    rtkCargandoTotalHuespedes,
    rtkTotalHuespedesCargados,
    rtkLimpiarHuespedesRecurrentes,
    rtkLimpiarTotalHuespedes,
    rtkCargarErrores,
} = dashHuespedesSlice.actions;
