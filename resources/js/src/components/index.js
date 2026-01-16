/* Elements: Loader */
import { CssLoader } from "./elements/loader/CssLoader";
import { LoadingSkeleton } from "./elements/loader/LoadingSkeleton";
/* Elements: Logo */
import { Logo } from "./elements/logo/Logo";
/* Elemnsts: Botones */
import {
    BtnSection,
    BtnSubmit,
    BtnAddActions,
} from "./elements/buttons/BtnServices";
/* Elements: Titulos */
import { TextSection } from "./elements/titles/TextSection";
import { TitlePage } from "./elements/titles/TitlePage";
/* Elements: AlertSection */
import { AlertSection } from "./elements/alert/AlertSection";
/* Elements: Menu de tables */
import {
    MenuTable_EA,
    MenuUsersTable,
    MenuTable_DEPT,
    MenuTable_RESERVA,
    MenuTable_EE,
    MenuTableFactura,
} from "./elements/table/MenuTable";
/* Elements: Contenido de tabla */
import { ContenidoTable } from "./elements/table/ContenidoTable";
/* Elements: Boton de Activacion */
import { BtnActivarElemento } from "./elements/buttons/BtnActivarElemento";
/* Elements: Activar Elemento */
import { ActivarElementoModal } from "./elements/modal/ActivarElementoModal";
import { ActivarElementoForm } from "./elements/modal/ActivarElementoForm";
/* Elements: Filtrar por fechas */
import { FiltrarPorFechasForm } from "./elements/filter/FiltrarPorFechasForm";
/* Elements: Filtrar por Fechas y codigo */
import { FiltrarPorFechasCodigo } from "./elements/filter/FiltrarPorFechasCodigo";
/* Elements: Filtrar disponibilidad departamentos */
import { FiltroDisponibilidad } from "./elements/filter/FiltroDisponibilidad";
/* Elements: Filtrar por Gerentes */
import { FiltrarPorGerentes } from "./elements/filter/FiltrarPorGerentes";
/* Elements: Contenido de TABS */
import { TabContent } from "./elements/tabs/TabContent";
import { TabContentDisponibilidad } from "./elements/tabs/TabContentDisponibilidad";

/* Autenticacion */
import { AuthForm } from "./auth/AuthForm";

/* Usuario */
import { ContrasenaForm } from "./usuario/password/ContrasenaForm";
import { UsuarioModal } from "./usuario/modal/UsuarioModal";
import { UsuarioForm } from "./usuario/form/UsuarioForm";
import { UsuarioTable } from "./usuario/table/UsuarioTable";
import { ReportesPagosTable } from "./usuario/table/ReportesPagosTable";
import { ResetearPwdModal } from "./usuario/modal/ResetearPwdModal";
import { ResetearPwdForm } from "./usuario/form/ResetearPwdForm";

/* Categorias */
import { CategoriaModal } from "./categoria/modal/CategoriaModal";
import { CategoriaForm } from "./categoria/form/CategoriaForm";
import { CategoriaTable } from "./categoria/table/CategoriaTable";

/* Servicios */
import { ServicioTable } from "./servicio/table/ServicioTable";
import { ServicioModal } from "./servicio/modal/ServicioModal";
import { ServicioForm } from "./servicio/form/ServicioForm";

/* Configuracion Iva */
import { ConfigIvaTable } from "./iva/table/ConfigIvaTable";
import { ConfigIvaModal } from "./iva/modal/ConfigIvaModal";
import { ConfigIvaForm } from "./iva/form/ConfigIvaForm";

/* Huespedes */
import { HuespedTable } from "./huesped/table/HuespedTable";
import { HuespedModal } from "./huesped/modal/HuespedModal";
import { HuespedForm } from "./huesped/form/HuespedForm";

/* Inventario - Productos */
import { InventarioTable } from "./inventario/table/InventarioTable";
import { InventarioModal } from "./inventario/modal/InventarioModal";
import { InventarioForm } from "./inventario/form/InventarioForm";
import { InventarioBusquedaForm } from "./inventario/form/InventarioBusquedaForm";
import { InventarioAgregarStockModal } from "./inventario/modal/InventarioAgregarStockModal";
import { InventarioStockForm } from "./inventario/form/InventarioStockForm";

