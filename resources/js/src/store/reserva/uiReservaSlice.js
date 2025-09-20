import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalReservarDepartamento: false,
};

export const uiReservaSlice = createSlice({
    name: "uiReserva",
    initialState,
    reducers: {
        rtkAbrirModalReservarDepartamento: (state, { payload }) => {
            state.abrirModalReservarDepartamento = payload;
        },
    },
});

export const { rtkAbrirModalReservarDepartamento } = uiReservaSlice.actions;
