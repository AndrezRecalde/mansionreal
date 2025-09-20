import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    provincias: [],
    activarProvincia: null,
    mensaje: undefined,
    errores: undefined,
};

export const provinciaSlice = createSlice({
    name: "provincia",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargandoProvincias: (state, { payload }) => {
            state.provincias = payload;
            state.cargando = false;
        },
        rtkAgregarProvincia: (state, { payload }) => {
            state.provincias.push(payload);
            state.cargando = false;
        },
        rtkActualizarProvincia: (state, { payload }) => {
            state.provincias = state.provincias.map((provincia) =>
                provincia.id === payload.id ? payload : provincia
            );
            state.cargando = false;
        },
        rtkActivarProvincia: (state, { payload }) => {
            state.activarProvincia = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarProvincias: (state) => {
            state.provincias = [];
            state.activarProvincia = null;
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
    rtkCargandoProvincias,
    rtkAgregarProvincia,
    rtkActualizarProvincia,
    rtkActivarProvincia,
    rtkLimpiarProvincias,
    rtkCargarMensaje,
    rtkCargarErrores,
} = provinciaSlice.actions;
