import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalBuscarCliente,
    rtkAbrirModalCliente,
    rtkAbrirModalClienteEditar,
    rtkAbrirModalClienteEliminar,
    rtkAbrirModalSelectorCliente,
} from "../../store/facturacion/uiClienteFacturacionSlice";

export const useUiClienteFacturacion = () => {
    const {
        abrirModalCliente,
        abrirModalClienteEditar,
        abrirModalClienteEliminar,
        abrirModalBuscarCliente,
        abrirModalSelectorCliente,
    } = useSelector((state) => state.uiClienteFacturacion);

    const dispatch = useDispatch();

    const fnAbrirModalCliente = (abrir) => {
        dispatch(rtkAbrirModalCliente(abrir));
    };

    const fnAbrirModalClienteEditar = (abrir) => {
        dispatch(rtkAbrirModalClienteEditar(abrir));
    };

    const fnAbrirModalClienteEliminar = (abrir) => {
        dispatch(rtkAbrirModalClienteEliminar(abrir));
    };

    const fnAbrirModalBuscarCliente = (abrir) => {
        dispatch(rtkAbrirModalBuscarCliente(abrir));
    };

    const fnAbrirModalSelectorCliente = (abrir) => {
        dispatch(rtkAbrirModalSelectorCliente(abrir));
    };

    return {
        abrirModalCliente,
        abrirModalClienteEditar,
        abrirModalClienteEliminar,
        abrirModalBuscarCliente,
        abrirModalSelectorCliente,

        fnAbrirModalCliente,
        fnAbrirModalClienteEditar,
        fnAbrirModalClienteEliminar,
        fnAbrirModalBuscarCliente,
        fnAbrirModalSelectorCliente,
    };
};
