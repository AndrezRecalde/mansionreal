import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalConsumo: false,
    abrirDrawerConsumosDepartamento: false,

    abrirModalEditarConsumo: false,
    abrirModalEliminarConsumo: false,
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
    },
});

export const {
    rtkAbrirModalConsumo,
    rtkAbrirDrawerConsumosDepartamento,
    rtkAbrirModalEditarConsumo,
    rtkAbrirModalEliminarConsumo,
} = uiConsumoSlice.actions;
