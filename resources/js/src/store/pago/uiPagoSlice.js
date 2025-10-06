import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalRegistroPago: false,
    abrirModalEditarRegistroPago: false,
    abrirModalEliminarRegistroPago: false,
};

export const uiPagoSlice = createSlice({
    name: "uiPago",
    initialState,
    reducers: {
        rtkAbrirModalRegistroPago: (state, { payload }) => {
            state.abrirModalRegistroPago = payload;
        },
        rtkAbrirModalEditarRegistroPago: (state, { payload }) => {
            state.abrirModalEditarRegistroPago = payload;
        },
        rtkAbrirModalEliminarRegistroPago: (state, { payload }) => {
            state.abrirModalEliminarRegistroPago = payload;
        },
    },
});

export const {
    rtkAbrirModalRegistroPago,
    rtkAbrirModalEditarRegistroPago,
    rtkAbrirModalEliminarRegistroPago,
} = uiPagoSlice.actions;
