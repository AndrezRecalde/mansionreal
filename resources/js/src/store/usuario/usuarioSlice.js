import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    cargandoReportes: false,
    usuarios: [],
    reportes: [],
    activarUsuario: null,
    mensaje: undefined,
    errores: undefined,
};

export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargandoReportes: (state, { payload }) => {
            state.cargandoReportes = payload;
        },
        rtkCargarUsuarios: (state, { payload }) => {
            state.usuarios = payload;
            state.cargando = false;
        },
        rtkCargarReportes: (state, { payload }) => {
            state.reportes = payload;
            state.cargandoReportes = false;
        },
        rtkAgregarUsuario: (state, { payload }) => {
            state.usuarios.push(payload);
            state.cargando = false;
        },
        rtkActualizarUsuario: (state, { payload }) => {
            state.usuarios = state.usuarios.map((usuario) =>
                usuario.id === payload.id ? payload : usuario
            );
            state.cargando = false;
        },
        rtkActivarUsuario: (state, { payload }) => {
            state.activarUsuario = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarUsuarios: (state) => {
            state.usuarios = [];
            state.cargando = false;
            state.reportes = [];
            state.cargandoReportes = false;
            state.activarUsuario = null;
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
    rtkCargandoReportes,
    rtkCargarUsuarios,
    rtkCargarReportes,
    rtkAgregarUsuario,
    rtkActualizarUsuario,
    rtkActivarUsuario,
    rtkLimpiarUsuarios,
    rtkCargarMensaje,
    rtkCargarErrores,
} = usuarioSlice.actions;
