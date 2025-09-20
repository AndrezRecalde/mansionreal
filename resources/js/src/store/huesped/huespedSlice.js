import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    huespedes: [],
    activarHuesped: null,
    mensaje: undefined,
    errores: undefined,
};

export const huespedSlice = createSlice({
    name: "huesped",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarHuespedes: (state, { payload }) => {
            state.huespedes = payload;
            state.cargando = false;
        },
        rtkAgregarHuesped: (state, { payload }) => {
            state.huespedes.push(payload);
            state.cargando = false;
        },
        rtkActualizarHuesped: (state, { payload }) => {
            state.huespedes = state.huespedes.map((huesped) =>
                huesped.id === payload.id ? payload : huesped
            );
            state.cargando = false;
        },
        rtkActivarHuesped: (state, { payload }) => {
            state.activarHuesped = payload;
            state.cargando = false;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarHuespedes: (state) => {
            state.huespedes = [];
            state.activarHuesped = null;
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
    rtkCargarHuespedes,
    rtkAgregarHuesped,
    rtkActualizarHuesped,
    rtkActivarHuesped,
    rtkLimpiarHuespedes,
    rtkCargarMensaje,
    rtkCargarErrores,
} = huespedSlice.actions;
