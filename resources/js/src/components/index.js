/* Elements: Loader */
import { CssLoader } from "./elements/loader/CssLoader";
/* Elements: Logo */
import { Logo } from "./elements/logo/Logo";
/* Elemnsts: Botones */
import { BtnSection, BtnSubmit } from "./elements/buttons/BtnServices";
/* Elements: Titulos */
import { TextSection } from "./elements/titles/TextSection";
import { TitlePage } from "./elements/titles/TitlePage";
/* Elements: AlertSection */
import { AlertSection } from "./elements/alert/AlertSection";
/* Elements: Menu de tables */
import { MenuTable_EA, MenuTable_DEPT, MenuTable_RESERVA, MenuTable_EE } from "./elements/table/MenuTable";
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

/* Autenticacion */
import { AuthForm } from "./auth/AuthForm";

/* Usuario */
import { ContrasenaForm } from "./usuario/password/ContrasenaForm";
import { UsuarioModal } from "./usuario/modal/UsuarioModal";
import { UsuarioForm } from "./usuario/form/UsuarioForm";
import { UsuarioTable } from "./usuario/table/UsuarioTable";

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

/* Reservas: Consultar Reservas */
import { ConsultarReservaSection } from "./reserva/section/ConsultarReservaSection";
import { ConsultaClientesTable } from "./reserva/table/ConsultaClientesTable";
import { ReservasInformacionTable } from "./reserva/table/ReservasInformacionTable";

/* Reservas Finalizar Estado */
import { ReservaFinalizarModal } from "./reserva/modal/ReservaFinalizarModal";
import { ReservaFinalizarForm } from "./reserva/form/ReservaFinalizarForm";

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

/* Gastos de Danos */
import { GastoDrawerTable } from "./gasto/table/GastoDrawerTable";
import { GastoModal } from "./gasto/modal/GastoModal";
import { GastoForm } from "./gasto/form/GastoForm";

/* Departamentos */
import { DepartamentoTable } from "./departamento/table/DepartamentoTable";
import { DepartamentoModal } from "./departamento/modal/DepartamentoModal";
import { DepartamentoForm } from "./departamento/form/DepartamentoForm";
import { DepartamentoDrawer } from "./departamento/drawer/DepartamentoDrawer";
import { DepartamentoServiciosForm } from "./departamento/form/DepartamentoServiciosForm";
import { DepartamentosDisponiblesCards } from "./departamento/cards/DepartamentosDisponiblesCards";

/* Departamentos para Disponibilidad */
import { accionesDepartamento } from "./departamento/features/accionesDepartamento";
import { getEstadoColor } from "./departamento/helpers/getEstadoColor";
import { DepartamentoMenu } from "./departamento/menu/DepartamentoMenu";
import { ReservaMenu } from "./departamento/menu/ReservaMenu";
import { useDisponibilidadColumns } from "./departamento/table/useDisponibilidadColumns";

export {
    /* Elements */
    CssLoader,
    BtnSection,
    BtnSubmit,
    Logo,
    TextSection,
    TitlePage,
    AlertSection,
    MenuTable_EA,
    MenuTable_DEPT,
    MenuTable_RESERVA,
    MenuTable_EE,
    ContenidoTable,
    BtnActivarElemento,
    ActivarElementoModal,
    ActivarElementoForm,
    FiltrarPorFechasForm,
    FiltrarPorFechasCodigo,
    FiltroDisponibilidad,

    /* Autenticacion */
    AuthForm,

    /* Usuario */
    ContrasenaForm,
    UsuarioModal,
    UsuarioForm,
    UsuarioTable,

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

    /* Reservas: Consultar Reservas */
    ConsultarReservaSection,
    ConsultaClientesTable,
    ReservasInformacionTable,

    /* Reservas Finalizar Estado */
    ReservaFinalizarModal,
    ReservaFinalizarForm,

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

    /* Gastos */
    GastoDrawerTable,
    GastoModal,
    GastoForm,

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
    getEstadoColor,
};
