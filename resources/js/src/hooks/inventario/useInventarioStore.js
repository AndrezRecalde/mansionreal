import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarInventario,
    rtkCargando,
    rtkCargarErrores,
    rtkCargarInventarios,
    rtkCargarMensaje,
    rtkCargarMovimientos,
    rtkLimpiarInventarios,
} from "../../store/inventario/inventarioSlice";
import apiAxios from "../../api/apiAxios";

export const useInventarioStore = () => {
    const {
        cargando,
        inventarios,
        movimientos,
        activarInventario,
        mensaje,
        errores,
    } = useSelector((state) => state.inventario);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarProductosInventario = async ({
        categoria_id = null,
        nombre_producto = null,
        activo = null,
        all = false,
    } = {}) => {
        try {
            dispatch(rtkCargando(true));

            const params = {};

            if (categoria_id) params.categoria_id = categoria_id;
            if (nombre_producto) params.nombre_producto = nombre_producto;
            if (activo !== null) params.activo = activo;
            if (all) params.all = 1;

            const { data } = await apiAxios.get("/productos/inventario", {
                params,
            });

            dispatch(rtkCargarInventarios(data.productos || []));
        } catch (error) {
            console.error("Error:", error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnAgregarProductoInventario = async (producto) => {
        try {
            if (producto.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/gerencia/producto/inventario/${producto.id}`,
                    producto,
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
                producto,
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
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnActualizarStatusProductoInventario = async (producto) => {
        try {
            const { data } = await apiAxios.put(
                `/gerencia/producto/inventario/${producto.id}/status`,
                producto,
            );

            await fnCargarProductosInventario();

            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnAgregarStock = async (producto, storageFields = null) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/gerencia/producto/inventario/${producto.id}/agregar-stock`,
                producto,
            );
            if (storageFields !== null) {
                fnCargarProductosInventario(storageFields);
            } else {
                fnCargarProductosInventario({});
            }
            dispatch(rtkCargarMensaje(data));
            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCargarHistorialMovimientos = async (id, { anio = null } = {}) => {
        try {
            dispatch(rtkCargando(true));
            const params = {};
            if (anio) params.anio = anio;
            const { data } = await apiAxios.get(
                `/gerencia/producto/inventario/${id}/historial-movimientos`,
                { params },
            );
            const { inventario, movimientos } = data;
            dispatch(rtkCargarMovimientos({ inventario, movimientos }));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    const fnCargarReporteMovimientos = async ({
        fecha_inicio,
        fecha_fin,
        tipo_movimiento = null,
        inventario_id = null,
    }) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                `/gerencia/producto/inventario/reporte-movimientos`,
                {
                    fecha_inicio,
                    fecha_fin,
                    tipo_movimiento,
                    inventario_id,
                },
            );
            const { movimientos } = data;
            dispatch(rtkCargarMovimientos(movimientos));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
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
        movimientos,
        //ultimosFiltros,
        activarInventario,
        mensaje,
        errores,

        //Metodos
        fnCargarProductosInventario,
        fnAgregarProductoInventario,
        fnActualizarStatusProductoInventario,
        fnAgregarStock,
        fnCargarHistorialMovimientos,
        fnCargarReporteMovimientos,
        fnAsignarProductoInventario,
        fnLimpiarInventarios,
    };
};
