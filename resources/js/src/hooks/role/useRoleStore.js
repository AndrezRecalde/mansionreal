import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargando,
    rtkCargandoRoles,
    rtkCargarErrores,
    rtkLimpiarRoles,
} from "../../store/role/roleSlice";
import apiAxios from "../../api/apiAxios";

export const useRoleStore = () => {
    const { cargando, roles, errores } = useSelector((state) => state.role);
    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarRoles = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/gerencia/roles");
            const { roles } = data;
            dispatch(rtkCargandoRoles(roles));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarRoles = () => {
        dispatch(rtkLimpiarRoles());
    };

    return {
        cargando,
        roles,
        errores,

        fnCargarRoles,
        fnLimpiarRoles
    };
};
