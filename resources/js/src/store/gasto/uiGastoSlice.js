import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalGasto: false,
    abrirEliminarModalGasto: false,
};

export const uiGastoSlice = createSlice({
    name: "uiGasto",
    initialState,
    reducers: {
        rtkAbrirModalGasto: (state, { payload }) => {
            state.abrirModalGasto = payload;
        },
        rtkAbrirEliminarModalGasto: (state, { payload }) => {
            state.abrirEliminarModalGasto = payload;
        },
    },
});

export const { rtkAbrirModalGasto, rtkAbrirEliminarModalGasto } =
    uiGastoSlice.actions;
