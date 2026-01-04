import { useDispatch, useSelector } from "react-redux";
import {
    rtkAsignarTipoDano,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarTiposDano,
    rtkLimpiarTiposDano,
} from "../../store/tiposDano/tiposDanoSlice";
import { useErrorException } from "../error/useErrorException";
import apiAxios from "../../api/apiAxios";

export const useTiposDanoStore = () => {
    const { cargando, tiposDano, activarTipoDano, mensaje, errores } =
        useSelector((state) => state.tiposDano);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarTiposDano = async ({ activo = null }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/general/tipos-dano", {
                activo,
            });
            const { tiposDano } = data;
            dispatch(rtkCargarTiposDano(tiposDano));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAsignarTipoDano = (tipoDano) => {
        dispatch(rtkAsignarTipoDano(tipoDano));
    };

    const fnLimpiarTiposDano = () => {
        dispatch(rtkLimpiarTiposDano());
    };

    return {
        cargando,
        tiposDano,
        activarTipoDano,
        mensaje,
        errores,

        fnCargarTiposDano,
        fnAsignarTipoDano,
        fnLimpiarTiposDano,
    };
};
