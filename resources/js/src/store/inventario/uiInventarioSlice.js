import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalInventario: false,
    abrirModalActivarProductoInventario: false,
};

export const uiInventarioSlice = createSlice({
    name: "uiInventario",
    initialState,
    reducers: {
        rtkAbrirModalInventario: (state, { payload }) => {
            state.abrirModalInventario = payload;
        },
        rtkAbrirModalActivarProductoInventario: (state, { payload }) => {
            state.abrirModalActivarProductoInventario = payload;
        },
    },
});

export const {
    rtkAbrirModalInventario,
    rtkAbrirModalActivarProductoInventario,
} = uiInventarioSlice.actions;
