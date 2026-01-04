import { Container, Divider, Alert } from "@mantine/core";
import { useEffect } from "react";
import {
    FiltrarPorFechasForm,
    TitlePage,
    ReporteConsumosVisualizacion,
} from "../../components";
import { useConsumoStore } from "../../hooks";
import { IconAlertCircle } from "@tabler/icons-react";

const ReporteConsumosPage = () => {
    const {
        cargando,
        cargandoPDFReporte,
        reporteConsumosCategoria,
        mensaje,
        errores,
        fnCargarReporteConsumosCategoria,
        fnExportarReporteConsumosPDF,
        fnLimpiarConsumos,
    } = useConsumoStore();

    useEffect(() => {
        // Limpiar datos al desmontar el componente
        return () => {
            fnLimpiarConsumos();
        };
    }, []);

    const handleBuscar = (values) => {
        fnCargarReporteConsumosCategoria(values);
    };

    const handleExportPDF = () => {
        if (reporteConsumosCategoria?.metadatos) {
            console.log(reporteConsumosCategoria?.metadatos);
            fnExportarReporteConsumosPDF({
                p_fecha_inicio: reporteConsumosCategoria.metadatos.p_fecha_inicio,
                p_fecha_fin: reporteConsumosCategoria.metadatos.p_fecha_fin,
                p_anio: null,
            });
        }
    };

    return (
        <Container size="xl" py="md">
            <TitlePage order={2}>Reporte de Consumos por Categoría</TitlePage>
            <Divider my={10} />

            {/* Formulario de filtros */}
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={cargando}
                fnHandleAction={handleBuscar}
            />

            {/* Mensajes de error */}
            {errores && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error"
                    color="red"
                    mt="md"
                    withCloseButton
                >
                    {errores.general
                        ? errores.general[0]
                        : "Ocurrió un error al cargar los datos"}
                </Alert>
            )}

            {/* Mensajes de éxito */}
            {mensaje && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Éxito"
                    color="green"
                    mt="md"
                    withCloseButton
                >
                    {mensaje.msg}
                </Alert>
            )}

            {/* Visualización del reporte */}
            <ReporteConsumosVisualizacion
                reporteData={reporteConsumosCategoria}
                cargandoPDF={cargandoPDFReporte}
                onExportPDF={handleExportPDF}
            />
        </Container>
    );
};

export default ReporteConsumosPage;
