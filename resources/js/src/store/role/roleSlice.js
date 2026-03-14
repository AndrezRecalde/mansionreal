import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    roles: [],
    permisos: [],           // Todos los permisos del sistema
    permisosDeRol: [],      // Permisos del rol activo seleccionado
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
        rtkCargarPermisosRol: (state, { payload }) => {
            state.permisos = payload;
            state.cargando = false;
        },
        rtkCargarPermisosDeRol: (state, { payload }) => {
            state.permisosDeRol = payload;
            state.cargando = false;
        },
        rtkLimpiarPermisosDeRol: (state) => {
            state.permisosDeRol = [];
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
    rtkCargarPermisosRol,
    rtkCargarPermisosDeRol,
    rtkLimpiarPermisosDeRol,
    rtkCargarErrores,
} = roleSlice.actions;

