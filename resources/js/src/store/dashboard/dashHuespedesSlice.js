import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoHuespedesRecurrentes: false,
    huespedesRecurrentes: [],
    errores: undefined,
};

export const dashHuespedesSlice = createSlice({
    name: "dashHuespedes",
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
        rtkLimpiarHuespedesRecurrentes: (state) => {
            state.huespedesRecurrentes = [];
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoHuespedesRecurrentes = false;
        },
    },
});

export const {
    rtkCargandoHuespedesRecurrentes,
    rtkHuespedesRecurrentesCargados,
    rtkLimpiarHuespedesRecurrentes,
    rtkCargarErrores,
} = dashHuespedesSlice.actions;
