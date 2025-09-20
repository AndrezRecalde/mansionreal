import { configureStore } from "@reduxjs/toolkit";
import {
    authSlice,
    categoriaSlice,
    configuracionIvaSlice,
    consumoSlice,
    dashGastosDaniosSlice,
    dashHuespedesGananciasMesSlice,
    dashHuespedesSlice,
    dashIngresosPorDepartamentoSlice,
    dashIngresosTotalesSlice,
    dashIvaRecaudadoSlice,
    dashOcupacionActualSlice,
    dashRankingProductosSlice,
    dashResumenKPISlice,
    departamentoSlice,
    gastoSlice,
    huespedSlice,
    inventarioSlice,
    provinciaSlice,
    reservaSlice,
    roleSlice,
    servicioSlice,
    tipoDepartamentoSlice,
    tiposDanoSlice,
    uiCategoriaSlice,
    uiConfiguracionIvaSlice,
    uiConsumoSlice,
    uiDepartamentoSlice,
    uiGastoSlice,
    uiHeaderMenuSlice,
    uiHuespedSlice,
    uiInventarioSlice,
    uiReservaSlice,
    uiServicioSlice,
    uiUsuarioSlice,
    usuarioSlice,
} from "../store";

export const store = configureStore({
    reducer: {
        /* Autenticacion */
        auth: authSlice.reducer,

        /* Usuario */
        usuario: usuarioSlice.reducer,
        uiUsuario: uiUsuarioSlice.reducer,

        /* Dashboard */
        dashResumenKPI: dashResumenKPISlice.reducer,
        dashHuespedesGananciasMes: dashHuespedesGananciasMesSlice.reducer,
        dashRankingProductos: dashRankingProductosSlice.reducer,


        dashGastosDanios: dashGastosDaniosSlice.reducer,
        dashHuespedes: dashHuespedesSlice.reducer,
        dashIngresosPorDepartamento: dashIngresosPorDepartamentoSlice.reducer,
        dashIngresosTotales: dashIngresosTotalesSlice.reducer,
        dashIvaRecaudado: dashIvaRecaudadoSlice.reducer,
        dashOcupacionActual: dashOcupacionActualSlice.reducer,

        /* Roles */
        role: roleSlice.reducer,

        /* Provincia */
        provincia: provinciaSlice.reducer,

        /* Header Menu */
        uiHeaderMenu: uiHeaderMenuSlice.reducer,

        /* categorias */
        categoria: categoriaSlice.reducer,
        uiCategoria: uiCategoriaSlice.reducer,

        /* Servicios */
        servicio: servicioSlice.reducer,
        uiServicio: uiServicioSlice.reducer,

        /* Configuracion Ivas */
        configuracionIva: configuracionIvaSlice.reducer,
        uiConfiguracionIva: uiConfiguracionIvaSlice.reducer,

        /* Departamentos */
        departamento: departamentoSlice.reducer,
        tipoDepartamento: tipoDepartamentoSlice.reducer,
        uiDepartamento: uiDepartamentoSlice.reducer,

        /* Huespedes */
        huesped: huespedSlice.reducer,
        uiHuesped: uiHuespedSlice.reducer,

        /* Inventario */
        inventario: inventarioSlice.reducer,
        uiInventario: uiInventarioSlice.reducer,

        /* Reservas */
        reserva: reservaSlice.reducer,
        uiReserva: uiReservaSlice.reducer,

        /* Consumos */
        consumo: consumoSlice.reducer,
        uiConsumo: uiConsumoSlice.reducer,

        /* Tipos de dano */
        tiposDano: tiposDanoSlice.reducer,

        /* Gastos */
        gasto: gastoSlice.reducer,
        uiGasto: uiGastoSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
