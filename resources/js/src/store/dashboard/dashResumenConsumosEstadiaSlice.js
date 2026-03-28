import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoResumenConsumosEstadia: false,
    resumenConsumosEstadia: [],
    errores: undefined,
};

export const dashResumenConsumosEstadiaSlice = createSlice({
    name: "dashResumenConsumosEstadia",
    initialState,
    reducers: {
        rtkCargandoResumenConsumosEstadia: (state, { payload }) => {
            state.cargandoResumenConsumosEstadia = payload;
            state.errores = undefined;
        },
        rtkResumenConsumosEstadiaCargados: (state, { payload }) => {
            state.cargandoResumenConsumosEstadia = false;
            state.resumenConsumosEstadia = payload;
            state.errores = undefined;
        },
        rtkLimpiarResumenConsumosEstadia: (state) => {
            state.resumenConsumosEstadia = [];
            state.cargandoResumenConsumosEstadia = false;
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoResumenConsumosEstadia = false;
        },
    },
});

export const {
    rtkCargandoResumenConsumosEstadia,
    rtkResumenConsumosEstadiaCargados,
    rtkLimpiarResumenConsumosEstadia,
    rtkCargarErrores,
} = dashResumenConsumosEstadiaSlice.actions;
