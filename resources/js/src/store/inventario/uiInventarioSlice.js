import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalInventario: false,
    abrirModalActivarProductoInventario: false,
    abrirModalAgregarStock: false,
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
        rtkAbrirModalAgregarStock: (state, { payload }) => {
            state.abrirModalAgregarStock = payload;
        },
    },
});

export const {
    rtkAbrirModalInventario,
    rtkAbrirModalActivarProductoInventario,
    rtkAbrirModalAgregarStock,
} = uiInventarioSlice.actions;
