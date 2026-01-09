import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarGasto,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarGastos,
    rtkCargarMensaje,
    rtkLimpiarGastos,
} from "../../store/gasto/gastoSlice";
import apiAxios from "../../api/apiAxios";

export const useGastoStore = () => {
    const { cargando, gastos, activarGasto, mensaje, errores } = useSelector(
        (state) => state.gasto
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarGastos = async ({
        fecha_inicio = null,
        fecha_fin = null,
        reserva_id = null,
        codigo_reserva = null,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/general/gastos", {
                fecha_inicio,
                fecha_fin,
                reserva_id,
                codigo_reserva,
            });
            const { gastos } = data;
            dispatch(rtkCargarGastos(gastos));
        } catch (error) {
            //console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAgregarGasto = async (gasto) => {
        try {
            if (gasto.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/general/gasto/${gasto.id}`,
                    gasto
                );
                fnCargarGastos({ reserva_id: gasto.reserva_id });
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post("/general/gasto", gasto);
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            await fnCargarGastos({ reserva_id: gasto.reserva_id });
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnEliminarGasto = async (gasto) => {
        //console.log(gasto);
        try {
            const { data } = await apiAxios.delete(
                `/general/gasto/${gasto.id}`,
                {
                    data: { dni: gasto.dni },
                }
            );
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
            await fnCargarGastos({ reserva_id: gasto.reserva_id });
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarGasto = (gasto) => {
        dispatch(rtkActivarGasto(gasto));
    };

    const fnLimpiarGastos = () => {
        dispatch(rtkLimpiarGastos());
    };

    return {
        cargando,
        gastos,
        activarGasto,
        mensaje,
        errores,

        fnCargarGastos,
        fnAgregarGasto,
        fnEliminarGasto,
        fnAsignarGasto,
        fnLimpiarGastos,
    };
};
