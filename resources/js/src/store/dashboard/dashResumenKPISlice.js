import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    kpis: [
        {
            label: "Ocupación",
            value: 0,
            color: "blue",
        },
        {
            label: "Ingresos Totales",
            value: 0,
            color: "green",
        },
        {
            label: "Recaudación IVA",
            value: 0,
            color: "teal",
        },
        {
            label: "Total Huéspedes",
            value: 0,
            color: "orange",
        },
        {
            label: "Total Gastos",
            value: 0,
            color: "red",
        },
    ],
    errores: undefined,
};

export const dashResumenKPISlice = createSlice({
    name: "dashResumenKPI",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarResumenKPI: (state, { payload }) => {
            state.kpis = [
                {
                    label: "Ocupación",
                    value: payload[0].porcentaje_ocupacion,
                    color: "blue",
                },
                {
                    label: "Ingresos Totales",
                    value: payload[0].ingresos_totales,
                    color: "green",
                },
                {
                    label: "Recaudación IVA",
                    value: payload[0].recaudacion_iva,
                    color: "teal",
                },
                {
                    label: "Total Huéspedes",
                    value: payload[0].total_huespedes,
                    color: "orange",
                },
                {
                    label: "Total Gastos",
                    value: payload[0].total_gastos,
                    color: "red",
                },
            ];
            state.cargando = false;
            state.errores = undefined;
        },
        rtkLimpiarResumenKPI: (state) => {
            state.cargando = false;
            state.kpis = initialState.kpis;
            state.errores = undefined;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
            state.cargando = false;
        },
    },
});

export const {
    rtkCargando,
    rtkCargarResumenKPI,
    rtkLimpiarResumenKPI,
    rtkCargarErrores,
} = dashResumenKPISlice.actions;
