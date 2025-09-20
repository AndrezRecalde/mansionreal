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
            console.log(error);
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
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnCambiarPassword = async (usuario) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/usuario/${usuario.id}/password`,
                usuario
            );
            fnCargarUsuarios();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
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
            console.log(error);
            ExceptionMessageError(error);
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
    };
};