/* Reservas */
import { DisponibilidadCards } from "./reserva/section/DisponibilidadCards";
import { ReservarDepartamentoModal } from "./reserva/modal/ReservarDepartamentoModal";
import { ReservarDepartamentoForm } from "./reserva/form/ReservarDepartamentoForm";
import { ReservarBusquedaClienteSection } from "./reserva/section/ReservarBusquedaClienteSection";
import { ReservarBusquedaClienteForm } from "./reserva/form/ReservarBusquedaClienteForm";
import { ReservarDatosClienteForm } from "./reserva/form/ReservarDatosClienteForm";
import { ReservarDatosReservaSection } from "./reserva/section/ReservarDatosReservaSection";
import { DisponibilidadTable } from "./reserva/section/DisponibilidadTable";
import { DetalleReservaTable } from "./reserva/table/DetalleReservaTable";
import { ReservaAccionesTable } from "./reserva/table/ReservaAccionesTable";
import { ReservaInfoHuespedTable } from "./reserva/table/ReservaInfoHuespedTable";
import { ReservaModals } from "./reserva/modal/ReservaModals";

/* Reservas: Consultar Reservas */
import { ConsultarReservaSection } from "./reserva/section/ConsultarReservaSection";
import { ConsultaClientesTable } from "./reserva/table/ConsultaClientesTable";
import { ReservasInformacionTable } from "./reserva/table/ReservasInformacionTable";
import { BtnExportacionPDF } from "./reserva/btn/BtnExportacionPDF";

/* Reservas Finalizar Estado */
import { ReservaFinalizarModal } from "./reserva/modal/ReservaFinalizarModal";
import { ReservaFinalizarForm } from "./reserva/form/ReservaFinalizarForm";

/* Reservas Cancelar Estado */
import { ReservaCancelarModal } from "./reserva/modal/ReservaCancelarModal";
import { ReservaCancelarForm } from "./reserva/form/ReservaCancelarForm";

/* Reservas de Estadias */
import { EstadiasReservadasCards } from "./reserva/cards/EstadiasReservadasCards";
import { ConsultarEstadiasSection } from "./reserva/section/ConsultarEstadiasSection";

/* Facturacion */
import { ClienteFacturacionForm } from "./facturacion/form/ClienteFacturacionForm";
import { FacturasTable } from "./facturacion/table/FacturasTable";
import { FacturaDetalleModal } from "./facturacion/modal/FacturaDetalleModal";
import { FacturaAnularModal } from "./facturacion/modal/FacturaAnularModal";
import { VisorFacturaPDF } from "./facturacion/modal/VisorFacturaPDF";

/* Finalizar Reserva */
import { ReservaFinalizarStepper } from "./reserva/form/ReservaFinalizarStepper";
import { ReservaValidacionStep } from "./reserva/steps/ReservaValidacionStep";
import { ReservaFacturacionStep } from "./reserva/steps/ReservaFacturacionStep";
import { ReservaConfirmacionStep } from "./reserva/steps/ReservaConfirmacionStep";

/* Consumos */
import { ConsumosDrawer } from "./consumo/drawer/ConsumosDrawer";
import { ConsumosDrawerTable } from "./consumo/table/ConsumosDrawerTable";
import { ConsumoModal } from "./consumo/modal/ConsumoModal";
import { ConsumosInformacionTable } from "./consumo/table/ConsumosInformacionTable";
import { ConsumosDetalleTable } from "./consumo/table/ConsumosDetalleTable";
import { ConsumosTotalTable } from "./consumo/table/ConsumosTotalTable";
import { ConsumoEditarModal } from "./consumo/modal/ConsumoEditarModal";
import { ConsumoEliminarModal } from "./consumo/modal/ConsumoEliminarModal";
import { ConsumoEditarForm } from "./consumo/form/ConsumoEditarForm";
import { ConsumoEliminarForm } from "./consumo/form/ConsumoEliminarForm";
import { ConsumoForm } from "./consumo/form/ConsumoForm";
import { ConsumoCard } from "./consumo/section/ConsumoCard";

