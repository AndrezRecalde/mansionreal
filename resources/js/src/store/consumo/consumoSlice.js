import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    consumos: [],
    activarConsumos: false,
    mensaje: undefined,
    errores: undefined,
};

export const consumoSlice = createSlice({
    name: "consumo",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarConsumos: (state, { payload }) => {
            state.consumos = payload;
            state.cargando = false;
        },
        rtkAgregarConsumo: (state, { payload }) => {
            state.consumos.push(payload);
            state.cargando = false;
        },
        rtkActualizarConsumo: (state, { payload }) => {
            state.consumos = state.consumos.map((consumo) =>
                consumo.id === payload.id ? payload : consumo
            );
            state.cargando = false;
        },
        rtkActivarConsumo: (state, { payload }) => {
            state.activarConsumos = payload;
            state.cargando = false;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarConsumos: (state) => {
            state.activarConsumos = false;
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
    rtkCargarConsumos,
    rtkAgregarConsumo,
    rtkActualizarConsumo,
    rtkActivarConsumo,
    rtkLimpiarConsumos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = consumoSlice.actions;
