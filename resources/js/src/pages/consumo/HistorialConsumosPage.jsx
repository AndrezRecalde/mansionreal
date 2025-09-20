import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    FiltrarPorFechasCodigo,
    ReservasInformacionTable,
    TitlePage,
} from "../../components";
import { useReservaDepartamentoStore } from "../../hooks";

const HistorialConsumosPage = () => {
    const { cargando, fnBuscarReservas, fnLimpiarReservas } =
        useReservaDepartamentoStore();

    useEffect(() => {
        return () => {
            fnLimpiarReservas();
        };
    }, []);

    return (
        <Container size="lg" my={20}>
            <TitlePage order={2}>Historial Consumos</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasCodigo
                titulo="Filtrar por fechas y código"
                cargando={cargando}
                fnHandleAction={fnBuscarReservas}
            />
            <ReservasInformacionTable cargando={cargando} />
        </Container>
    );
};

export default HistorialConsumosPage;
