import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoModal,
    ConsumosDrawer,
    FiltrarPorFechasCodigo,
    GastoModal,
    PagoEditarModal,
    PagoModal,
    ReservaFinalizarModal,
    ReservasInformacionTable,
    TitlePage,
} from "../../components";
import {
    useReservaDepartamentoStore,
    useStorageField,
    useTitleHook,
} from "../../hooks";

const HistorialConsumosPage = () => {
    useTitleHook("Historial Reservas - Mansion Real");
    const {
        cargando,
        activarReserva,
        fnAsignarReserva,
        fnBuscarReservas,
        fnLimpiarReservas,
    } = useReservaDepartamentoStore();
    const { fnSetStorageFields } = useStorageField();

    const datos_reserva = {
        numero_departamento: activarReserva?.numero_departamento,
        codigo_reserva: activarReserva?.codigo_reserva,
        reserva_id: activarReserva?.id,
        huesped: activarReserva?.huesped,
        fecha_checkin: activarReserva?.fecha_checkin,
        fecha_checkout: activarReserva?.fecha_checkout,
        total_noches: activarReserva?.total_noches,
        estado: activarReserva?.estado,
    };

    useEffect(() => {
        return () => {
            fnLimpiarReservas();
            fnSetStorageFields(null);
        };
    }, []);

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
            {datos_reserva && (
                <>
                    <ConsumosDrawer
                        datos_reserva={datos_reserva}
                        fnAsignarElemento={fnAsignarReserva}
                    />
                    <PagoModal reservaId={datos_reserva.reserva_id} />
                    <PagoEditarModal reservaId={datos_reserva.reserva_id} />
                    <ConsumoModal reserva_id={datos_reserva.reserva_id} />
                    <ReservaFinalizarModal datos_reserva={datos_reserva} />

                    <GastoModal activarElemento={datos_reserva} />
                    <ConsumoEditarModal />
                    <ConsumoEliminarModal />
                </>
            )}
        </Container>
    );
};

export default HistorialConsumosPage;
