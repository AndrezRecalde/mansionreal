import { useDispatch, useSelector } from "react-redux";
import { rtkAbrirModalHuesped } from "../../store/huesped/uiHuespedSlice";

export const useUiHuesped = () => {
    const { abrirModalHuesped } = useSelector((state) => state.uiHuesped);

    const dispatch = useDispatch();

    const fnModalHuesped = (abrir) => {
        dispatch(rtkAbrirModalHuesped(abrir));
    };
    return {
        abrirModalHuesped,

        fnModalHuesped,
    };
};
