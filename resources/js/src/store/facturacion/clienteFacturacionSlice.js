import { createSlice } from "@reduxjs/toolkit";

export const clienteFacturacionSlice = createSlice({
    name: "clienteFacturacion",
    initialState: {
        cargando: false,
        clientes: [],
        clientesSimple: [],
        cliente: null,
        activarCliente: null,
        consumidorFinal: null,
        clienteExistente: null,
        datosPrellenados: null,
        estadisticas: null,
        mensaje: undefined,
        errores: undefined,
    },
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },
        rtkCargarClientes: (state, { payload }) => {
            state.clientes = payload;
            state.cargando = false;
        },
        rtkCargarClientesSimple: (state, { payload }) => {
            state.clientesSimple = payload;
            state.cargando = false;
        },
        rtkCargarCliente: (state, { payload }) => {
            state.cliente = payload;
            state.cargando = false;
        },
        rtkAgregarCliente: (state, { payload }) => {
            state.clientes.unshift(payload);
            state.cliente = payload;
            state.cargando = false;
        },
        rtkActualizarCliente: (state, { payload }) => {
            state.clientes = state.clientes.map((cliente) =>
                cliente.id === payload.id ? payload : cliente
            );
            state.cliente = payload;
            state.cargando = false;
        },
        rtkActivarCliente: (state, { payload }) => {
            state.activarCliente = payload;
            state.errores = undefined;
            state.mensaje = undefined;
        },
        rtkCargarConsumidorFinal: (state, { payload }) => {
            state.consumidorFinal = payload;
            state.cargando = false;
        },
        rtkCargarClienteExistente: (state, { payload }) => {
            state.clienteExistente = payload;
            state.cargando = false;
        },
        rtkCargarDatosPrellenados: (state, { payload }) => {
            state.datosPrellenados = payload;
            state.cargando = false;
        },
        rtkCargarEstadisticas: (state, { payload }) => {
            state.estadisticas = payload;
            state.cargando = false;
        },
        rtkLimpiarClientes: (state) => {
            state.clientes = [];
            state.clientesSimple = [];
            state.cliente = null;
            state.activarCliente = null;
            state.clienteExistente = null;
            state.datosPrellenados = null;
            state.estadisticas = null;
            state.mensaje = undefined;
            state.errores = undefined;
        },
        rtkLimpiarCliente: (state) => {
            state.cliente = null;
            state.activarCliente = null;
            state.clienteExistente = null;
            state.datosPrellenados = null;
            state.estadisticas = null;
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
    rtkCargarClientes,
    rtkCargarClientesSimple,
    rtkCargarCliente,
    rtkAgregarCliente,
    rtkActualizarCliente,
    rtkActivarCliente,
    rtkCargarConsumidorFinal,
    rtkCargarClienteExistente,
    rtkCargarDatosPrellenados,
    rtkCargarEstadisticas,
    rtkLimpiarClientes,
    rtkLimpiarCliente,
    rtkCargarMensaje,
    rtkCargarErrores,
} = clienteFacturacionSlice.actions;
