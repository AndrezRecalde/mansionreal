import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarUsuario,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarUsuarios,
    rtkLimpiarUsuarios,
} from "../../store/usuario/usuarioSlice";
import apiAxios from "../../api/apiAxios";

export const useUsuarioStore = () => {
    const { cargando, usuarios, activarUsuario, mensaje, errores } =
        useSelector((state) => state.usuario);

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
                    usuario,
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

    const fnCambiarPassword = async ({
        id,
        password,
        password_confirmation,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.put(`/usuario/${id}/password`, {
                password,
                password_confirmation,
            });
            fnCargarUsuarios();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCambiarStatus = async (usuario) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/usuario/${usuario.id}/status`,
                usuario,
            );
            fnCargarUsuarios();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            ExceptionMessageError(error);
        }
    };

    const fnAsignarUsuario = (usuario) => {
        dispatch(rtkActivarUsuario(usuario));
    };

    const fnLimpiarUsuarios = () => {
        dispatch(rtkLimpiarUsuarios());
    };

    /** Asignar permisos directos a un usuario (sincronización completa) */
    const fnAsignarPermisosDirectos = async (usuarioId, permisosArray) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.put(`/gerencia/usuario/${usuarioId}/permisos`, {
                permisos: permisosArray,
            });
            await fnCargarUsuarios();
        } catch (error) {
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
            throw error;
        }
    };

    /** Obtener permisos directos de un usuario */
    const fnGetPermisosDirectos = async (usuarioId) => {
        try {
            const { data } = await apiAxios.get(
                `/gerencia/usuario/${usuarioId}/permisos`
            );
            return data.permisos;
        } catch (error) {
            ExceptionMessageError(error);
            return [];
        }
    };

    return {
        cargando,
        usuarios,
        activarUsuario,
        mensaje,
        errores,

        fnCargarUsuarios,
        fnAgregarUsuario,
        fnCambiarPassword,
        fnCambiarStatus,
        fnAsignarUsuario,
        fnLimpiarUsuarios,
        fnAsignarPermisosDirectos,
        fnGetPermisosDirectos,
    };
};
