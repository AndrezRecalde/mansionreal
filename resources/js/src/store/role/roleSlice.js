import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    roles: [],
    errores: undefined,
};

export const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargandoRoles: (state, { payload }) => {
            state.roles = payload;
            state.cargando = false;
            state.errores = undefined;
        },
        rtkLimpiarRoles: (state) => {
            state.roles = [];
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
    rtkCargandoRoles,
    rtkLimpiarRoles,
    rtkCargarErrores,
} = roleSlice.actions;
