import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoGastosDanios: false,
    gastosDanios: [],
    errores: undefined,
};

export const dashGastosDaniosSlice = createSlice({
    name: "dashGastosDanios",
    initialState,
    reducers: {
        rtkCargandoGastosDanios: (state, { payload }) => {
            state.cargandoGastosDanios = payload;
            state.errores = undefined;
        },
        rtkGastosDaniosCargados: (state, { payload }) => {
            state.cargandoGastosDanios = false;
            state.gastosDanios = payload;
            state.errores = undefined;
        },
        rtkLimpiarGastosDanios: (state) => {
            state.gastosDanios = [];
            state.cargandoGastosDanios = false;
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoGastosDanios = false;
        },
    },
});

export const {
    rtkCargandoGastosDanios,
    rtkGastosDaniosCargados,
    rtkLimpiarGastosDanios,
    rtkCargarErrores,
} = dashGastosDaniosSlice.actions;
