import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Modales existentes
    abrirModalGenerarFactura: false,
    abrirModalVerFactura: false,
    abrirModalAnularFactura: false,
    abrirDrawerFacturacion: false,

    // ✅ NUEVOS:  Modales para la página de gestión de facturas
    abrirModalDetalleFactura: false,
    abrirModalPdfFactura: false,
    abrirModalReGenerarFactura: false,
};

export const uiFacturaSlice = createSlice({
    name: "uiFactura",
    initialState,
    reducers: {
        // Reducers existentes
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

        // ✅ NUEVOS: Reducers para gestión de facturas
        rtkAbrirModalDetalleFactura: (state, { payload }) => {
            state.abrirModalDetalleFactura = payload;
        },
        rtkAbrirModalPdfFactura: (state, { payload }) => {
            state.abrirModalPdfFactura = payload;
        },
        rtkAbrirModalReGenerarFactura: (state, { payload }) => {
            state.abrirModalReGenerarFactura = payload;
        },
    },
});

export const {
    // Exports existentes
    rtkAbrirModalGenerarFactura,
    rtkAbrirModalVerFactura,
    rtkAbrirModalAnularFactura,
    rtkAbrirDrawerFacturacion,

    // ✅ NUEVOS: Exports para gestión de facturas
    rtkAbrirModalDetalleFactura,
    rtkAbrirModalPdfFactura,
    rtkAbrirModalReGenerarFactura
} = uiFacturaSlice.actions;
