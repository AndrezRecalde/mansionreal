import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargandoIvaRecaudado,
    rtkCargarErrores,
    rtkIvaRecaudadoCargado,
    rtkLimpiarIvaRecaudado,
} from "../../store/dashboard/dashIvaRecaudadoSlice";

export const useDashIvaRecaudado = () => {
    const { cargandoIvaRecaudado, ivaRecaudado, errores } = useSelector(
        (state) => state.dashIvaRecaudado
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarIvaRecaudado = async ({ fecha_inicio, fecha_fin, anio }) => {
        try {
            dispatch(rtkCargandoIvaRecaudado(true));
            const { data } = await apiAxios.post("/dashboard/iva-recaudado", {
                fecha_inicio,
                fecha_fin,
                anio,
            });
            const { result } = data;
            dispatch(rtkIvaRecaudadoCargado(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarIvaRecaudado = () => {
        dispatch(rtkLimpiarIvaRecaudado());
    };

    return {
        cargandoIvaRecaudado,
        ivaRecaudado,
        errores,

        fnCargarIvaRecaudado,
        fnLimpiarIvaRecaudado,
    };
};
