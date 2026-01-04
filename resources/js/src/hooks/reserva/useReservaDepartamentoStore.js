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
import {
    useCalendarioStore,
    useDepartamentoStore,
    useEstadiaStore,
} from "../../hooks";
import { formatDateStr } from "../../helpers/fnHelper";
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
    const { fnCargarDatosCalendario, actualizarEstadisticas } = useCalendarioStore();
    const { fnCargarEstadias } = useEstadiaStore();
    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnAgregarReserva = async (reserva) => {
        try {
            if (reserva.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/general/reserva/${reserva.id}`,
                    reserva
                );
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                //fnConsultarDisponibilidadDepartamentos();
                await fnCargarDatosCalendario({
                    start: formatDateStr(reserva.fecha_inicio),
                    end: formatDateStr(reserva.fecha_fin),
                });

                await actualizarEstadisticas(new Date());
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/general/reserva/nueva",
                reserva
            );
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            //fnConsultarDisponibilidadDepartamentos();
            await fnCargarDatosCalendario({
                start: formatDateStr(reserva.fecha_inicio),
                end: formatDateStr(reserva.fecha_fin),
            });

            await actualizarEstadisticas(new Date());
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
                `/general/reserva/${id}/estado`,
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
                `/general/reserva/${reserva.id}`
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
            const { data } = await apiAxios.post("/general/reservas/buscar", {
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
                "/general/exportar-nota-venta",
                { reserva_id },
                {
                    responseType: "blob", // Importante para manejar archivos binarios
                }
            );

            // Extraer el nombre del archivo desde los headers de la respuesta
            const contentDisposition = response.headers["content-disposition"];
            let fileName = `nota_venta_${reserva_id}.pdf`; // Nombre por defecto

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                );
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1].replace(/['"]/g, "");
                }
            }

            // Crear un enlace para descargar el archivo PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // Usar el nombre extraído del header
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            // Liberar memoria
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoPDFNotaVenta(false));
        }
    };

    const fnCancelarReserva = async ({
        id,
        motivo_cancelacion,
        observacion = null,
        storageFields = null,
        carga_pagina = "DEPARTAMENTOS",
    }) => {
        try {
            // Validaciones
            if (!id || isNaN(Number(id))) {
                throw new Error("ID de reserva inválido");
            }

            if (!motivo_cancelacion) {
                throw new Error("Motivo de cancelación es requerido");
            }
            // Realizar petición a la API
            const { data } = await apiAxios.post(
                `/general/reservas/${id}/cancelar`,
                {
                    motivo_cancelacion,
                    observacion: observacion || null,
                }
            );

            // Mostrar mensaje de éxito
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);

            // Recargar datos según la página
            if (carga_pagina === "DEPARTAMENTOS") {
                await Promise.all([
                    fnConsultarDisponibilidadDepartamentos(),
                    fnCargarEstadias(),
                ]);
            } else {
                await fnBuscarReservas(storageFields);
            }
        } catch (error) {
            ExceptionMessageError(error);
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
        fnCancelarReserva,
        fnExportarNotaVentaPDF,
        fnAsignarReserva,
        fnAsignarTipoReserva,
        fnLimpiarReservas,
    };
};
