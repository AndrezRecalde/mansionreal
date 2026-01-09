import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargarErrores,
    rtkCargandoIngresosPorDepartamento,
    rtkIngresosPorDepartamentoCargados,
    rtkLimpiarIngeresosPorDepartamento,
} from "../../store/dashboard/dashIngresosPorDepartamentoSlice";
import apiAxios from "../../api/apiAxios";

export const useDashIngresosPorDepartamentoStore = () => {
    const { cargandoIngresosPorDepartamento, ingresosPorDepartamento } =
        useSelector((state) => state.dashIngresosPorDepartamento);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarIngresosPorDepartamento = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio = null,
    }) => {
        try {
            dispatch(rtkCargandoIngresosPorDepartamento(true));
            const { data } = await apiAxios.post(
                "/gerencia/dashboard/ingresos-departamento",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                }
            );
            const { result } = data;
            dispatch(rtkIngresosPorDepartamentoCargados(result));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarIngresosPorDepartamento = () => {
        dispatch(rtkLimpiarIngeresosPorDepartamento());
    };

    return {
        cargandoIngresosPorDepartamento,
        ingresosPorDepartamento,

        // Métodos
        fnCargarIngresosPorDepartamento,
        fnLimpiarIngresosPorDepartamento,
    };
};
