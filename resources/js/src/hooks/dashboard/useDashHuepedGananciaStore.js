import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import { rtkCargarErrores, rtkHuespedesGananciasMesCargados, rtkLimpiarHuespedesGananciasMes } from "../../store/dashboard/dashHuespedesGananciasMesSlice";
import apiAxios from "../../api/apiAxios";

export const useDashHuepedGananciaStore = () => {
    const { cargandoHuespedesGananciasMes, huespedesGananciasMes, errores } =
        useSelector((state) => state.dashHuespedesGananciasMes);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarHuespedesGananciasMes = async (anio) => {
        try {
            const { data } = await apiAxios.post(
                "/gerencia/dashboard/huespedes-ganancias-por-mes", { anio }
            );
            const { result } = data;
            dispatch(rtkHuespedesGananciasMesCargados(result));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarHuespedesGananciasMes = () => {
        dispatch(rtkLimpiarHuespedesGananciasMes());
    };

    return {
        cargandoHuespedesGananciasMes,
        huespedesGananciasMes,
        errores,

        fnCargarHuespedesGananciasMes,
        fnLimpiarHuespedesGananciasMes,
    };
};
