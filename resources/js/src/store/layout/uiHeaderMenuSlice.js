import { createSlice } from "@reduxjs/toolkit";

export const uiHeaderMenuSlice = createSlice({
    name: "uiHeaderMenu",
    initialState: {
        abrirDrawerMobile: false,
        abrirLinksConfiguracion: false,
        abrirLinksGerencia: false,
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
    },
});

export const {
    rtkAbrirDrawerMobile,
    rtkAbrirLinksConfiguracion,
    rtkAbrirLinksGerencia,
} = uiHeaderMenuSlice.actions;
