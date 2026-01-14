import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalGenerarFactura: false,
    abrirModalVerFactura: false,
    abrirModalAnularFactura: false,
    abrirDrawerFacturacion: false,
};

export const uiFacturaSlice = createSlice({
    name: "uiFactura",
    initialState,
    reducers: {
        rtkAbrirModalGenerarFactura: (state, { payload }) => {
            state.abrirModalGenerarFactura = payload;
        },
        rtkAbrirModalVerFactura: (state, { payload }) => {
            state.abrirModalVerFactura = payload;
        },
        rtkAbrirModalAnularFactura: (state, { payload }) => {
            state.abrirModalAnularFactura = payload;
        },
        rtkAbrirDrawerFacturacion: (state, { payload }) => {
            state.abrirDrawerFacturacion = payload;
        },
    },
});

export const {
    rtkAbrirModalGenerarFactura,
    rtkAbrirModalVerFactura,
    rtkAbrirModalAnularFactura,
    rtkAbrirDrawerFacturacion,
} = uiFacturaSlice.actions;
