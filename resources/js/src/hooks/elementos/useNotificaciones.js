import { useEffect } from "react";
import Swal from "sweetalert2";
import {
    useCalendarioStore,
    useEstadiaStore,
    useReservaDepartamentoStore,
} from "../../hooks";

/**
 * Hook personalizado para manejar notificaciones del sistema
 * Recopila mensajes y errores de diferentes stores y los muestra
 */
export const useNotificaciones = () => {
    const { mensaje: mensajeCalendario, errores: erroresCalendario } =
        useCalendarioStore();
    const {
        mensaje: mensajeReserva,
        errores: erroresReserva,
        cargandoPDFNotaVenta,
    } = useReservaDepartamentoStore();
    const { mensaje: mensajeEstadia, errores: erroresEstadia } =
        useEstadiaStore();

    useEffect(() => {
        const notificaciones = [
            mensajeCalendario,
            erroresCalendario,
            mensajeReserva,
            erroresReserva,
            mensajeEstadia,
            erroresEstadia,
        ].filter(Boolean);

        if (notificaciones.length > 0) {
            const notificacion = notificaciones[0];
            Swal.fire({
                icon: notificacion.status,
                text: notificacion.msg,
                showConfirmButton: true,
            });
        }
    }, [
        mensajeCalendario,
        erroresCalendario,
        mensajeReserva,
        erroresReserva,
        mensajeEstadia,
        erroresEstadia,
    ]);

    useEffect(() => {
        cargandoPDFNotaVenta
            ? Swal.fire({
                  icon: "info",
                  text: "Generando nota de venta, un momento por favor...",
                  showConfirmButton: false,
                  didOpen: () => {
                      Swal.showLoading();
                  },
              })
            : Swal.close();
    }, [cargandoPDFNotaVenta]);
};
