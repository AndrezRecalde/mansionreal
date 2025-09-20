import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarDepartamento,
    rtkCargando,
    rtkCargarDepartamentos,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkLimpiarDepartamentos,
} from "../../store/departamento/departamentoSlice";
import apiAxios from "../../api/apiAxios";

export const useDepartamentoStore = () => {
    const { cargando, departamentos, activarDepartamento, mensaje, errores } =
        useSelector((state) => state.departamento);

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
                `/gerencia/departamento/${id}/status`,
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
                "/departamentos-dispinibilidad",
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

    const fnAsignarDepartamento = (departamento) => {
        dispatch(rtkActivarDepartamento(departamento));
    };

    const fnLimpiarDepartamentos = () => {
        dispatch(rtkLimpiarDepartamentos());
    };

    return {
        cargando,
        departamentos,
        activarDepartamento,
        mensaje,
        errores,

        //Metodos
        fnCargarDepartamentos,
        fnAgregarDepartamento,
        fnMostrarDepartamento,
        fnDisponibilidadDepartamento,
        fnAgregarServiciosDepartamento,
        fnCambiarEstadoDepartamento,
        fnConsultarDisponibilidadDepartamentos,
        fnAsignarDepartamento,
        fnLimpiarDepartamentos,
    };
};
