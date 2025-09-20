import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    gastos: [],
    activarGasto: null,
    mensaje: undefined,
    errores: undefined,
};

export const gastoSlice = createSlice({
    name: "gasto",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarGastos: (state, { payload }) => {
            state.gastos = payload;
            state.cargando = false;
        },
        rtkAgregarGasto: (state, { payload }) => {
            state.gastos.push(payload);
            state.cargando = false;
        },
        rtkActualizarGasto: (state, { payload }) => {
            state.gastos = state.gastos.map((gasto) =>
                gasto.id === payload.id ? payload : gasto
            );
            state.cargando = false;
        },
        rtkActivarGasto: (state, { payload }) => {
            state.activarGasto = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarGastos: (state) => {
            state.gastos = [];
            state.activarGasto = null;
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
    rtkCargarGastos,
    rtkAgregarGasto,
    rtkActualizarGasto,
    rtkActivarGasto,
    rtkLimpiarGastos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = gastoSlice.actions;
