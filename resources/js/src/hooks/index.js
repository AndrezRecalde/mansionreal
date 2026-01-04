/* Autenticacion */
import { useAuthStore } from "./auth/useAuthStore";

/* Layout Header Menu */
import { useUiHeaderMenu } from "./layout/useUiHeaderMenu";

/* Ayudas */
import { useTitleHook } from "./title/useTitleHook";

/* Dashboard */
import { useDashboardKPIStore } from "./dashboard/useDashboardKPIStore";
import { useDashHuepedGananciaStore } from "./dashboard/useDashHuepedGananciaStore";
import { useDashHuespedStore } from "./dashboard/useDashHuespedStore";
import { useDashIngresosPorDepartamentoStore } from "./dashboard/useDashIngresosPorDepartamentoStore";
import { useDashRankingProductosStore } from "./dashboard/useDashRankingProductosStore";

/* Usuario */
import { useUsuarioStore } from "./usuario/useUsuarioStore";
import { useUiUsuario } from "./usuario/useUiUsuario";

/* Roles */
import { useRoleStore } from "./role/useRoleStore";

/* Provincia */
import { useProvinciaStore } from "./provincia/useProvinciaStore";

/* Servicio */
import { useServicioStore } from "./servicio/useServicioStore";
import { useUiServicio } from "./servicio/useUiServicio";

/* Categorias */
import { useCategoriaStore } from "./categoria/useCategoriaStore";
import { useUiCategoria } from "./categoria/useUiCategoria";

/* Departamentos */
import { useDepartamentoStore } from "./departamento/useDepartamentoStore";
import { useUiDepartamento } from "./departamento/useUiDepartamento";

/* Tipos departamentos */
import { useTipoDepartamentoStore } from "./departamento/tipo_departamento/useTipoDepartamentoStore";

/* Huespedes */
import { useHuespedStore } from "./huesped/useHuespedStore";
import { useUiHuesped } from "./huesped/useUiHuesped";

/* Configuraciones de Ivas */
import { useConfiguracionIvaStore } from "./configuracion/useConfiguracionIvaStore";
import { useUiConfiguracionIva } from "./configuracion/useUiConfiguracionIva";

/* Inventario - Productos */
import { useInventarioStore } from "./inventario/useInventarioStore";
import { useUiInventario } from "./inventario/useUiInventario";

/* Reserva */
import { useReservaDepartamentoStore } from "./reserva/useReservaDepartamentoStore";
import { useUiReservaDepartamento } from "./reserva/useUiReservaDepartamento";

/* Estadia */
import { useEstadiaStore } from "./reserva/useEstadiaStore";

/* Consumo */
import { useConsumoStore } from "./consumo/useConsumoStore";
import { useUiConsumo } from "./consumo/useUiConsumo";
import { useConsumoForm } from "./consumo/useConsumoForm";
import { MAX_CONSUMOS, INITIAL_CONSUMO, MODAL_CONFIG } from "./consumo/consumo";

/* Gastos */
import { useGastoStore } from "./gasto/useGastoStore";
import { useUiGasto } from "./gasto/useUiGasto";

/* Conceptos de Pago */
import { useConceptoPagoStore } from "./pago/useConceptoPagoStore";

/* Pagos */
import { usePagoStore } from "./pago/usePagoStore";
import { useUiPago } from "./pago/useUiPago";

/* Tipos de dano */
import { useTiposDanoStore } from "./tiposDano/useTiposDanoStore";

/* Limpiezas */
import { useLimpiezaStore } from "./limpieza/useLimpiezaStore";
import { useUiLimpieza } from "./limpieza/useUiLimpieza";

/* Calendario - Reservas */
import { useCalendarioStore } from "./calendario/useCalendarioStore";

/* Storage Fields */
import { useStorageField } from "./storage/useStorageField";

export {
    useAuthStore,

    /* Header Menu */
    useUiHeaderMenu,

    /* Meta title */
    useTitleHook,

    /* Dashboard */
    useDashboardKPIStore,
    useDashHuepedGananciaStore,
    useDashHuespedStore,
    useDashIngresosPorDepartamentoStore,
    useDashRankingProductosStore,

    /* Usuario */
    useUsuarioStore,
    useUiUsuario,

    /* Roles */
    useRoleStore,

    /* Provincia */
    useProvinciaStore,

    /* Servicio */
    useServicioStore,
    useUiServicio,

    /* Categoria */
    useCategoriaStore,
    useUiCategoria,

    /* Departamento */
    useDepartamentoStore,
    useUiDepartamento,

    /* Tipo Departamento */
    useTipoDepartamentoStore,

    /* Huespedes */
    useHuespedStore,
    useUiHuesped,

    /* Configuraciones de Ivas */
    useConfiguracionIvaStore,
    useUiConfiguracionIva,

    /* Inventario - Productos */
    useInventarioStore,
    useUiInventario,

    /* Reserva */
    useReservaDepartamentoStore,
    useUiReservaDepartamento,

    /* Estadia */
    useEstadiaStore,

    /* Consumo */
    useConsumoStore,
    useUiConsumo,
    useConsumoForm,
    MAX_CONSUMOS,
    INITIAL_CONSUMO,
    MODAL_CONFIG,

    /* Gastos */
    useGastoStore,
    useUiGasto,

    /* Conceptos de Pago */
    useConceptoPagoStore,

    /* Pagos */
    usePagoStore,
    useUiPago,

    /* Tipos de dano */
    useTiposDanoStore,

    /* Limpiezas */
    useLimpiezaStore,
    useUiLimpieza,

    /* Calendario - Reservas */
    useCalendarioStore,

    /* Storage Fields */
    useStorageField,
};
