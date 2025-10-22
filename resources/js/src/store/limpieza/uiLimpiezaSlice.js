import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalLimpieza: false,
};

export const uiLimpiezaSlice = createSlice({
    name: "uiLimpieza",
    initialState,
    reducers: {
        rtkAbrirModalLimpieza: (state, { payload }) => {
            state.abrirModalLimpieza = payload;
        },
    },
});

export const { rtkAbrirModalLimpieza } = uiLimpiezaSlice.actions;
