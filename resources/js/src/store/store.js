import { configureStore } from "@reduxjs/toolkit";
import {
    authSlice,
    calendarioSlice,
    categoriaSlice,
    clienteFacturacionSlice,
    conceptoPagoSlice,
    configuracionIvaSlice,
    consumoSlice,
    //dashGastosDaniosSlice,
    dashHuespedesGananciasMesSlice,
    dashHuespedesSlice,
    dashIngresosPorDepartamentoSlice,
    //dashIngresosTotalesSlice,
    //dashIvaRecaudadoSlice,
    //dashOcupacionActualSlice,
    dashRankingProductosSlice,
    dashResumenKPISlice,
    departamentoSlice,
    estadiaSlice,
    facturaSlice,
    gastoSlice,
    huespedSlice,
    inventarioSlice,
    limpiezaSlice,
    pagoSlice,
    provinciaSlice,
    reservaSlice,
    roleSlice,
    secuenciaFacturaSlice,
    servicioSlice,
    storageFieldsSlice,
    tipoDepartamentoSlice,
    tiposDanoSlice,
    uiCategoriaSlice,
    uiClienteFacturacionSlice,
    uiConfiguracionIvaSlice,
    uiConsumoSlice,
    uiDepartamentoSlice,
    uiEstadiaSlice,
    uiFacturaSlice,
    uiGastoSlice,
    uiHeaderMenuSlice,
    uiHuespedSlice,
    uiInventarioSlice,
    uiLimpiezaSlice,
    uiPagoSlice,
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
        dashIngresosPorDepartamento: dashIngresosPorDepartamentoSlice.reducer,
        dashHuespedes: dashHuespedesSlice.reducer,

        //dashGastosDanios: dashGastosDaniosSlice.reducer,
        //dashIngresosTotales: dashIngresosTotalesSlice.reducer,
        //dashIvaRecaudado: dashIvaRecaudadoSlice.reducer,
        //dashOcupacionActual: dashOcupacionActualSlice.reducer,

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

        /* Estadias */
        estadia: estadiaSlice.reducer,
        uiEstadia: uiEstadiaSlice.reducer,

        /* Consumos */
        consumo: consumoSlice.reducer,
        uiConsumo: uiConsumoSlice.reducer,

        /* Tipos de dano */
        tiposDano: tiposDanoSlice.reducer,

        /* Gastos */
        gasto: gastoSlice.reducer,
        uiGasto: uiGastoSlice.reducer,

        /* Conceptos de Pago */
        conceptoPago: conceptoPagoSlice.reducer,

        /* Pagos */
        pago: pagoSlice.reducer,
        uiPago: uiPagoSlice.reducer,

        /* Limpieza */
        limpieza: limpiezaSlice.reducer,
        uiLimpieza: uiLimpiezaSlice.reducer,

        /* Calendario - Reservas */
        calendario: calendarioSlice.reducer,

        /* Facturacion */
        facturacion: facturaSlice.reducer,
        clienteFacturacion: clienteFacturacionSlice.reducer,
        secuenciaFactura: secuenciaFacturaSlice.reducer,
        uiFactura: uiFacturaSlice.reducer,
        uiClienteFacturacion: uiClienteFacturacionSlice.reducer,

        /* Storage */
        storageFields: storageFieldsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
