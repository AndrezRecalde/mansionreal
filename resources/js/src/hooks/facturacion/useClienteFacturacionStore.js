import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    rtkActivarCliente,
    rtkAgregarCliente,
    rtkActualizarCliente,
    rtkCargando,
    rtkCargarCliente,
    rtkCargarClienteExistente,
    rtkCargarClientes,
    rtkCargarClientesSimple,
    rtkCargarConsumidorFinal,
    rtkCargarDatosPrellenados,
    rtkCargarErrores,
    rtkCargarEstadisticas,
    rtkCargarMensaje,
    rtkLimpiarCliente,
    rtkLimpiarClientes,
} from "../../store/facturacion/clienteFacturacionSlice";
import apiAxios from "../../api/apiAxios";

export const useClienteFacturacionStore = () => {
    const {
        cargando,
        clientes,
        clientesSimple,
        cliente,
        activarCliente,
        consumidorFinal,
        clienteExistente,
        datosPrellenados,
        estadisticas,
        mensaje,
        errores,
    } = useSelector((state) => state.clienteFacturacion);

    const dispatch = useDispatch();
    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    /**
     * Listar clientes con filtros y paginación
     */
    const fnCargarClientes = async (filtros = {}) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/clientes-facturacion", {
                params: filtros,
            });
            dispatch(rtkCargarClientes(data.clientes.data || data.clientes));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Listado simple para selects/dropdowns
     */
    const fnCargarClientesSimple = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                "/clientes-facturacion/listado-simple",
            );
            dispatch(rtkCargarClientesSimple(data.clientes));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener cliente específico
     */
    const fnCargarCliente = async (clienteId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/clientes-facturacion/${clienteId}`,
            );
            dispatch(rtkCargarCliente(data.cliente));
            if (data.estadisticas) {
                dispatch(rtkCargarEstadisticas(data.estadisticas));
            }
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener consumidor final
     */
    const fnCargarConsumidorFinal = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                "/clientes-facturacion/consumidor-final",
            );
            dispatch(rtkCargarConsumidorFinal(data.cliente));
            return data.cliente;
        } catch (error) {
            ExceptionMessageError(error);
            return null;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Buscar cliente por identificación
     */
    const fnBuscarPorIdentificacion = async (identificacion) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/clientes-facturacion/buscar-identificacion",
                { identificacion },
            );

            if (data.cliente) {
                dispatch(rtkCargarClienteExistente(data.cliente));
            } else {
                dispatch(rtkCargarClienteExistente(null));
            }

            return data;
        } catch (error) {
            ExceptionMessageError(error);
            return { cliente: null, existe: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Buscar clientes por nombre (autocompletado)
     */
    const fnBuscarPorNombre = async (nombre) => {
        try {
            const { data } = await apiAxios.post(
                "/clientes-facturacion/buscar-nombre",
                { nombre },
            );
            return data.clientes;
        } catch (error) {
            ExceptionMessageError(error);
            return [];
        }
    };

    /**
     * Prellenar datos desde huésped
     */
    const fnPrellenarDesdeHuesped = async (huespedId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/clientes-facturacion/prellenar-huesped/${huespedId}`,
            );

            dispatch(rtkCargarDatosPrellenados(data.datos));

            if (data.cliente_existente) {
                dispatch(rtkCargarClienteExistente(data.cliente_existente));
            } else {
                dispatch(rtkCargarClienteExistente(null));
            }

            return data;
        } catch (error) {
            ExceptionMessageError(error);
            return { datos: null, existe: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Prellenar datos desde reserva
     */
    const fnPrellenarDesdeReserva = async (reservaId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/clientes-facturacion/prellenar-reserva/${reservaId}`,
            );

            dispatch(rtkCargarDatosPrellenados(data.datos));

            if (data.cliente_existente) {
                dispatch(rtkCargarClienteExistente(data.cliente_existente));
            }

            return data;
        } catch (error) {
            ExceptionMessageError(error);
            return { datos: null, existe: false };
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Crear cliente de facturación
     */
    const fnCrearCliente = async (datosCliente) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.post(
                "/clientes-facturacion",
                datosCliente,
            );

            dispatch(rtkAgregarCliente(data.cliente));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.cliente;
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Actualizar cliente de facturación
     */
    const fnActualizarCliente = async (clienteId, datosCliente) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.put(
                `/clientes-facturacion/${clienteId}`,
                datosCliente,
            );

            dispatch(rtkActualizarCliente(data.cliente));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.cliente;
        } catch (error) {
            ExceptionMessageError(error);
            throw error;
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Cambiar estado del cliente (activar/desactivar)
     */
    const fnToggleEstadoCliente = async (clienteId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.patch(
                `/clientes-facturacion/${clienteId}/toggle-estado`,
            );

            dispatch(rtkActualizarCliente(data.cliente));
            dispatch(rtkCargarMensaje(data));

            setTimeout(() => {
                dispatch(rtkCargarMensaje(undefined));
            }, 3000);

            return data.cliente;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Obtener estadísticas del cliente
     */
    const fnCargarEstadisticasCliente = async (clienteId) => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get(
                `/clientes-facturacion/${clienteId}/estadisticas`,
            );
            dispatch(rtkCargarEstadisticas(data.estadisticas));
            return data.estadisticas;
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(rtkCargando(false));
        }
    };

    /**
     * Activar cliente (seleccionarlo)
     */
    const fnActivarCliente = (cliente) => {
        dispatch(rtkActivarCliente(cliente));
    };

    /**
     * Limpiar estado
     */
    const fnLimpiarClientes = () => {
        dispatch(rtkLimpiarClientes());
    };

    const fnLimpiarCliente = () => {
        dispatch(rtkLimpiarCliente());
    };

    return {
        // Estado
        cargando,
        clientes,
        clientesSimple,
        cliente,
        activarCliente,
        consumidorFinal,
        clienteExistente,
        datosPrellenados,
        estadisticas,
        mensaje,
        errores,

        // Métodos
        fnCargarClientes,
        fnCargarClientesSimple,
        fnCargarCliente,
        fnCargarConsumidorFinal,
        fnBuscarPorIdentificacion,
        fnBuscarPorNombre,
        fnPrellenarDesdeHuesped,
        fnPrellenarDesdeReserva,
        fnCrearCliente,
        fnActualizarCliente,
        fnToggleEstadoCliente,
        fnCargarEstadisticasCliente,
        fnActivarCliente,
        fnLimpiarClientes,
        fnLimpiarCliente,
    };
};
