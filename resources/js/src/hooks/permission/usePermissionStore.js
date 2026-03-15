import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargando,
    rtkCargarPermisos,
    rtkLimpiarPermisos,
    rtkCargarErrores,
} from "../../store/permission/permissionSlice";
import apiAxios from "../../api/apiAxios";

export const usePermissionStore = () => {
    const { cargando, permisos, errores } = useSelector(
        (state) => state.permission,
    );
    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarPermisos = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/administracion/permisos");
            dispatch(rtkCargarPermisos(data.permisos));
        } catch (error) {
            console.log(error.response.data);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCrearPermiso = async (nombre) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.post("/administracion/permiso", { name: nombre });
            await fnCargarPermisos();
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnActualizarPermiso = async (id, nombre) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.put(`/administracion/permiso/${id}`, {
                name: nombre,
            });
            await fnCargarPermisos();
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnEliminarPermiso = async (id) => {
        try {
            dispatch(rtkCargando(true));
            await apiAxios.delete(`/administracion/permiso/${id}`);
            await fnCargarPermisos();
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnLimpiarPermisos = () => {
        dispatch(rtkLimpiarPermisos());
    };

    return {
        cargando,
        permisos,
        errores,

        fnCargarPermisos,
        fnCrearPermiso,
        fnActualizarPermiso,
        fnEliminarPermiso,
        fnLimpiarPermisos,
    };
};
