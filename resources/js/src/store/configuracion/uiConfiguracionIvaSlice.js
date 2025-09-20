import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalConfiguracionIva: false,
    abrirModalActivarConfiguracionIva: false,
};

export const uiConfiguracionIvaSlice = createSlice({
    name: "uiConfiguracionIva",
    initialState,
    reducers: {
        rtkAbrirModalConfiguracionIva: (state, { payload }) => {
            state.abrirModalConfiguracionIva = payload;
        },
        rtkAbrirModalActivarConfiguracionIva: (state, { payload }) => {
            state.abrirModalActivarConfiguracionIva = payload;
        },
    },
});

export const {
    rtkAbrirModalConfiguracionIva,
    rtkAbrirModalActivarConfiguracionIva
} = uiConfiguracionIvaSlice.actions;
