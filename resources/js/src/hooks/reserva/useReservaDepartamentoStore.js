import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkAsignarReserva,
    rtkAsignarTipoReserva,
    rtkCargando,
    rtkCargandoPDFNotaVenta,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarReservas,
    rtkLimpiarReservas,
} from "../../store/reserva/reservaSlice";
import { useDepartamentoStore, useEstadiaStore } from "../../hooks";
import apiAxios from "../../api/apiAxios";

export const useReservaDepartamentoStore = () => {
    const {
        cargando,
        cargandoPDFNotaVenta,
        cargandoPDFReporte,
        reservas,
        activarReserva,
        activarTipoReserva,
        mensaje,
        errores,
    } = useSelector((state) => state.reserva);
    const { fnConsultarDisponibilidadDepartamentos } = useDepartamentoStore();
    const { fnCargarEstadias } = useEstadiaStore();
    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnAgregarReserva = async (reserva) => {
        try {
            if (reserva.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/reserva/${reserva.id}`,
                    reserva
                );
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                fnConsultarDisponibilidadDepartamentos();
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/reserva/nueva",
                reserva
            );
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            fnConsultarDisponibilidadDepartamentos();
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCambiarEstadoReserva = async ({
        id,
        nombre_estado,
        storageFields = null,
        carga_pagina = "DEPARTAMENTOS",
    }) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/reserva/${id}/estado`,
                { nombre_estado }
            );
            // Recargar datos y mostrar mensaje
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);

            if (carga_pagina === "DEPARTAMENTOS") {
                fnConsultarDisponibilidadDepartamentos();
                fnCargarEstadias();
            } else {
                fnBuscarReservas(storageFields);
            }
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnEliminarReserva = async (reserva) => {
        try {
            const { data } = await apiAxios.delete(
                `/gerencia/reserva/${reserva.id}`
            );
            // Recargar datos y mostrar mensaje
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnBuscarReservas = async ({
        fecha_inicio = null,
        fecha_fin = null,
        codigo_reserva = null,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/reservas/buscar", {
                fecha_inicio,
                fecha_fin,
                codigo_reserva,
            });
            const { reservas } = data;
            dispatch(rtkCargarReservas(reservas));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnExportarNotaVentaPDF = async ({ reserva_id }) => {
        try {
            dispatch(rtkCargandoPDFNotaVenta(true));
            const response = await apiAxios.post(
                "/gerencia/exportar-nota-venta",
                { reserva_id },
                {
                    responseType: "blob", // Importante para manejar archivos binarios
                }
            );

            // Crear un enlace para descargar el archivo PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `nota_venta_${reserva_id}.pdf`); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoPDFNotaVenta(false));
        }
    };

    const fnAsignarReserva = (reserva) => {
        dispatch(rtkAsignarReserva(reserva));
    };

    const fnAsignarTipoReserva = (tipo_reserva) => {
        dispatch(rtkAsignarTipoReserva(tipo_reserva));
    };

    const fnLimpiarReservas = () => {
        dispatch(rtkLimpiarReservas());
    };

    return {
        cargando,
        cargandoPDFNotaVenta,
        cargandoPDFReporte,
        reservas,
        activarReserva,
        activarTipoReserva,
        mensaje,
        errores,

        fnAgregarReserva,
        fnCambiarEstadoReserva,
        fnEliminarReserva,
        fnBuscarReservas,
        fnExportarNotaVentaPDF,
        fnAsignarReserva,
        fnAsignarTipoReserva,
        fnLimpiarReservas,
    };
};
