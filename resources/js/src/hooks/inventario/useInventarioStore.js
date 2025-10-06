import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarInventario,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarInventarios,
    rtkCargarMensaje,
    rtkLimpiarInventarios,
} from "../../store/inventario/inventarioSlice";
import apiAxios from "../../api/apiAxios";

export const useInventarioStore = () => {
    const { cargando, inventarios, activarInventario, mensaje, errores } =
        useSelector((state) => state.inventario);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarProductosInventario = async ({
        categoria_id = null,
        nombre_producto = null,
        activo = null,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/gerencia/productos/inventario",
                {
                    categoria_id,
                    nombre_producto,
                    activo,
                }
            );
            const { productos } = data;
            dispatch(rtkCargarInventarios(productos));
        } catch (error) {
            console.log(error);
            dispatch(rtkCargando(false));
            ExceptionMessageError(error);
        }
    };

    const fnAgregarProductoInventario = async (producto) => {
        try {
            if (producto.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/producto/inventario/${producto.id}`,
                    producto
                );
                fnCargarProductosInventario({});
                dispatch(rtkCargarMensaje(data));
                setTimeout(() => {
                    dispatch(rtkCargarMensaje(undefined));
                }, 2000);
                return;
            }
            //creando
            const { data } = await apiAxios.post(
                "/gerencia/producto/inventario",
                producto
            );
            if (producto.storageFields !== null) {
                fnCargarProductosInventario(producto.storageFields);
            } else {
                fnCargarProductosInventario({});
            }

            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnActualizarStatusProductoInventario = async (producto) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/producto/inventario/${producto.id}/status`,
                producto
            );
            fnCargarProductosInventario({});
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAsignarProductoInventario = (producto) => {
        dispatch(rtkActivarInventario(producto));
    };

    const fnLimpiarInventarios = () => {
        dispatch(rtkLimpiarInventarios());
    };

    return {
        cargando,
        inventarios,
        activarInventario,
        mensaje,
        errores,

        //Metodos
        fnCargarProductosInventario,
        fnAgregarProductoInventario,
        fnActualizarStatusProductoInventario,
        fnAsignarProductoInventario,
        fnLimpiarInventarios,
    };
};
