import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkCargandoRankingProductos,
    rtkCargarErrores,
    rtkLimpiarRankingProductos,
    rtkRankingProductosCargados,
} from "../../store/dashboard/dashRankingProductosSlice";
import apiAxios from "../../api/apiAxios";

export const useDashRankingProductosStore = () => {
    const { cargandoRankingProductos, rankingProductos, errores } = useSelector(
        (state) => state.dashRankingProductos
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarRankingProductos = async ({
        p_fecha_inicio = null,
        p_fecha_fin = null,
        p_anio = null,
    }) => {
        try {
            dispatch(rtkCargandoRankingProductos(true));
            const { data } = await apiAxios.post(
                "/gerencia/dashboard/ranking-productos",
                {
                    p_fecha_inicio,
                    p_fecha_fin,
                    p_anio,
                }
            );
            const { result } = data;
            dispatch(rtkRankingProductosCargados(result));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarRankingProductos = () => {
        dispatch(rtkLimpiarRankingProductos());
    };

    return {
        cargandoRankingProductos,
        rankingProductos,
        errores,

        fnCargarRankingProductos,
        fnLimpiarRankingProductos,
    };
};
