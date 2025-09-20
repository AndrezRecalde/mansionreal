import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoIngresosPorDepartamento: false,
    ingresosPorDepartamento: [],
    errores: undefined,
};

export const dashIngresosPorDepartamentoSlice = createSlice({
    name: "dashIngresosPorDepartamento",
    initialState,
    reducers: {
        rtkCargandoIngresosPorDepartamento: (state, { payload }) => {
            state.cargandoIngresosPorDepartamento = payload;
            state.errores = undefined;
        },
        rtkIngresosPorDepartamentoCargados: (state, { payload }) => {
            state.cargandoIngresosPorDepartamento = false;
            state.ingresosPorDepartamento = payload;
            state.errores = undefined;
        },
        rtkLimpiarIngeresosPorDepartamento: (state) => {
            state.ingresosPorDepartamento = [];
            state.cargandoIngresosPorDepartamento = false;
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoIngresosPorDepartamento = false;
        },
    },
});

export const {
    rtkCargandoIngresosPorDepartamento,
    rtkIngresosPorDepartamentoCargados,
    rtkLimpiarIngeresosPorDepartamento,
    rtkCargarErrores,
} = dashIngresosPorDepartamentoSlice.actions;
