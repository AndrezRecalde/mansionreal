import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    huespedes: [],
    paginacion: {},
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
        rtkCargarPaginacion: (state, { payload }) => {
            state.paginacion = payload;
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
            state.paginacion = {};
            state.cargando = false;
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
    rtkCargarPaginacion,
    rtkAgregarHuesped,
    rtkActualizarHuesped,
    rtkActivarHuesped,
    rtkLimpiarHuespedes,
    rtkCargarMensaje,
    rtkCargarErrores,
} = huespedSlice.actions;
