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

/* Consumo */
import { useConsumoStore } from "./consumo/useConsumoStore";
import { useUiConsumo } from "./consumo/useUiConsumo";

/* Gastos */
import { useGastoStore } from "./gasto/useGastoStore";
import { useUiGasto } from "./gasto/useUiGasto";

/* Tipos de dano */
import { useTiposDanoStore } from "./tiposDano/useTiposDanoStore";

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

    /* Consumo */
    useConsumoStore,
    useUiConsumo,

    /* Gastos */
    useGastoStore,
    useUiGasto,

    /* Tipos de dano */
    useTiposDanoStore,

    /* Storage Fields */
    useStorageField,
}
