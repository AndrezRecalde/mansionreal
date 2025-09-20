import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargandoRankingProductos: false,
    rankingProductos: [],
    errores: undefined,
};
export const dashRankingProductosSlice = createSlice({
    name: "dashRankingProductos",
    initialState,
    reducers: {
        rtkCargandoRankingProductos: (state, { payload }) => {
            state.cargandoRankingProductos = payload;
            state.errores = undefined;
        },
        rtkRankingProductosCargados: (state, { payload }) => {
            state.cargandoRankingProductos = false;
            state.rankingProductos = payload;
            state.errores = undefined;
        },
        rtkLimpiarRankingProductos: (state) => {
            state.cargandoRankingProductos = false;
            state.rankingProductos = [];
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargandoRankingProductos = false;
        },
    },
});

export const {
    rtkCargandoRankingProductos,
    rtkRankingProductosCargados,
    rtkLimpiarRankingProductos,
    rtkCargarErrores,
} = dashRankingProductosSlice.actions;
