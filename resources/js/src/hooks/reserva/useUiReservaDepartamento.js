import { useDispatch, useSelector } from "react-redux"
import { rtkAbrirModalReservarDepartamento } from "../../store/reserva/uiReservaSlice";

export const useUiReservaDepartamento = () => {

  const { abrirModalReservarDepartamento } = useSelector(state => state.uiReserva);
  const dispatch = useDispatch();

  const fnAbrirModalReservarDepartamento = (estado) => {
    dispatch(rtkAbrirModalReservarDepartamento(estado));
  }

  return {
    abrirModalReservarDepartamento,

    fnAbrirModalReservarDepartamento
  }
}
