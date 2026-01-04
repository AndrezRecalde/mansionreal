import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    reservas: [],
    recursosDepartamentos: [],
    estadisticasOcupacion: {
        total_departamentos: 0,
        dias_periodo: 0,
        noches_posibles: 0,
        noches_ocupadas: 0,
        porcentaje_ocupacion: 0,
    },
    activarReserva: null,
    mensaje: undefined,
    errores: undefined,
};

export const calendarioSlice = createSlice({
    name: "calendario",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarReservas: (state, { payload }) => {
            state.reservas = payload;
            state.cargando = false;
        },
        rtkCargarRecursosDepartamentos: (state, { payload }) => {
            state.recursosDepartamentos = payload;
            state.cargando = false;
        },
        rtkCargarEstadisticasOcupacion: (state, { payload }) => {
            state.estadisticasOcupacion.total_departamentos =
                payload.total_departamentos;
            state.estadisticasOcupacion.dias_periodo = payload.dias_periodo;
            state.estadisticasOcupacion.noches_posibles =
                payload.noches_posibles;
            state.estadisticasOcupacion.noches_ocupadas =
                payload.noches_ocupadas;
            state.estadisticasOcupacion.porcentaje_ocupacion =
                payload.porcentaje_ocupacion;
            state.cargando = false;
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
        rtkActivarReserva: (state, { payload }) => {
            state.activarReserva = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkLimpiarReservas: (state) => {
            state.reservas = [];
            state.recursosDepartamentos = [];
            state.estadisticasOcupacion = {
                total_departamentos: 0,
                dias_periodo: 0,
                noches_posibles: 0,
                noches_ocupadas: 0,
                porcentaje_ocupacion: 0,
            };
            state.cargando = false;
            state.activarReserva = null;
            state.errores = undefined;
            state.mensaje = undefined;
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
    rtkCargarReservas,
    rtkCargarRecursosDepartamentos,
    rtkCargarEstadisticasOcupacion,
    rtkAgregarReserva,
    rtkActualizarReserva,
    rtkActivarReserva,
    rtkLimpiarReservas,
    rtkCargarMensaje,
    rtkCargarErrores,
} = calendarioSlice.actions;
