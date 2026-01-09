import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargandoOcupacionActual,
    rtkCargarErrores,
    rtkLimpiarOcupacionActual,
    rtkOcupacionActualCargada,
} from "../../store/dashboard/dashOcupacionActualSlice";
import apiAxios from "../../api/apiAxios";

export const useDashOcupacionActualStore = () => {
    const { cargandoOcupacionActual, ocupacionActual, errores } = useSelector(
        (state) => state.dashOcupacionActual
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarOcupacionActual = async () => {
        try {
            dispatch(rtkCargandoOcupacionActual(true));
            const { data } = await apiAxios.get("/dashboard/ocupacion-actual");
            const { result } = data;
            dispatch(rtkOcupacionActualCargada(result));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarOcupacionActual = () => {
        dispatch(rtkLimpiarOcupacionActual());
    };

    return {
        cargandoOcupacionActual,
        ocupacionActual,
        errores,

        fnCargarOcupacionActual,
        fnLimpiarOcupacionActual,
    };
};
