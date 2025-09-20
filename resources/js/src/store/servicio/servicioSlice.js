import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    servicios: [],
    activarServicio: null,
    mensaje: undefined,
    errores: undefined,
};

export const servicioSlice = createSlice({
    name: "servicio",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarServicios: (state, { payload }) => {
            state.servicios = payload;
            state.cargando = false;
        },
        rtkAgregarServicio: (state, { payload }) => {
            state.servicios.push(payload);
            state.cargando = false;
        },
        rtkActualizarServicio: (state, { payload }) => {
            state.servicios = state.servicios.map((servicio) =>
                servicio.id === payload.id ? payload : servicio
            );
            state.cargando = false;
        },
        rtkActivarServicio: (state, { payload }) => {
            state.activarServicio = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarServicios: (state) => {
            state.servicios = [];
            state.activarServicio = null;
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
    rtkCargarServicios,
    rtkAgregarServicio,
    rtkActualizarServicio,
    rtkActivarServicio,
    rtkLimpiarServicios,
    rtkCargarMensaje,
    rtkCargarErrores,
} = servicioSlice.actions;
