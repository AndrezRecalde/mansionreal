import { createSlice } from "@reduxjs/toolkit";

export const reservaSlice = createSlice({
    name: "reserva",
    initialState: {
        cargando: false,
        cargandoPDFNotaVenta: false,
        cargandoPDFReporte: false,
        reservas: [],
        activarReserva: null,
        mensaje: undefined,
        errores: undefined,
    },
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargandoPDFNotaVenta: (state, { payload }) => {
            state.cargandoPDFNotaVenta = payload;
        },
        rtkCargandoPDFReporte: (state, { payload }) => {
            state.cargandoPDFReporte = payload;
        },
        rtkCargarReservas: (state, { payload }) => {
            state.reservas = payload;
        },
        rtkAgregarReserva: (state, { payload }) => {
            state.reservas.push(payload);
            state.cargando = false;
        },
        rtkActualizarReserva: (state, { payload }) => {
            state.reservas = state.reservas.map((reserva) =>
                reserva.id === payload.id ? payload : reserva
            );
            state.cargando = false;
        },
        rtkAsignarReserva: (state, { payload }) => {
            state.activarReserva = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarReservas: (state) => {
            state.reservas = [];
            state.activarReserva = null;
            state.mensaje = undefined;
            state.errores = undefined;
        },
        rtkCargarMensaje: (state, { payload }) => {
            state.mensaje = payload;
        },
        rtkCargarErrores: (state, { payload }) => {
            state.errores = payload;
        },
    },
});

export const {
    rtkCargando,
    rtkCargandoPDFNotaVenta,
    rtkCargandoPDFReporte,
    rtkCargarReservas,
    rtkAgregarReserva,
    rtkActualizarReserva,
    rtkAsignarReserva,
    rtkLimpiarReservas,
    rtkCargarMensaje,
    rtkCargarErrores
 } =
    reservaSlice.actions;
