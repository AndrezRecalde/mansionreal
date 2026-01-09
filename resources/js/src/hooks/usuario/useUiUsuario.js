import { useDispatch, useSelector } from "react-redux";
import {
    rtkAbrirModalActivarUsuario,
    rtkAbrirModalResetearPwd,
    rtkAbrirModalUsuario,
} from "../../store/usuario/uiUsuarioSlice";

export const useUiUsuario = () => {
    const { abrirModalUsuario, abrirModalActivarUsuario, abrirModalResetearPwd } = useSelector(
        (state) => state.uiUsuario
    );
    const dispatch = useDispatch();

    const fnModalUsuario = (estado) => {
        dispatch(rtkAbrirModalUsuario(estado));
    };

    const fnModalAbrirActivarUsuario = (estado) => {
        dispatch(rtkAbrirModalActivarUsuario(estado));
    };

    const fnModalResetearPwd = (estado) => {
        dispatch(rtkAbrirModalResetearPwd(estado));
    }

    return {
        abrirModalUsuario,
        abrirModalActivarUsuario,
        abrirModalResetearPwd,

        fnModalUsuario,
        fnModalAbrirActivarUsuario,
        fnModalResetearPwd
    };
};
