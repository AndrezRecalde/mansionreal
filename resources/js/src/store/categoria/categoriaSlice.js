import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    categorias: [],
    activarCategoria: null,
    mensaje: undefined,
    errores: undefined,
};

export const categoriaSlice = createSlice({
    name: "categoria",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarCategorias: (state, { payload }) => {
            state.categorias = payload;
            state.cargando = false;
        },
        rtkAgregarCategoria: (state, { payload }) => {
            state.categorias.push(payload);
            state.cargando = false;
        },
        rtkActualizarCategoria: (state, { payload }) => {
            state.categorias = state.categorias.map((categoria) =>
                categoria.id === payload.id ? payload : categoria
            );
            state.cargando = false;
        },
        rtkActivarCategoria: (state, { payload }) => {
            state.activarCategoria = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarCategorias: (state) => {
            state.categorias = [];
            state.activarCategoria = null;
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
    rtkCargarCategorias,
    rtkAgregarCategoria,
    rtkActualizarCategoria,
    rtkActivarCategoria,
    rtkLimpiarCategorias,
    rtkCargarMensaje,
    rtkCargarErrores,
} = categoriaSlice.actions;
