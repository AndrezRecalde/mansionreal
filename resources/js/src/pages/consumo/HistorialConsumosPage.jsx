import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    ConsumosDrawer,
    FiltrarPorFechasCodigo,
    ReservaFinalizarModal,
    ReservasInformacionTable,
    TitlePage,
} from "../../components";
import { useReservaDepartamentoStore, useTitleHook } from "../../hooks";

const HistorialConsumosPage = () => {
    useTitleHook("Historial Reservas - Mansion Real");
    const {
        cargando,
        activarReserva,
        fnAsignarReserva,
        fnBuscarReservas,
        fnLimpiarReservas,
    } = useReservaDepartamentoStore();

    useEffect(() => {
        return () => {
            fnLimpiarReservas();
        };
    }, []);

    return (
        <Container size="lg" my={20}>
            <TitlePage order={2}>Historial Reservas</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasCodigo
                titulo="Filtrar por fechas y código"
                cargando={cargando}
                fnHandleAction={fnBuscarReservas}
            />
            <ReservasInformacionTable cargando={cargando} />

            <ConsumosDrawer
                activarElemento={activarReserva?.id}
                fnAsignarElemento={fnAsignarReserva}
            />

            <ReservaFinalizarModal />
        </Container>
    );
};

export default HistorialConsumosPage;
