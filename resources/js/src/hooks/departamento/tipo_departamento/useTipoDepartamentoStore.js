import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    rtkCargando,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkCargarTiposDepartamentos,
    rtkLimpiarTiposDepartamentos,
} from "../../../store/departamento/tipoDepartamentoSlice";
import apiAxios from "../../../api/apiAxios";

export const useTipoDepartamentoStore = () => {
    const {
        cargando,
        tiposDepartamentos,
        activarTipoDepartamento,
        mensaje,
        errores,
    } = useSelector((state) => state.tipoDepartamento);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarTiposDepartamentos = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/gerencia/tipos-departamentos");
            //console.log(data);
            const { tiposDepartamentos } = data;
            dispatch(rtkCargarTiposDepartamentos(tiposDepartamentos));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAgregarTipoDepartamento = async (tipoDepartamento) => {
        try {
            if (tipoDepartamento.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/tipo-departamento/${tipoDepartamento.id}`,
                    tipoDepartamento
                );
                fnCargarTiposDepartamentos();
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/tipo-departamento",
                tipoDepartamento
            );
            fnCargarTiposDepartamentos();
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarTipoDepartamento = (tipoDepartamento) => {
        dispatch(activarTipoDepartamento(tipoDepartamento));
    };

    const fnLimpiarTiposDepartamentos = () => {
        dispatch(rtkLimpiarTiposDepartamentos());
    };

    return {
        cargando,
        tiposDepartamentos,
        activarTipoDepartamento,
        mensaje,
        errores,

        fnCargarTiposDepartamentos,
        fnAgregarTipoDepartamento,
        fnAsignarTipoDepartamento,
        fnLimpiarTiposDepartamentos,
    };
};
