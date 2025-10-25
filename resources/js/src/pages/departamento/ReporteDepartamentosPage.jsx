import { Container, Divider, Grid } from "@mantine/core";
import {
    BtnExportacionPDF,
    ConsultarEstadiasSection,
    ConsultarReservaSection,
    FiltrarPorFechasForm,
    TitlePage,
} from "../../components";
import {
    useDashboardKPIStore,
    useDashIngresosPorDepartamentoStore,
    useDashRankingProductosStore,
    useDepartamentoStore,
    useEstadiaStore,
    useStorageField,
    useTitleHook,
} from "../../hooks";
import { useEffect, useState } from "react";
import KPICard from "../../components/dashboard/KPICard";
import Swal from "sweetalert2";
import DepartmentBarChart from "../../components/dashboard/DepartmentBarChart";
import EstadiasBarChart from "../../components/dashboard/EstadiasBarChart";
import ProductPieChart from "../../components/dashboard/ProductPieChart";
import DepartmentBarChartExport from "../../components/dashboard/export/DepartmentBarChartExport";
import EstadiasBarChartExport from "../../components/dashboard/export/EstadiasBarChartExport";
import ProductPieChartExport from "../../components/dashboard/export/ProductPieChartExport";

const ReporteDepartamentosPage = () => {
    useTitleHook("Reporte Reservas - Mansión Real");

    // Estados para exportación
    const [isExporting, setIsExporting] = useState(false);
    const [exportData, setExportData] = useState(null);
    const [chartImages, setChartImages] = useState({
        departamentos: null,
        estadias: null,
        productos: null,
    });

    const {
        cargando,
        departamentos,
        cargandoExportacion,
        fnCargarReporteDepartamentosPorFechas,
        fnExportarKpiYDepartamentosPdfConGrafico,
        fnLimpiarDepartamentos,
    } = useDepartamentoStore();

    const {
        cargandoPDFReporte,
        estadias,
        fnCargarReporteEstadiasPorFechas,
        fnLimpiarEstadias,
    } = useEstadiaStore();
    const { kpis, fnCargarResumenKPI, fnLimpiarResumenKPI } =
        useDashboardKPIStore();
    const { storageFields, fnSetStorageFields } = useStorageField();
    const {
        rankingProductos,
        fnCargarRankingProductos,
        fnLimpiarRankingProductos,
    } = useDashRankingProductosStore();
    const {
        ingresosPorDepartamento,
        fnCargarIngresosPorDepartamento,
        fnLimpiarIngresosPorDepartamento,
    } = useDashIngresosPorDepartamentoStore();

    useEffect(() => {
        return () => {
            fnLimpiarDepartamentos();
            fnLimpiarResumenKPI();
            fnLimpiarEstadias();
            fnLimpiarRankingProductos();
            fnLimpiarIngresosPorDepartamento();
            fnSetStorageFields(null);
        };
    }, []);

    useEffect(() => {
        if (
            cargandoExportacion === true ||
            cargandoPDFReporte === true ||
            isExporting === true
        ) {
            Swal.fire({
                icon: "warning",
                text: "Un momento porfavor, se está exportando",
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close();
        }
    }, [cargandoExportacion, cargandoPDFReporte, isExporting]);

    // Efecto para verificar si todas las imágenes están listas
    useEffect(() => {
        if (
            chartImages.departamentos &&
            chartImages.estadias &&
            chartImages.productos &&
            exportData
        ) {
            // Todas las imágenes están listas, proceder con la exportación
            fnExportarKpiYDepartamentosPdfConGrafico(exportData, chartImages);

            // Limpiar estado
            setExportData(null);
            setIsExporting(false);
            setChartImages({
                departamentos: null,
                estadias: null,
                productos: null,
            });
        }
    }, [chartImages, exportData]);

    const handleExportarKpiYDepartamentosPDF = () => {
        const datos = {
            p_fecha_inicio: storageFields?.p_fecha_inicio,
            p_fecha_fin: storageFields?.p_fecha_fin,
            p_anio: storageFields?.p_anio,
            departamento_id: null,
        };
        setIsExporting(true);
        setExportData(datos);
        setChartImages({
            departamentos: null,
            estadias: null,
            productos: null,
        });
    };

    // Callbacks individuales para cada gráfico
    const handleDepartamentosImageGenerated = (imageDataURL) => {
        setChartImages((prev) => ({
            ...prev,
            departamentos: imageDataURL,
        }));
    };

    const handleEstadiasImageGenerated = (imageDataURL) => {
        setChartImages((prev) => ({
            ...prev,
            estadias: imageDataURL,
        }));
    };

    const handleProductosImageGenerated = (imageDataURL) => {
        setChartImages((prev) => ({
            ...prev,
            productos: imageDataURL,
        }));
    };

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Reporte Reservas — Estadías</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={cargando}
                fnHandleAction={(values) => {
                    fnCargarReporteDepartamentosPorFechas(values);
                    fnCargarReporteEstadiasPorFechas(values);
                    fnCargarResumenKPI(values);
                    fnSetStorageFields(values);
                    fnCargarIngresosPorDepartamento(values);
                    fnCargarRankingProductos(values);
                }}
            />
            {departamentos.length > 0 && (
                <div>
                    <BtnExportacionPDF
                        handleActionExport={handleExportarKpiYDepartamentosPDF}
                    />
                    <Grid mb="md" grow>
                        {kpis.map((kpi) => (
                            <Grid.Col span={2} key={kpi.label}>
                                <KPICard
                                    label={kpi.label}
                                    value={kpi.value}
                                    color={kpi.color}
                                />
                            </Grid.Col>
                        ))}
                    </Grid>
                </div>
            )}
            <ConsultarReservaSection />
            <ConsultarEstadiasSection />
            {departamentos.length > 0 && (
                <Grid mt="md" mb="md">
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                        <DepartmentBarChart />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                        <EstadiasBarChart />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <ProductPieChart />
                    </Grid.Col>
                </Grid>
            )}

            {/* Componentes ocultos para generar las imágenes */}
            {isExporting && (
                <>
                    <DepartmentBarChartExport
                        ingresosPorDepartamento={ingresosPorDepartamento}
                        onImageGenerated={handleDepartamentosImageGenerated}
                    />
                    <EstadiasBarChartExport
                        estadias={estadias}
                        onImageGenerated={handleEstadiasImageGenerated}
                    />
                    <ProductPieChartExport
                        rankingProductos={rankingProductos}
                        onImageGenerated={handleProductosImageGenerated}
                    />
                </>
            )}
        </Container>
    );
};

export default ReporteDepartamentosPage;
