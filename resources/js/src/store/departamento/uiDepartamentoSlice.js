import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalDepartamento: false,
    abrirModalActivarDepartamento: false,
    abrirDrawerServiciosDepartamento: false,
    abrirModalTipoDepartamento: false,
    abrirModalActivarTipoDepartamento: false,
}

export const uiDepartamentoSlice = createSlice({
    name: "uiDepartamento",
    initialState,
    reducers: {
        rtkAbrirModalDepartamento: (state, { payload }) => {
            state.abrirModalDepartamento = payload;
        },
        rtkAbrirModalTipoDepartamento: (state, { payload }) => {
            state.abrirModalTipoDepartamento = payload;
        },
        rtkAbrirModalActivarDepartamento: (state, { payload }) => {
            state.abrirModalActivarDepartamento = payload;
        },
        rtkAbrirModalActivarTipoDepartamento: (state, { payload }) => {
            state.abrirModalActivarTipoDepartamento = payload;
        },
        rtkAbrirDrawerServiciosDepartamento: (state, { payload }) => {
            state.abrirDrawerServiciosDepartamento = payload;
        }
    },
});

export const {
    rtkAbrirModalDepartamento,
    rtkAbrirModalTipoDepartamento,
    rtkAbrirModalActivarDepartamento,
    rtkAbrirModalActivarTipoDepartamento,
    rtkAbrirDrawerServiciosDepartamento,
} = uiDepartamentoSlice.actions;
