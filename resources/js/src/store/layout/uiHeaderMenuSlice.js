import { createSlice } from "@reduxjs/toolkit";

export const uiHeaderMenuSlice = createSlice({
    name: "uiHeaderMenu",
    initialState: {
        abrirDrawerMobile: false,
        abrirLinksConfiguracion: false,
        abrirLinksGerencia: false,
        abrirLinksInventario: false,
    },
    reducers: {
        rtkAbrirDrawerMobile: (state, { payload }) => {
            state.abrirDrawerMobile = payload;
        },
        rtkAbrirLinksConfiguracion: (state, { payload }) => {
            state.abrirLinksConfiguracion = payload;
        },
        rtkAbrirLinksGerencia: (state, { payload }) => {
            state.abrirLinksGerencia = payload;
        },
        rtkAbrirLinksInventario: (state, { payload }) => {
            state.abrirLinksInventario = payload;
        },
    },
});

export const {
    rtkAbrirDrawerMobile,
    rtkAbrirLinksConfiguracion,
    rtkAbrirLinksGerencia,
    rtkAbrirLinksInventario,
} = uiHeaderMenuSlice.actions;
