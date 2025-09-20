import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarHuesped,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarHuespedes,
    rtkCargarMensaje,
    rtkLimpiarHuespedes,
} from "../../store/huesped/huespedSlice";
import apiAxios from "../../api/apiAxios";

export const useHuespedStore = () => {
    const { cargando, huespedes, activarHuesped, mensaje, errores } =
        useSelector((state) => state.huesped);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarHuespedes = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/huespedes");
            const { huespedes } = data;
            dispatch(rtkCargarHuespedes(huespedes));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAgregarHuesped = async (huesped) => {
        try {
            if (huesped.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/huesped/${huesped.id}`,
                    huesped
                );
                fnCargarHuespedes();
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post("/gerencia/huesped", huesped);
            fnCargarHuespedes();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnBuscarHuespedPorDni = async (dni) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/huesped/buscar", { dni });
            const { huesped } = data;
            dispatch(rtkActivarHuesped(huesped));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    }

    const fnAsignarHuesped = (huesped) => {
        dispatch(rtkActivarHuesped(huesped));
    };

    const fnLimpiarHuespedes = () => {
        dispatch(rtkLimpiarHuespedes());
    }

    return {
        cargando,
        huespedes,
        activarHuesped,
        mensaje,
        errores,

        fnCargarHuespedes,
        fnAgregarHuesped,
        fnBuscarHuespedPorDni,
        fnAsignarHuesped,
        fnLimpiarHuespedes
    };
};
