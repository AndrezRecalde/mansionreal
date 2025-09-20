import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoHuespedesGananciasMes: false,
    huespedesGananciasMes: [],
    errores: undefined,
};

export const dashHuespedesGananciasMesSlice = createSlice({
    name: "dashHuespedesGananciasMes",
    initialState,
    reducers: {
        rtkCargandoHuespedesGananciasMes: (state, { payload }) => {
            state.cargandoHuespedesGananciasMes = payload;
        },
        rtkHuespedesGananciasMesCargados: (state, { payload }) => {
            state.huespedesGananciasMes = payload;
            state.cargandoHuespedesGananciasMes = false;
        },
        rtkLimpiarHuespedesGananciasMes: (state) => {
            state.huespedesGananciasMes = [];
            state.errores = undefined;
            state.cargandoHuespedesGananciasMes = false;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoHuespedesGananciasMes = false;
        },
    },
});

export const {
    rtkCargandoHuespedesGananciasMes,
    rtkHuespedesGananciasMesCargados,
    rtkLimpiarHuespedesGananciasMes,
    rtkCargarErrores,
} = dashHuespedesGananciasMesSlice.actions;
