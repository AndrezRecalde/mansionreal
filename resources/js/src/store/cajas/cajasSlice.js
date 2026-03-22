import { createSlice } from "@reduxjs/toolkit";

export const cajasSlice = createSlice({
    name: "cajas",
    initialState: {
        cargando: false,
        turnoActivo: null,
        cajasDisponibles: [],
        turnosHistorial: [],
        reporteCierre: null,
        isCierreModalOpen: false,
        isAperturaModalOpen: false,
        isMovimientoModalOpen: false,

        cajasData: [],
        activaCaja: null,
        isCajaModalOpen: false,

        mensaje: undefined,
        errores: undefined,
    },
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkSetTurnoActivo: (state, { payload }) => {
            state.turnoActivo = payload;
        },
        rtkSetCajasDisponibles: (state, { payload }) => {
            state.cajasDisponibles = payload;
        },
        rtkSetTurnosHistorial: (state, { payload }) => {
            state.turnosHistorial = payload;
        },
        rtkSetReporteCierre: (state, { payload }) => {
            state.reporteCierre = payload;
        },
        rtkSetModalApertura: (state, { payload }) => {
            state.isAperturaModalOpen = payload;
        },
        rtkSetModalCierre: (state, { payload }) => {
            state.isCierreModalOpen = payload;
        },
        rtkSetModalMovimiento: (state, { payload }) => {
            state.isMovimientoModalOpen = payload;
        },
        rtkClearCajasData: (state) => {
            state.turnoActivo = null;
            state.cajasDisponibles = [];
            state.reporteCierre = null;
        },
        rtkSetCajasData: (state, { payload }) => {
            state.cajasData = payload;
        },
        rtkSetActivaCaja: (state, { payload }) => {
            state.activaCaja = payload;
        },
        rtkSetModalCajaCRUD: (state, { payload }) => {
            state.isCajaModalOpen = payload;
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
    rtkSetTurnoActivo,
    rtkSetCajasDisponibles,
    rtkSetTurnosHistorial,
    rtkSetReporteCierre,
    rtkSetModalApertura,
    rtkSetModalCierre,
    rtkSetModalMovimiento,
    rtkClearCajasData,
    rtkSetCajasData,
    rtkSetActivaCaja,
    rtkSetModalCajaCRUD,
    rtkCargarMensaje,
    rtkCargarErrores,
} = cajasSlice.actions;
