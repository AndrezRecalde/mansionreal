import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    departamentos: [],
    activarDepartamento: null,
    mensaje: undefined,
    errores: undefined,
};

export const departamentoSlice = createSlice({
    name: "departamento",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarDepartamentos: (state, { payload }) => {
            state.departamentos = payload;
            state.cargando = false;
        },
        rtkAgregarDepartamento: (state, { payload }) => {
            state.departamentos.push(payload);
            state.cargando = false;
        },
        rtkActualizarDepartamento: (state, { payload }) => {
            state.departamentos = state.departamentos.map((departamento) =>
                departamento.id === payload.id ? payload : departamento
            );
            state.cargando = false;
        },
        rtkActivarDepartamento: (state, { payload }) => {
            state.activarDepartamento = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarDepartamentos: (state) => {
            state.departamentos = [];
            state.activarDepartamento = null;
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
    rtkCargarDepartamentos,
    rtkAgregarDepartamento,
    rtkActualizarDepartamento,
    rtkActivarDepartamento,
    rtkLimpiarDepartamentos,
    rtkCargarMensaje,
    rtkCargarErrores
} = departamentoSlice.actions;