/* Gastos de Danos */
import { GastoDrawerTable } from "./gasto/table/GastoDrawerTable";
import { GastoModal } from "./gasto/modal/GastoModal";
import { GastoForm } from "./gasto/form/GastoForm";
import { GastoEliminarModal } from "./gasto/modal/GastoEliminarModal";
import { GastoEliminarForm } from "./gasto/form/GastoEliminarForm";

/* Departamentos */
import { DepartamentoTable } from "./departamento/table/DepartamentoTable";
import { DepartamentoModal } from "./departamento/modal/DepartamentoModal";
import { DepartamentoForm } from "./departamento/form/DepartamentoForm";
import { DepartamentoDrawer } from "./departamento/drawer/DepartamentoDrawer";
import { DepartamentoServiciosForm } from "./departamento/form/DepartamentoServiciosForm";
import { DepartamentosDisponiblesCards } from "./departamento/cards/DepartamentosDisponiblesCards";

/* Departamentos para Disponibilidad */
import { accionesDepartamento } from "./departamento/features/accionesDepartamento";
import { DepartamentoMenu } from "./departamento/menu/DepartamentoMenu";
import { ReservaMenu } from "./departamento/menu/ReservaMenu";
import { useDisponibilidadColumns } from "./departamento/table/useDisponibilidadColumns";

/* Pagos */
import { PagoModal } from "./pago/modal/PagoModal";
import { PagoEditarModal } from "./pago/modal/PagoEditarModal";
import { PagoForm } from "./pago/form/PagoForm";
import { PagoEditarForm } from "./pago/form/PagoEditarForm";
import { PagosTable } from "./pago/table/PagosTable";
import { PagosTotalesReserva } from "./pago/table/PagosTotalesReserva";
import { PagosHistorialTable } from "./pago/table/PagosHistorialTable";
import { PagoEliminarModal } from "./pago/modal/PagoEliminarModal";
import { PagoEliminarForm } from "./pago/form/PagoEliminarForm";

/* Limpieza */
import { LimpiezaModal } from "./limpieza/modal/LimpiezaModal";
import { LimpiezaForm } from "./limpieza/form/LimpiezaForm";
import { LimpiezaTable } from "./limpieza/table/LimpiezaTable";

/* Calendario - Reservas */
import { CalendarioReservas } from "./calendario/section/CalendarioReservas";
import { InformacionReservaModal } from "./calendario/modal/InformacionReservaModal";
import { CalendarioHeader } from "./calendario/section/CalendarioHeader";
import { CalendarioGrid } from "./calendario/section/CalendarioGrid";
import { CalendarioKPIs } from "./calendario/section/CalendarioKPIs";
import { CalendarioMobileView } from "./calendario/section/CalendarioMobileView";
import { EventosDrawer } from "./calendario/eventos/EventosDrawer";

/* Reportes Consumos */
import { ReporteProductosTable } from "./consumo/section/ReporteProductosTable";
import { ReporteConsolidadoTable } from "./consumo/section/ReporteConsolidadoTable";
import { MetadatosSection } from "./consumo/section/MetadatosSection";
import { TotalesGeneralesSection } from "./consumo/section/TotalesGeneralesSection";
import { ReporteConsumosVisualizacion } from "./consumo/section/ReporteConsumosVisualizacion";

