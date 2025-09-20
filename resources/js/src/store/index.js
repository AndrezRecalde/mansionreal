/* Autenticacion */
import { authSlice } from "./auth/authSlice";

/* Header Menu */
import { uiHeaderMenuSlice } from "./layout/uiHeaderMenuSlice";

/* Usuario */
import { usuarioSlice } from "./usuario/usuarioSlice";
import { uiUsuarioSlice } from "./usuario/uiUsuarioSlice";

/* Dashboard */
import { dashResumenKPISlice } from "./dashboard/dashResumenKPISlice";
import { dashHuespedesGananciasMesSlice } from "./dashboard/dashHuespedesGananciasMesSlice";

import { dashGastosDaniosSlice } from "./dashboard/dashGastosDaniosSlice";
import { dashHuespedesSlice } from "./dashboard/dashHuespedesSlice";
import { dashIngresosPorDepartamentoSlice } from "./dashboard/dashIngresosPorDepartamentoSlice";
import { dashIngresosTotalesSlice } from "./dashboard/dashIngresosTotalesSlice";
import { dashIvaRecaudadoSlice } from "./dashboard/dashIvaRecaudadoSlice";
import { dashOcupacionActualSlice } from "./dashboard/dashOcupacionActualSlice";
import { dashRankingProductosSlice } from "./dashboard/dashRankingProductosSlice";

/* Roles */
import { roleSlice } from "./role/roleSlice";

/* Provincias */
import { provinciaSlice } from "./provincia/provinciaSlice";

/* Categoria */
import { categoriaSlice } from "./categoria/categoriaSlice";
import { uiCategoriaSlice } from "./categoria/uiCategoriaSlice";

/* Servicios */
import { servicioSlice } from "./servicio/servicioSlice";
import { uiServicioSlice } from "./servicio/uiServicioSlice";

/* Configuracion Ivas */
import { configuracionIvaSlice } from "./configuracion/configuracionIvaSlice";
import { uiConfiguracionIvaSlice } from "./configuracion/uiConfiguracionIvaSlice";

/* Departamentos */
import { departamentoSlice } from "./departamento/departamentoSlice";
import { tipoDepartamentoSlice } from "./departamento/tipoDepartamentoSlice";
import { uiDepartamentoSlice } from "./departamento/uiDepartamentoSlice";

/* Huespedes */
import { huespedSlice } from "./huesped/huespedSlice";
import { uiHuespedSlice } from "./huesped/uiHuespedSlice";

/* Inventario */
import { inventarioSlice } from "./inventario/inventarioSlice";
import { uiInventarioSlice } from "./inventario/uiInventarioSlice";

/* Reservas */
import { reservaSlice } from "./reserva/reservaSlice";
import { uiReservaSlice } from "./reserva/uiReservaSlice";

/* Consumos */
import { consumoSlice } from "./consumo/consumoSlice";
import { uiConsumoSlice } from "./consumo/uiConsumoSlice";

/* Tipos de dano */
import { tiposDanoSlice } from "./tiposDano/tiposDanoSlice";

/* Gastos */
import { gastoSlice } from "./gasto/gastoSlice";
import { uiGastoSlice } from "./gasto/uiGastoSlice";

export {
    /* Autenticacion */
    authSlice,

    /* Header Menu */
    uiHeaderMenuSlice,

    /* Usuario */
    usuarioSlice,
    uiUsuarioSlice,

    /* Dashboard */
    dashResumenKPISlice,
    dashHuespedesGananciasMesSlice,

    /** ======== */
    dashGastosDaniosSlice,
    dashHuespedesSlice,
    dashIngresosPorDepartamentoSlice,
    dashIngresosTotalesSlice,
    dashIvaRecaudadoSlice,
    dashOcupacionActualSlice,
    dashRankingProductosSlice,

    /* Roles */
    roleSlice,

    /* Provincias */
    provinciaSlice,

    /* Categoria */
    categoriaSlice,
    uiCategoriaSlice,

    /* Servicios */
    servicioSlice,
    uiServicioSlice,

    /* Configuracion Ivas */
    configuracionIvaSlice,
    uiConfiguracionIvaSlice,

    /* Departamento */
    departamentoSlice,
    tipoDepartamentoSlice,
    uiDepartamentoSlice,

    /* Huesped */
    huespedSlice,
    uiHuespedSlice,

    /* Inventario */
    inventarioSlice,
    uiInventarioSlice,

    /* Reserva */
    reservaSlice,
    uiReservaSlice,

    /* Consumo */
    consumoSlice,
    uiConsumoSlice,

    /* Tipos de dano */
    tiposDanoSlice,

    /* Gasto */
    gastoSlice,
    uiGastoSlice,
};
