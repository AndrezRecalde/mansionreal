import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    permisos: [],
    errores: undefined,
};

export const permissionSlice = createSlice({
    name: "permission",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarPermisos: (state, { payload }) => {
            state.permisos = payload;
            state.cargando = false;
            state.errores = undefined;
        },
        rtkLimpiarPermisos: (state) => {
            state.permisos = [];
            state.cargando = false;
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargando = false;
        },
    },
});

export const {
    rtkCargando,
    rtkCargarPermisos,
    rtkLimpiarPermisos,
    rtkCargarErrores,
} = permissionSlice.actions;
