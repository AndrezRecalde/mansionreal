import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalConsumo: false,
    abrirDrawerConsumosDepartamento: false,
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
    },
});

export const { rtkAbrirModalConsumo, rtkAbrirDrawerConsumosDepartamento } =
    uiConsumoSlice.actions;