export {
    /* Elements */
    CssLoader,
    LoadingSkeleton,
    BtnSection,
    BtnSubmit,
    BtnAddActions,
    Logo,
    TextSection,
    TitlePage,
    AlertSection,
    MenuTable_EA,
    MenuUsersTable,
    MenuTable_DEPT,
    MenuTable_RESERVA,
    MenuTable_EE,
    MenuTableFactura,
    ContenidoTable,
    BtnActivarElemento,
    ActivarElementoModal,
    ActivarElementoForm,
    FiltrarPorFechasForm,
    FiltrarPorFechasCodigo,
    FiltroDisponibilidad,
    FiltrarPorGerentes,
    TabContent,
    TabContentDisponibilidad,

    /* Autenticacion */
    AuthForm,

    /* Usuario */
    ContrasenaForm,
    UsuarioModal,
    UsuarioForm,
    UsuarioTable,
    ReportesPagosTable,
    ResetearPwdModal,
    ResetearPwdForm,

    /* Categorias */
    CategoriaModal,
    CategoriaForm,
    CategoriaTable,

    /* Servicios */
    ServicioTable,
    ServicioModal,
    ServicioForm,

    /* Configuracion Iva */
    ConfigIvaTable,
    ConfigIvaModal,
    ConfigIvaForm,

    /* Huespedes */
    HuespedTable,
    HuespedModal,
    HuespedForm,

    /* Inventario - Productos */
    InventarioTable,
    InventarioModal,
    InventarioForm,
    InventarioBusquedaForm,
    InventarioAgregarStockModal,
    InventarioStockForm,

    /* Reservas */
    DisponibilidadCards,
    ReservarDepartamentoModal,
    ReservarDepartamentoForm,
    ReservarBusquedaClienteSection,
    ReservarBusquedaClienteForm,
    ReservarDatosClienteForm,
    ReservarDatosReservaSection,
    DisponibilidadTable,
    DetalleReservaTable,
    ReservaAccionesTable,
    ReservaInfoHuespedTable,
    ReservaModals,

    /* Reservas: Consultar Reservas */
    ConsultarReservaSection,
    ConsultaClientesTable,
    ReservasInformacionTable,
    BtnExportacionPDF,

    /* Reservas Finalizar Estado */
    ReservaFinalizarModal,
    ReservaFinalizarForm,

    /* Reservas Cancelar Estado */
    ReservaCancelarModal,
    ReservaCancelarForm,

    /* Reservas de Estadias */
    EstadiasReservadasCards,
    ConsultarEstadiasSection,

    /* Facturacion */
    ClienteFacturacionForm,
    FacturasTable,
    FacturaDetalleModal,
    FacturaAnularModal,
    VisorFacturaPDF,

    /* Finalizar Reserva */
    ReservaFinalizarStepper,
    ReservaValidacionStep,
    ReservaFacturacionStep,
    ReservaConfirmacionStep,

    /* Consumos */
    ConsumosDrawer,
    ConsumoModal,
    ConsumosDrawerTable,
    ConsumosInformacionTable,
    ConsumosDetalleTable,
    ConsumosTotalTable,
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoEditarForm,
    ConsumoEliminarForm,
    ConsumoForm,
    ConsumoCard,

    /* Gastos */
    GastoDrawerTable,
    GastoModal,
    GastoForm,
    GastoEliminarModal,
    GastoEliminarForm,

    /* Departamentos */
    DepartamentoTable,
    DepartamentoModal,
    DepartamentoForm,
    DepartamentoDrawer,
    DepartamentoServiciosForm,
    DepartamentosDisponiblesCards,

    /* Departamentos para Disponibilidad */
    DepartamentoMenu,
    ReservaMenu,
    useDisponibilidadColumns,
    accionesDepartamento,

    /* Pagos */
    PagoModal,
    PagoEditarModal,
    PagoForm,
    PagoEditarForm,
    PagosTable,
    PagosTotalesReserva,
    PagosHistorialTable,
    PagoEliminarModal,
    PagoEliminarForm,

    /* Limpieza */
    LimpiezaModal,
    LimpiezaForm,
    LimpiezaTable,

    /* Calendario - Reservas */
    CalendarioReservas,
    InformacionReservaModal,
    CalendarioHeader,
    CalendarioGrid,
    CalendarioKPIs,
    CalendarioMobileView,
    EventosDrawer,

    /* Consumos Reportes */
    ReporteProductosTable,
    ReporteConsolidadoTable,
    MetadatosSection,
    TotalesGeneralesSection,
    ReporteConsumosVisualizacion,
};
