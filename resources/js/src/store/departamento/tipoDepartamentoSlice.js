import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    tiposDepartamentos: [],
    activarTipoDepartamento: null,
    mensaje: undefined,
    errores: undefined,
};

export const tipoDepartamentoSlice = createSlice({
    name: "varName",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarTiposDepartamentos: (state, { payload }) => {
            state.tiposDepartamentos = payload;
            state.cargando = false;
        },
        rtkAgregarTipoDepartamento: (state, { payload }) => {
            state.tiposDepartamentos.push(payload);
            state.cargando = false;
        },
        rtkActualizarTipoDepartamento: (state, { payload }) => {
            state.tiposDepartamentos = state.tiposDepartamentos.map(
                (tipoDepartamento) =>
                    tipoDepartamento.id === payload.id
                        ? payload
                        : tipoDepartamento
            );
            state.cargando = false;
        },
        rtkActivarTipoDepartamento: (state, { payload }) => {
            state.activarTipoDepartamento = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarTiposDepartamentos: (state) => {
            state.tiposDepartamentos = [];
            state.activarTipoDepartamento = null;
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
    rtkCargarTiposDepartamentos,
    rtkAgregarTipoDepartamento,
    rtkActualizarTipoDepartamento,
    rtkActivarTipoDepartamento,
    rtkLimpiarTiposDepartamentos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = tipoDepartamentoSlice.actions;
