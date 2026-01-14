import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalReservarDepartamento: false,
    abrirModalReservaFinalizar: false,
    abrirModalCancelarReserva: false,
    abrirModalInformacionReserva: false,
    abrirModalReservarPorCalendario: false,
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
        rtkAbrirModalCancelarReserva: (state, { payload }) => {
            state.abrirModalCancelarReserva = payload;
        },
        rtkAbrirModalInformacionReserva: (state, { payload }) => {
            state.abrirModalInformacionReserva = payload;
        },
        rtkAbrirModalReservarPorCalendario: (state, { payload }) => {
            state.abrirModalReservarPorCalendario = payload;
        },
    },
});

export const {
    rtkAbrirModalReservarDepartamento,
    rtkAbrirModalReservaFinalizar,
    rtkAbrirModalCancelarReserva,
    rtkAbrirModalInformacionReserva,
    rtkAbrirModalReservarPorCalendario
} = uiReservaSlice.actions;
