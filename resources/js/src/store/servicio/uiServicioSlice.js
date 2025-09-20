import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalServicio: false,
    abrirModalActivarServicio: false,
};

export const uiServicioSlice = createSlice({
    name: "uiServicio",
    initialState,
    reducers: {
        rtkAbrirModalServicio: (state, { payload }) => {
            state.abrirModalServicio = payload;
        },
        rtkAbrirModalActivarServicio: (state, { payload }) => {
            state.abrirModalActivarServicio = payload;
        },
    },
});

export const { rtkAbrirModalServicio, rtkAbrirModalActivarServicio } =
    uiServicioSlice.actions;
