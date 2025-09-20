import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalActivarUsuario,
    rtkAbrirModalUsuario,
} from "../../store/usuario/uiUsuarioSlice";

export const useUiUsuario = () => {
    const { abrirModalUsuario, abrirModalActivarUsuario } = useSelector(
        (state) => state.uiUsuario
    );
    const dispatch = useDispatch();

    const fnModalUsuario = (estado) => {
        dispatch(rtkAbrirModalUsuario(estado));
    };

    const fnModalAbrirActivarUsuario = (estado) => {
        dispatch(rtkAbrirModalActivarUsuario(estado));
    };

    return {
        abrirModalUsuario,
        abrirModalActivarUsuario,

        fnModalUsuario,
        fnModalAbrirActivarUsuario,
    };
};
