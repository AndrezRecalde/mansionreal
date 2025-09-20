import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarCategoria,
    rtkCargando,
    rtkCargarCategorias,
    rtkCargarErrores,
    rtkCargarMensaje,
    rtkLimpiarCategorias,
} from "../../store/categoria/categoriaSlice";
import apiAxios from "../../api/apiAxios";

export const useCategoriaStore = () => {
    const { cargando, categorias, activarCategoria, mensaje, errores } =
        useSelector((state) => state.categoria);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarCategorias = async ({ activo = null }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post("/gerencia/categorias", {
                activo,
            });
            const { categorias } = data;
            dispatch(rtkCargarCategorias(categorias));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAgregarCategoria = async (categoria) => {
        try {
            if (categoria.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/categoria/${categoria.id}`,
                    categoria
                );
                fnCargarCategorias({});
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/categoria",
                categoria
            );
            fnCargarCategorias({});
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnActualizarStatusCategoria = async (categoria) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/categoria/${categoria.id}/status`,
                categoria
            );
            fnCargarCategorias({});
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarCategoria = (categoria) => {
        dispatch(rtkActivarCategoria(categoria));
    };

    const fnLimpiarCategorias = () => {
        dispatch(rtkLimpiarCategorias());
    };

    return {
        cargando,
        categorias,
        activarCategoria,
        mensaje,
        errores,

        //Metodos
        fnCargarCategorias,
        fnAgregarCategoria,
        fnActualizarStatusCategoria,
        fnAsignarCategoria,
        fnLimpiarCategorias,
    };
};
