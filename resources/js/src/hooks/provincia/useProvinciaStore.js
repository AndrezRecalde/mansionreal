import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import { rtkCargando, rtkCargandoProvincias, rtkCargarErrores, rtkLimpiarProvincias } from "../../store/provincia/provinciaSlice";
import apiAxios from "../../api/apiAxios";

export const useProvinciaStore = () => {
    const { cargando, provincias, activarProvincia, mensaje, errores } =
        useSelector((state) => state.provincia);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(rtkCargarErrores);

    const fnCargarProvincias = async () => {
        try {
            dispatch(rtkCargando(true));
            const { data } = await apiAxios.get("/provincias");
            const { provincias } = data;
            dispatch(rtkCargandoProvincias(provincias));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const fnLimpiarProvincias = () => {
        dispatch(rtkLimpiarProvincias());
    }

    return {
        cargando,
        provincias,
        activarProvincia,
        mensaje,
        errores,

        fnCargarProvincias,
        fnLimpiarProvincias
    };
};
