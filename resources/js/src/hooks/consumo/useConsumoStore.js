import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarConsumo,
    rtkCargando,
    rtkCargarConsumos,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkLimpiarConsumos,
} from "../../store/consumo/consumoSlice";
import apiAxios from "../../api/apiAxios";

export const useConsumoStore = () => {
    const { cargando, consumos, activarConsumo, mensaje, errores } =
        useSelector((state) => state.consumo);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarConsumos = async ({ reserva_id }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/consumo-reserva", {
                reserva_id,
            });
            const { consumos } = data;
            dispatch(rtkCargarConsumos(consumos));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAgregarConsumo = async (consumo) => {
        try {
            if (consumo.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/consumo/${consumo.id}`,
                    consumo
                );
                fnCargarConsumos({ reserva_id: consumo.reserva_id });
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post("/gerencia/consumo", consumo);
            fnCargarConsumos({ reserva_id: consumo.reserva_id });
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarActivarConsumo = (activar) => {
        dispatch(rtkActivarConsumo(activar));
    };

    const fnLimpiarConsumos = () => {
        dispatch(rtkLimpiarConsumos());
    };

    return {
        cargando,
        consumos,
        activarConsumo,
        mensaje,
        errores,

        fnCargarConsumos,
        fnAgregarConsumo,
        fnAsignarActivarConsumo,
        fnLimpiarConsumos,
    };
};
