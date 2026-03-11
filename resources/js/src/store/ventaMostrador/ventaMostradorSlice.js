import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    carrito: [], // items pendientes de confirmar
    consumosConfirmados: [], // consumos ya registrados en backend
    factura: null,
    pagos: [],
    mensaje: undefined,
    errores: undefined,
};

export const ventaMostradorSlice = createSlice({
    name: "ventaMostrador",
    initialState,
    reducers: {
        rtkCargando: (state, { payload }) => {
            state.cargando = payload;
        },

        // Carrito
        rtkAgregarItemCarrito: (state, { payload }) => {
            const existe = state.carrito.find(
                (i) => i.inventario_id === payload.inventario_id,
            );
            if (existe) {
                existe.cantidad += payload.cantidad;
            } else {
                state.carrito.push({ ...payload });
            }
        },
        rtkEliminarItemCarrito: (state, { payload }) => {
            state.carrito = state.carrito.filter(
                (i) => i.inventario_id !== payload,
            );
        },
        rtkActualizarCantidadCarrito: (state, { payload }) => {
            const item = state.carrito.find(
                (i) => i.inventario_id === payload.inventarioId,
            );
            if (item) {
                item.cantidad = payload.cantidad;
            }
        },
        rtkLimpiarCarrito: (state) => {
            state.carrito = [];
            state.consumosConfirmados = [];
            state.factura = null;
            state.pagos = [];
        },

        // Consumos confirmados (backend)
        rtkCargarConsumosCarrito: (state, { payload }) => {
            state.consumosConfirmados = payload;
        },

        // Factura
        rtkCargarFactura: (state, { payload }) => {
            state.factura = payload;
        },

        // Pagos
        rtkCargarPagos: (state, { payload }) => {
            state.pagos = payload;
        },

        // Mensajes / errores
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
    rtkAgregarItemCarrito,
    rtkEliminarItemCarrito,
    rtkActualizarCantidadCarrito,
    rtkLimpiarCarrito,
    rtkCargarConsumosCarrito,
    rtkCargarFactura,
    rtkCargarPagos,
    rtkCargarMensaje,
    rtkCargarErrores,
} = ventaMostradorSlice.actions;
