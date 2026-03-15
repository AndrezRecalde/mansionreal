import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargando,
    rtkCargandoRoles,
    rtkCargarErrores,
    rtkCargarPermisosRol,
    rtkCargarPermisosDeRol,
    rtkLimpiarPermisosDeRol,
    rtkLimpiarRoles,
} from "../../store/role/roleSlice";
import apiAxios from "../../api/apiAxios";

export const useRoleStore = () => {
    const { cargando, roles, permisos, permisosDeRol, errores } = useSelector(
        (state) => state.role,
    );
    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarRoles = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/administracion/roles");
            dispatch(rtkCargandoRoles(data.roles));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /** Cargar todos los permisos disponibles en el sistema */
    const fnCargarPermisos = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/administracion/permisos");
            dispatch(rtkCargarPermisosRol(data.permisos));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /** Obtener los permisos asignados a un rol específico */
    const fnCargarPermisosDeRol = async (rolId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/administracion/rol/${rolId}/permisos`,
            );
            dispatch(rtkCargarPermisosDeRol(data.permisos));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /** Sincronizar permisos de un rol (envía array de nombres de permisos) */
    const fnAsignarPermisos = async (rolId, permisosArray) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.put(`/administracion/rol/${rolId}/permisos`, {
                permisos: permisosArray,
            });
            await fnCargarPermisosDeRol(rolId);
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCrearRol = async (nombre) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.post("/administracion/rol", { name: nombre });
            await fnCargarRoles();
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnActualizarRol = async (id, nombre) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.put(`/administracion/rol/${id}`, { name: nombre });
            await fnCargarRoles();
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnEliminarRol = async (id) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.delete(`/administracion/rol/${id}`);
            await fnCargarRoles();
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnLimpiarRoles = () => {
        dispatch(rtkLimpiarRoles());
    };

    const fnLimpiarPermisosDeRol = () => {
        dispatch(rtkLimpiarPermisosDeRol());
    };

    return {
        cargando,
        roles,
        permisos,
        permisosDeRol,
        errores,

        fnCargarRoles,
        fnCrearRol,
        fnActualizarRol,
        fnEliminarRol,
        fnCargarPermisos,
        fnCargarPermisosDeRol,
        fnAsignarPermisos,
        fnLimpiarRoles,
        fnLimpiarPermisosDeRol,
    };
};
