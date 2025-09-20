import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    inventarios: [],
    activarInventario: null,
    mensaje: undefined,
    errores: undefined,
};

export const inventarioSlice = createSlice({
    name: "inventario",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarInventarios: (state, { payload }) => {
            state.inventarios = payload;
            state.cargando = false;
        },
        rtkAgregarInventario: (state, { payload }) => {
            state.inventarios.push(payload);
            state.cargando = false;
        },
        rtkActualizarInventario: (state, { payload }) => {
            state.inventarios = state.inventarios.map((inventario) =>
                inventario.id === payload.id ? payload : inventario
            );
            state.cargando = false;
        },
        rtkActivarInventario: (state, { payload }) => {
            state.activarInventario = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarInventarios: (state) => {
            state.inventarios = [];
            state.activarInventario = null;
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
    rtkCargarInventarios,
    rtkAgregarInventario,
    rtkActualizarInventario,
    rtkActivarInventario,
    rtkLimpiarInventarios,
    rtkCargarMensaje,
    rtkCargarErrores,
} = inventarioSlice.actions;
