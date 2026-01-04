import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarDepartamento,
    rtkCargando,
    rtkCargandoExportacion,
    rtkCargarDepartamentos,
    rtkCargarDepartamentosDisponibles,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkLimpiarDepartamentos,
} from "../../store/departamento/departamentoSlice";
import apiAxios from "../../api/apiAxios";

export const useDepartamentoStore = () => {
    const {
        cargando,
        cargandoExportacion,
        departamentos,
        departamentos_disponibles,
        activarDepartamento,
        mensaje,
        errores,
    } = useSelector((state) => state.departamento);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarDepartamentos = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/gerencia/departamentos");
            const { departamentos } = data;
            dispatch(rtkCargarDepartamentos(departamentos));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnCargarDepartamentosDisponibles = async ({ fecha_inicio, fecha_fin }) => {
        try {
            const { data } = await apiAxios.get("/general/buscar-departamentos-disponibles", {
                params: {
                    fecha_inicio,
                    fecha_fin,
                },
            });
            const { departamentos } = data;
            dispatch(rtkCargarDepartamentosDisponibles(departamentos));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAgregarDepartamento = async (departamentoFormData) => {
        try {
            // Definir URL según si es creación o actualización
            const url = departamentoFormData.get("id")
                ? `/gerencia/departamento/${departamentoFormData.get("id")}`
                : "/gerencia/departamento";

            // Petición POST con FormData
            const { data } = await apiAxios.post(url, departamentoFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Recargar datos y mostrar mensaje
            fnCargarDepartamentos();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnMostrarDepartamento = async (departamento) => {
        try {
            const { data } = await apiAxios.get(
                `/gerencia/departamento/${departamento.id}`
            );
            dispatch(rtkActivarDepartamento(data));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnDisponibilidadDepartamento = async ({
        fecha_checkin = null,
        fecha_checkout = null,
    }) => {
        try {
            const { data } = await apiAxios.post(
                "/gerencia/disponibilidad-departamento",
                { fecha_checkin, fecha_checkout }
            );
            const { departamentos } = data;
            dispatch(rtkCargarDepartamentos(departamentos));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAgregarServiciosDepartamento = async (servicios) => {
        try {
            const { data } = await apiAxios.post(
                "/gerencia/departamento-servicios",
                servicios
            );
            // Recargar datos y mostrar mensaje
            fnCargarDepartamentos();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCambiarEstadoDepartamento = async ({ id, nombre_estado }) => {
        try {
            const { data } = await apiAxios.put(
                `/general/departamento/${id}/status`,
                { nombre_estado }
            );
            // Recargar datos y mostrar mensaje
            fnConsultarDisponibilidadDepartamentos();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnConsultarDisponibilidadDepartamentos = async (fecha = null) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/general/departamentos-disponibilidad",
                { fecha }
            );
            const { departamentos } = data;
            dispatch(rtkCargarDepartamentos(departamentos));
        } catch (error) {
            console.log(error);
            rtkCargando(false);
            ExceptionMessageError(error);
        }
    };

    const fnCargarReporteDepartamentosPorFechas = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/general/reporte-departamentos",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                }
            );
            const { result } = data;
            dispatch(rtkCargarDepartamentos(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    // EN LA VISTA DE REPORTE DE DEPARTAMENTOS
    const fnExportarKpiYDepartamentosPdf = async (datos) => {
        try {
            dispatch(rtkCargandoExportacion(true));
            const response = await apiAxios.post(
                "/general/reservas-reporte/pdf",
                datos,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_departamentos.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoExportacion(false));
        }
    };

    // NUEVA FUNCION PARA EXPORTAR PDF CON IMAGEN DEL GRAFICO
    const fnExportarKpiYDepartamentosPdfConGrafico = async (
        datos,
        chartImages
    ) => {
        try {
            dispatch(rtkCargandoExportacion(true));
            const response = await apiAxios.post(
                "/general/reservas-reporte/pdf",
                {
                    ...datos,
                    charts: {
                        departamentos: chartImages.departamentos,
                        estadias: chartImages.estadias,
                        productos: chartImages.productos,
                    },
                },
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_mansionreal.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(rtkCargandoExportacion(false));
        }
    };

    // EN LA VISTA DE REPORTE DE DEPARTAMENTOS
    const fnExportarConsumosPorDepartamentoPDF = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio = null,
        departamento_id,
    }) => {
        try {
            dispatch(rtkCargandoExportacion(true));
            const response = await apiAxios.post(
                "/general/consumos-por-departamento/pdf",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                    departamento_id,
                },
                {
                    responseType: "blob", // Importante para manejar archivos binarios
                }
            );

            // Crear un enlace para descargar el archivo PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "consumos_por_departamento.pdf"); // Nombre del archivo a descargar
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // Limpia el objeto URL
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoExportacion(false));
        }
    };

    const fnAsignarDepartamento = (departamento) => {
        dispatch(rtkActivarDepartamento(departamento));
    };

    const fnLimpiarDepartamentos = () => {
        dispatch(rtkLimpiarDepartamentos());
    };

    return {
        cargando,
        cargandoExportacion,
        departamentos,
        departamentos_disponibles,
        activarDepartamento,
        mensaje,
        errores,

        //Metodos
        fnCargarDepartamentos,
        fnCargarDepartamentosDisponibles,
        fnAgregarDepartamento,
        fnMostrarDepartamento,
        fnDisponibilidadDepartamento,
        fnAgregarServiciosDepartamento,
        fnCambiarEstadoDepartamento,
        fnConsultarDisponibilidadDepartamentos,
        fnCargarReporteDepartamentosPorFechas,
        fnExportarKpiYDepartamentosPdf,
        fnExportarKpiYDepartamentosPdfConGrafico,
        fnExportarConsumosPorDepartamentoPDF,
        fnAsignarDepartamento,
        fnLimpiarDepartamentos,
    };
};
