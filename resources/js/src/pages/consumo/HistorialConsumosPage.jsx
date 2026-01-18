import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    FiltrarPorFechasCodigo,
    ReGenerarFacturaModal,
    ReservaModals,
    ReservasInformacionTable,
    TitlePage,
} from "../../components";
import {
    useConsumoStore,
    useDatosReserva,
    useEstadiaStore,
    useGastoStore,
    useNotificaciones,
    usePagoStore,
    useReservaDepartamentoStore,
    useStorageField,
    useTitleHook,
} from "../../hooks";
import { PAGE_TITLE } from "../../helpers/getPrefix";
import Swal from "sweetalert2";

const HistorialConsumosPage = () => {
    useTitleHook(PAGE_TITLE.HISTORIAL_CONSUMOS.TITLE);
    useNotificaciones();
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
            <TitlePage order={2}>
                {PAGE_TITLE.HISTORIAL_CONSUMOS.TITLE_PAGE}
            </TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasCodigo
                cargando={cargando}
                fnHandleAction={fnBuscarReservas}
            />
            <ReservasInformacionTable
                cargando={cargando}
                PAGE_TITLE={PAGE_TITLE.HISTORIAL_CONSUMOS.CAMPOS_TABLA}
            />
            <ReservaModals
                datos_reserva={datos_reserva}
                fnAsignarDepartamento={
                    activarReserva ? fnAsignarReserva : fnAsignarEstadia
                }
            />
            <ReGenerarFacturaModal />
        </Container>
    );
};

export default HistorialConsumosPage;
