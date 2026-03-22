import { useDispatch, useSelector } from "react-redux";
import {
    rtkCargando,
    rtkSetTurnoActivo,
    rtkSetCajasDisponibles,
    rtkSetTurnosHistorial,
    rtkSetReporteCierre,
    rtkSetModalApertura,
    rtkSetModalCierre,
    rtkSetModalMovimiento,
    rtkClearCajasData,
    rtkSetCajasData,
    rtkSetActivaCaja,
    rtkSetModalCajaCRUD,
    rtkCargarErrores,
    rtkCargarMensaje,
} from "../../store/cajas/cajasSlice";
import { useErrorException } from "../error/useErrorException";
import apiAxios from "../../api/apiAxios";

export const useCajasStore = () => {
    const dispatch = useDispatch();
    const {
        cargando,
        turnoActivo,
        cajasDisponibles,
        turnosHistorial,
        reporteCierre,
        isAperturaModalOpen,
        isCierreModalOpen,
        isMovimientoModalOpen,

        cajasData,
        activaCaja,
        isCajaModalOpen,
        mensaje,
        errores,
    } = useSelector((state) => state.cajas);
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const checkMiTurno = async () => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.get(
                "/general/turnos-caja/mi-turno",
            );
            dispatch(rtkSetTurnoActivo(data.turno || null));
            dispatch(rtkSetCajasDisponibles(data.cajas || []));

            // Si no tiene turno abierto, forzar modal apertura
            if (!data.turno) {
                dispatch(rtkSetModalApertura(true));
            }
        } catch (error) {
            console.error("Error verificando turno", error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAbrirTurno = async (formData) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.post(
                "/general/turnos-caja/abrir",
                formData,
            );
            dispatch(rtkSetTurnoActivo(data.turno));
            dispatch(rtkSetModalApertura(false));
            dispatch(rtkCargarMensaje({ msg: "Caja Abierta Exitosamente" }));
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 2000);
            return true;
        } catch (error) {
            ExceptionMessageError(error);
            return false;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCrearMovimiento = async (formData) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.post(
                "/general/turnos-caja/movimientos",
                formData,
            );
            dispatch(rtkSetModalMovimiento(false));
            dispatch(rtkCargarMensaje(data.msg));
            setTimeout(() => dispatch(rtkCargarMensaje(undefined)), 2000);
            return true;
        } catch (error) {
            ExceptionMessageError(error);
            return false;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnObtenerReporteCierre = async () => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.get(
                "/general/turnos-caja/reporte-cierre",
            );
            dispatch(rtkSetReporteCierre(data));
            return data;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
            //dispatch(rtkSetModalCierre(false));
        }
    };

    const fnCerrarTurno = async (montoDeclarado) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.post(
                "/general/turnos-caja/cerrar",
                {
                    monto_cierre_efectivo_declarado: montoDeclarado,
                },
            );
            dispatch(rtkSetTurnoActivo(null));
            dispatch(rtkSetModalCierre(false));
            return { msg: data.msg, status: true };
        } catch (error) {
            ExceptionMessageError(error);
            return { status: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCargarHistorial = async (filtros = {}) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.get(
                "/general/turnos-caja/historial",
                { params: filtros },
            );
            dispatch(rtkSetTurnosHistorial(data.turnos || []));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCargarCajasCRUD = async () => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.get("/general/cajas");
            dispatch(rtkSetCajasData(data.cajas || []));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCrearCaja = async (formData) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.post("/general/cajas", formData);
            fnCargarCajasCRUD();
            dispatch(rtkSetModalCajaCRUD(false));
            return { msg: data.msg, status: true };
        } catch (error) {
            ExceptionMessageError(error);
            return { status: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnActualizarCaja = async (id, formData) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.put(
                `/general/cajas/${id}`,
                formData,
            );
            fnCargarCajasCRUD();
            dispatch(rtkSetModalCajaCRUD(false));
            return { msg: data.msg, status: true };
        } catch (error) {
            ExceptionMessageError(error);
            return { status: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnActivarCaja = async (id) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.patch(
                `/general/cajas/${id}/toggle`,
            );
            fnCargarCajasCRUD();
            return { msg: data.msg, status: true };
        } catch (error) {
            ExceptionMessageError(error);
            return { status: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnEliminarCaja = async (id) => {
        dispatch(rtkCargando(true));
        try {
            const { data } = await apiAxios.delete(`/general/cajas/${id}`);
            fnCargarCajasCRUD();
            return { msg: data.msg, status: true };
        } catch (error) {
            ExceptionMessageError(error);
            return { status: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    return {
        cargando,
        turnoActivo,
        cajasDisponibles,
        turnosHistorial,
        reporteCierre,
        isAperturaModalOpen,
        isCierreModalOpen,
        isMovimientoModalOpen,

        cajasData,
        activaCaja,
        isCajaModalOpen,
        mensaje,
        errores,

        checkMiTurno,
        fnAbrirTurno,
        fnCrearMovimiento,
        fnObtenerReporteCierre,
        fnCerrarTurno,
        fnCargarHistorial,

        fnCargarCajasCRUD,
        fnCrearCaja,
        fnActualizarCaja,
        fnActivarCaja,
        fnEliminarCaja,

        setModalApertura: (v) => dispatch(rtkSetModalApertura(v)),
        setModalCierre: (v) => dispatch(rtkSetModalCierre(v)),
        setModalMovimiento: (v) => dispatch(rtkSetModalMovimiento(v)),
        clearCajasData: () => dispatch(rtkClearCajasData()),

        setActivaCaja: (v) => dispatch(rtkSetActivaCaja(v)),
        setModalCajaCRUD: (v) => dispatch(rtkSetModalCajaCRUD(v)),
    };
};
