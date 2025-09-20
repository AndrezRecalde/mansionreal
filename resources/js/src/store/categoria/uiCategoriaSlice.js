import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalCategoria: false,
    abrirModalActivarCategoria: false,
};

export const uiCategoriaSlice = createSlice({
    name: "uiCategoria",
    initialState,
    reducers: {
        rtkAbrirModalCategoria: (state, { payload }) => {
            state.abrirModalCategoria = payload;
        },
        rtkAbrirModalActivarCategoria: (state, { payload }) => {
            state.abrirModalActivarCategoria = payload;
        },
    },
});

export const { rtkAbrirModalCategoria, rtkAbrirModalActivarCategoria } =
    uiCategoriaSlice.actions;
