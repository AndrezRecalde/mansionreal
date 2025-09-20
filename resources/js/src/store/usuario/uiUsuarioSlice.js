import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalUsuario: false,
    abrirModalActivarUsuario: false,
};

export const uiUsuarioSlice = createSlice({
    name: "uiUsuario",
    initialState,
    reducers: {
        rtkAbrirModalUsuario: (state, { payload }) => {
            state.abrirModalUsuario = payload;
        },
        rtkAbrirModalActivarUsuario: (state, { payload }) => {
            state.abrirModalActivarUsuario = payload;
        },
    },
});

export const { rtkAbrirModalUsuario, rtkAbrirModalActivarUsuario } =
    uiUsuarioSlice.actions;
