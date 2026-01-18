import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    limpiezas: [],
    paginacion: {},
    ultimosFiltros: {
        p_fecha_inicio: null,
        p_fecha_fin: null,
        p_anio: null,
        page: 1,
        per_page: 20,
    },
    activarLimpieza: null,
    mensaje: undefined,
    errores: undefined,
};

export const limpiezaSlice = createSlice({
    name: "limpieza",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarLimpiezas: (state, { payload }) => {
            state.limpiezas = payload;
            state.cargando = false;
        },
        rtkCargarPaginacion: (state, { payload }) => {
            state.paginacion = payload;
        },
        rtkGuardarUltimosFiltros: (state, action) => {
            state.ultimosFiltros = action.payload;
        },
        rtkAgregarLimpieza: (state, { payload }) => {
            state.limpiezas.push(payload);
            state.cargando = false;
        },
        rtkActualizarLimpieza: (state, { payload }) => {
            state.limpiezas = state.limpiezas.map((limpieza) =>
                limpieza.id === payload.id ? payload : limpieza
            );
            state.cargando = false;
        },
        rtkActivarLimpieza: (state, { payload }) => {
            state.activarLimpieza = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarLimpiezas: (state) => {
            state.limpiezas = [];
            state.activarLimpieza = null;
            state.ultimosFiltros = {
                p_fecha_inicio: null,
                p_fecha_fin: null,
                p_anio: null,
                page: 1,
                per_page: 20,
            };
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
    rtkCargarLimpiezas,
    rtkCargarPaginacion,
    rtkGuardarUltimosFiltros,
    rtkAgregarLimpieza,
    rtkActualizarLimpieza,
    rtkActivarLimpieza,
    rtkLimpiarLimpiezas,
    rtkCargarMensaje,
    rtkCargarErrores,
} = limpiezaSlice.actions;
