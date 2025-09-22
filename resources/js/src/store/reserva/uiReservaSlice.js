import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalReservarDepartamento: false,
    abrirModalReservaFinalizar: false,
};

export const uiReservaSlice = createSlice({
    name: "uiReserva",
    initialState,
    reducers: {
        rtkAbrirModalReservarDepartamento: (state, { payload }) => {
            state.abrirModalReservarDepartamento = payload;
        },
        rtkAbrirModalReservaFinalizar: (state, { payload }) => {
            state.abrirModalReservaFinalizar = payload;
        },
    },
});

export const { rtkAbrirModalReservarDepartamento, rtkAbrirModalReservaFinalizar } = uiReservaSlice.actions;
