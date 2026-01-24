import { Container, Divider } from "@mantine/core";
import { useEffect } from "react";
import {
    FiltrarPorFechasForm,
    TitlePage,
    ReporteConsumosVisualizacion,
    AlertSection,
} from "../../components";
import { useConsumoStore, useTitleHook } from "../../hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import { PAGE_TITLE } from "../../helpers/getPrefix";

const ReporteConsumosPage = () => {
    useTitleHook(PAGE_TITLE.REPORTE_CONSUMOS.TITLE);
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
            //console.log(reporteConsumosCategoria?.metadatos);
            fnExportarReporteConsumosPDF({
                p_fecha_inicio:
                    reporteConsumosCategoria.metadatos.p_fecha_inicio,
                p_fecha_fin: reporteConsumosCategoria.metadatos.p_fecha_fin,
                p_anio: null,
            });
        }
    };

    return (
        <Container size="xl" py="md">
            <TitlePage order={2}>
                {PAGE_TITLE.REPORTE_CONSUMOS.TITLE_PAGE}
            </TitlePage>
            <Divider my={10} />

            {/* Formulario de filtros */}
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={cargando}
                fnHandleAction={(values) => handleBuscar(values)}
            />

            {/* Mensajes de error */}
            {errores && (
                <AlertSection
                    icon={IconAlertCircle}
                    title={PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.ERROR_ALERT.TITLE}
                    color={PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.ERROR_ALERT.COLOR}
                >
                    {errores.general
                        ? errores.general[0]
                        : PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.ERROR_ALERT.MESSAGE}
                </AlertSection>
            )}

            {/* Mensajes de éxito */}
            {mensaje && (
                <AlertSection
                    icon={IconAlertCircle}
                    title={PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.SUCCESS_ALERT.TITLE}
                    color={PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.SUCCESS_ALERT.COLOR}
                >
                    {mensaje.msg}
                </AlertSection>
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
