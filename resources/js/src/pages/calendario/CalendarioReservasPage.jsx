import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    CalendarioHeader,
    ReservarDepartamentoModal,
    TabContent,
    ReservaModals,
} from "../../components";
import {
    useReservaDepartamentoStore,
    useTitleHook,
    useNotificaciones,
    useDatosReserva,
    useReservaActions,
    useStorageField,
    usePagoStore,
    useConsumoStore,
    useGastoStore,
} from "../../hooks";
import { PAGE_CONFIG, STORAGE_FIELDS } from "../../helpers/calendario.constants";
import Swal from "sweetalert2";

const CalendarioReservasPage = () => {
    // Configuración inicial
    useTitleHook(PAGE_CONFIG.CALENDARIO.TITLE);
    useNotificaciones();
    const { fnSetStorageFields } = useStorageField();

    useEffect(() => {
        fnSetStorageFields({ carga_pagina: STORAGE_FIELDS.CARGA_PAGINA });

        return () => {
            fnSetStorageFields(null);
        };
    }, []);

    // Stores
    const {
        activarReserva,
        fnAsignarReserva,
        mensaje: mensajeReserva,
        errores: erroresReserva,
    } = useReservaDepartamentoStore();

    // Hooks personalizados
    const { handleReservar } = useReservaActions();
    const datos_reserva = useDatosReserva(activarReserva);

    const { mensaje: mensajePagos, errores: erroresPagos } = usePagoStore();
    const { mensaje: mensajeConsumos, errores: erroresConsumos } = useConsumoStore();
    const { mensaje: mensajeGastos, errores: erroresGastos } = useGastoStore();

    useEffect(() => {
        if (mensajeReserva !== undefined) {
            Swal.fire({
                icon: mensajeReserva.status,
                text: mensajeReserva.msg,
                showConfirmButton: true,
            });
        }
    }, [mensajeReserva]);

    useEffect(() => {
        if (erroresReserva !== undefined) {
            Swal.fire({
                icon: "error",
                text: erroresReserva,
                showConfirmButton: true,
            });
        }
    }, [erroresReserva]);

    useEffect(() => {
        if (mensajeGastos !== undefined) {
            Swal.fire({
                icon: mensajeGastos.status,
                text: mensajeGastos.msg,
                showConfirmButton: true,
            });
        }
    }, [mensajeGastos]);

    useEffect(() => {
        if (erroresGastos !== undefined) {
            Swal.fire({
                icon: "error",
                text: erroresGastos,
                showConfirmButton: true,
            });
        }
    }, [erroresGastos]);

    useEffect(() => {
        if (mensajeConsumos !== undefined) {
            Swal.fire({
                icon: mensajeConsumos.status,
                text: mensajeConsumos.msg,
                showConfirmButton: true,
            });
        }
    }, [mensajeConsumos]);

    useEffect(() => {
        if (erroresConsumos !== undefined) {
            Swal.fire({
                icon: "error",
                text: erroresConsumos,
                showConfirmButton: true,
            });
        }
    }, [erroresConsumos]);

    useEffect(() => {
        if (mensajePagos !== undefined) {
            Swal.fire({
                icon: mensajePagos.status,
                text: mensajePagos.msg,
                showConfirmButton: true,
            });
        }
    }, [mensajePagos]);

    useEffect(() => {
        if (erroresPagos !== undefined) {
            Swal.fire({
                icon: "error",
                text: erroresPagos,
                showConfirmButton: true,
            });
        }
    }, [erroresPagos]);

    return (
        <Container
            size={PAGE_CONFIG.CALENDARIO.CONTAINER_SIZE}
            py={{ base: "xs", sm: "sm", md: PAGE_CONFIG.CALENDARIO.PADDING }}
            px={{ base: "xs", sm: "md" }}
        >
            <CalendarioHeader onReservar={handleReservar} />

            <Divider my="md" />

            <TabContent />

            <ReservarDepartamentoModal />
            <ReservaModals
                datos_reserva={datos_reserva}
                fnAsignarDepartamento={fnAsignarReserva}
            />
        </Container>
    );
};

export default CalendarioReservasPage;
