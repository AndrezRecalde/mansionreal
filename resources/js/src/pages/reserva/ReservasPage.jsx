import { Container, Divider } from "@mantine/core";
import {
    ConsultarReservaSection,
    FiltrarPorFechasForm,
    TitlePage,
} from "../../components";
import { useReservaDepartamentoStore } from "../../hooks";
import { useEffect } from "react";

const ReservasPage = () => {
    const {
        cargando,
        fnCargarReporteDepartamentosPorFechas,
        fnLimpiarReservas,
    } = useReservaDepartamentoStore();

    useEffect(() => {
        return () => {
            fnLimpiarReservas();
        };
    }, []);

    return (
        <Container size="lg" my={20}>
            <TitlePage order={2}>Reporte Reservas</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={cargando}
                fnHandleAction={fnCargarReporteDepartamentosPorFechas}
            />
            {/* <ConsultarReservaSection /> */}
            <ConsultarReservaSection />
        </Container>
    );
};

export default ReservasPage;
