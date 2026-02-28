import { Container, Divider } from "@mantine/core";
import {
    FiltrarPorFechasCodigo,
    PagosHistorialTable,
    TitlePage,
} from "../../components";
import { usePagoStore, useTitleHook } from "../../hooks";

const HistorialPagosPage = () => {
    useTitleHook("Historial de Pagos - Mansión Real");
    const { cargando, fnCargarHistorialPagos } = usePagoStore();

    const handleBuscar = (values) => {
        // FiltrarPorFechasCodigo emite: { codigo_reserva, fecha_inicio, fecha_fin, anio }
        fnCargarHistorialPagos({
            codigo_reserva: values.codigo_reserva ?? null,
            fecha_inicio: values.fecha_inicio ?? null,
            fecha_fin: values.fecha_fin ?? null,
            anio: values.anio ?? null,
        });
    };

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Historial de Pagos</TitlePage>
            <Divider my={10} />

            <FiltrarPorFechasCodigo
                cargando={cargando}
                fnHandleAction={handleBuscar}
            />

            <Divider my={10} />
            <PagosHistorialTable />
        </Container>
    );
};

export default HistorialPagosPage;
