import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalCliente: false,
    abrirModalClienteEditar: false,
    abrirModalClienteEliminar: false,
    abrirModalBuscarCliente: false,
    abrirModalSelectorCliente: false,
};

export const uiClienteFacturacionSlice = createSlice({
    name: "uiClienteFacturacion",
    initialState,
    reducers: {
        rtkAbrirModalCliente: (state, { payload }) => {
            state.abrirModalCliente = payload;
        },
        rtkAbrirModalClienteEditar: (state, { payload }) => {
            state.abrirModalClienteEditar = payload;
        },
        rtkAbrirModalClienteEliminar: (state, { payload }) => {
            state.abrirModalClienteEliminar = payload;
        },
        rtkAbrirModalBuscarCliente: (state, { payload }) => {
            state.abrirModalBuscarCliente = payload;
        },
        rtkAbrirModalSelectorCliente: (state, { payload }) => {
            state.abrirModalSelectorCliente = payload;
        },
    },
});

export const {
    rtkAbrirModalCliente,
    rtkAbrirModalClienteEditar,
    rtkAbrirModalClienteEliminar,
    rtkAbrirModalBuscarCliente,
    rtkAbrirModalSelectorCliente,
} = uiClienteFacturacionSlice.actions;
