import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalConsumo: false,
    abrirDrawerConsumosDepartamento: false,
    abrirModalEditarConsumo: false,
    abrirModalEliminarConsumo: false,
    // ✅ NUEVOS: Modales para descuentos
    abrirModalAplicarDescuento: false,
    abrirModalDescuentoMasivo: false,
};

export const uiConsumoSlice = createSlice({
    name: "uiConsumo",
    initialState,
    reducers: {
        rtkAbrirModalConsumo: (state, { payload }) => {
            state.abrirModalConsumo = payload;
        },
        rtkAbrirDrawerConsumosDepartamento: (state, { payload }) => {
            state.abrirDrawerConsumosDepartamento = payload;
        },
        rtkAbrirModalEditarConsumo: (state, { payload }) => {
            state.abrirModalEditarConsumo = payload;
        },
        rtkAbrirModalEliminarConsumo: (state, { payload }) => {
            state.abrirModalEliminarConsumo = payload;
        },
        // ✅ NUEVOS: Reducers para descuentos
        rtkAbrirModalAplicarDescuento: (state, { payload }) => {
            state.abrirModalAplicarDescuento = payload;
        },
        rtkAbrirModalDescuentoMasivo: (state, { payload }) => {
            state.abrirModalDescuentoMasivo = payload;
        },
    },
});

export const {
    rtkAbrirModalConsumo,
    rtkAbrirDrawerConsumosDepartamento,
    rtkAbrirModalEditarConsumo,
    rtkAbrirModalEliminarConsumo,
    // ✅ NUEVOS
    rtkAbrirModalAplicarDescuento,
    rtkAbrirModalDescuentoMasivo,
} = uiConsumoSlice.actions;
