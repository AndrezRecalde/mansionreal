import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalEstadia: false,
};

export const uiEstadiaSlice = createSlice({
    name: "uiEstadia",
    initialState,
    reducers: {
        rtkAbrirModalEstadia: (state, { payload }) => {
            state.abrirModalEstadia = payload;
        },
    },
});

export const { rtkAbrirModalEstadia } = uiEstadiaSlice.actions;
