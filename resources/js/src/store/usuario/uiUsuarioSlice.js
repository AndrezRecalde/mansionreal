import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalUsuario: false,
    abrirModalActivarUsuario: false,
    abrirModalResetearPwd: false,
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
        rtkAbrirModalResetearPwd: (state, { payload }) => {
            state.abrirModalResetearPwd = payload;
        },
    },
});

export const { rtkAbrirModalUsuario, rtkAbrirModalActivarUsuario, rtkAbrirModalResetearPwd  } =
    uiUsuarioSlice.actions;
