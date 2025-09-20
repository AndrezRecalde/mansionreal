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
            const { data } = await apiAxios.post("/gastos", {
                fecha_inicio,
                fecha_fin,
                reserva_id,
                codigo_reserva,
            });
            const { gastos } = data;
            dispatch(rtkCargarGastos(gastos));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAgregarGasto = async (gasto) => {
        try {
            if (gasto.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gasto/${gasto.id}`,
                    gasto
                );
                fnCargarGastos({});
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post("/gasto", gasto);
            fnCargarGastos({});
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnEliminarGasto = async (gasto) => {
        try {
            const { data } = await apiAxios.delete(`/gasto/${gasto.id}`);
            fnCargarGastos({});
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
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
