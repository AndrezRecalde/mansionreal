import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cargando: false,
    cuentas: [],       // Lista de cuentas abiertas/pagadas
    cuentaActiva: null, // Cuenta seleccionada (con consumos y pagos)
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

        // Cuentas de Venta
        rtkCargarCuentas: (state, { payload }) => {
            state.cuentas = payload;
        },
        rtkAgregarCuenta: (state, { payload }) => {
            state.cuentas.unshift(payload);
        },
        rtkCargarCuentaActiva: (state, { payload }) => {
            state.cuentaActiva = payload;
            // Update it in the list as well if it exists
            if (payload && payload.id) {
                const idx = state.cuentas.findIndex(c => c.id === payload.id);
                if (idx !== -1) {
                    state.cuentas[idx] = payload;
                }
            }
        },
        rtkLimpiarCuentaActiva: (state) => {
            state.cuentaActiva = null;
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
    rtkCargarCuentas,
    rtkAgregarCuenta,
    rtkCargarCuentaActiva,
    rtkLimpiarCuentaActiva,
    rtkCargarMensaje,
    rtkCargarErrores,
} = ventaMostradorSlice.actions;
