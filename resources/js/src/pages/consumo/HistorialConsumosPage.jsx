import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    FiltrarPorFechasCodigo,
    ReservaModals,
    ReservasInformacionTable,
    TitlePage,
} from "../../components";
import {
    useConsumoStore,
    useDatosReserva,
    useEstadiaStore,
    useGastoStore,
    usePagoStore,
    useReservaDepartamentoStore,
    useStorageField,
    useTitleHook,
} from "../../hooks";
import Swal from "sweetalert2";

const HistorialConsumosPage = () => {
    useTitleHook("Historial Reservas - Mansion Real");
    const {
        cargando,
        activarReserva,
        fnAsignarReserva,
        fnBuscarReservas,
        fnLimpiarReservas,
    } = useReservaDepartamentoStore();
    const { activarEstadia, fnAsignarEstadia } = useEstadiaStore();
    const { mensaje: mensajePagos, errores: erroresPagos } = usePagoStore();
    const { mensaje: mensajeConsumos, errores: erroresConsumos } =
        useConsumoStore();
    const { mensaje: mensajeGastos, errores: erroresGastos } = useGastoStore();
    const { fnSetStorageFields } = useStorageField();

    const datos_reserva = useDatosReserva(activarReserva, activarEstadia);

    useEffect(() => {
        return () => {
            fnLimpiarReservas();
            fnSetStorageFields(null);
        };
    }, []);

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
                icon: erroresGastos.status,
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
                icon: erroresConsumos.status,
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
                icon: erroresPagos.status,
                text: erroresPagos,
                showConfirmButton: true,
            });
        }
    }, [erroresPagos]);

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Historial Reservas</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasCodigo
                titulo="Filtrar por fechas y código"
                cargando={cargando}
                fnHandleAction={fnBuscarReservas}
            />
            <ReservasInformacionTable cargando={cargando} />
            <ReservaModals
                datos_reserva={datos_reserva}
                fnAsignarDepartamento={
                    activarReserva ? fnAsignarReserva : fnAsignarEstadia
                }
            />
        </Container>
    );
};

export default HistorialConsumosPage;
