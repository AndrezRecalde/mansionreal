import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarUsuario,
    rtkCargando,
    rtkCargandoReportes,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarReportes,
    rtkCargarUsuarios,
    rtkLimpiarUsuarios,
} from "../../store/usuario/usuarioSlice";
import apiAxios from "../../api/apiAxios";

export const useUsuarioStore = () => {
    const {
        cargando,
        cargandoReportes,
        usuarios,
        reportes,
        activarUsuario,
        mensaje,
        errores,
    } = useSelector((state) => state.usuario);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarUsuarios = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/gerencia/usuarios");
            const { usuarios } = data;
            dispatch(rtkCargarUsuarios(usuarios));
        } catch (error) {
            //console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAgregarUsuario = async (usuario) => {
        try {
            if (usuario.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/usuario/${usuario.id}`,
                    usuario
                );
                fnCargarUsuarios();
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post("/gerencia/usuario", usuario);
            fnCargarUsuarios();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCambiarPassword = async ({ id, password, password_confirmation }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.put(
                `/general/usuario/${id}/password`,
                { password, password_confirmation }
            );
            fnCargarUsuarios();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCambiarStatus = async (usuario) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/usuario/${usuario.id}/status`,
                usuario
            );
            fnCargarUsuarios();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCargarReportes = async ({
        p_fecha_inicio,
        p_fecha_fin,
        p_anio,
        p_usuario_id = null,
    }) => {
        try {
            dispatch(rtkCargandoReportes(true));

            const { data } = await apiAxios.post(
                "/gerencia/reportes/pagos/gerentes",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                    p_usuario_id,
                }
            );
            const { results } = data;
            dispatch(rtkCargarReportes(results));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoReportes(false));
        }
    };

    const fnCargarGerentes = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/gerencia/usuarios/gerentes");
            const { usuarios } = data;
            dispatch(rtkCargarUsuarios(usuarios));
        } catch (error) {
            //console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnExportarPDFReportesPorGerente = async ({
        p_fecha_inicio,
        p_fecha_fin,
        p_anio,
        p_usuario_id = null,
    }) => {
        try {
            dispatch(rtkCargandoReportes(true));

            const response = await apiAxios.post(
                "/gerencia/reportes/pagos/gerentes/pdf",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                    p_usuario_id,
                },
                {
                    responseType: "blob", // importante
                }
            );

            // Crear un enlace para descargar el archivo PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_pagos_gerentes.pdf"); // nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargandoReportes(false));
        }
    };

    const fnAsignarUsuario = (usuario) => {
        dispatch(rtkActivarUsuario(usuario));
    };

    const fnLimpiarUsuarios = () => {
        dispatch(rtkLimpiarUsuarios());
    };

    return {
        cargando,
        cargandoReportes,
        usuarios,
        reportes,
        activarUsuario,
        mensaje,
        errores,

        fnCargarUsuarios,
        fnAgregarUsuario,
        fnCambiarPassword,
        fnCambiarStatus,
        fnCargarReportes,
        fnCargarGerentes,
        fnExportarPDFReportesPorGerente,
        fnAsignarUsuario,
        fnLimpiarUsuarios,
    };
};
