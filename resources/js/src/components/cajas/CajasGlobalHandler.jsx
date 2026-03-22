import { useEffect } from "react";
import { useCajasStore, useAuthStore } from "../../hooks";
import { AperturaCajaModal } from "./modal/AperturaCajaModal";
import { CierreCajaModal } from "./modal/CierreCajaModal";
import { MovimientoCajaModal } from "./modal/MovimientoCajaModal";
import Swal from "sweetalert2";

export const CajasGlobalHandler = () => {
    const { user } = useAuthStore();
    const { mensaje, errores, checkMiTurno } = useCajasStore();

    useEffect(() => {
        // Solo comprobar si está autenticado
        if (user?.id) {
            checkMiTurno();
        }
    }, [user]);

    useEffect(() => {
        if (errores) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errores,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }, [errores]);

    useEffect(() => {
        if (mensaje) {
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: mensaje,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }, [mensaje]);

    return (
        <>
            <AperturaCajaModal />
            <CierreCajaModal />
            <MovimientoCajaModal />
        </>
    );
};
