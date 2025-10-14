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
    useDepartamentoStore,
    useEstadiaStore,
    useStorageField,
} from "../../hooks";
import { useEffect } from "react";
import KPICard from "../../components/dashboard/KPICard";
import Swal from "sweetalert2";

const ReporteDepartamentosPage = () => {
    const {
        cargando,
        departamentos,
        cargandoExportacion,
        fnCargarReporteDepartamentosPorFechas,
        fnExportarKpiYDepartamentosPdf,
        fnLimpiarDepartamentos,
    } = useDepartamentoStore();
    const { fnCargarReporteEstadiasPorFechas, fnLimpiarEstadias } =
        useEstadiaStore();
    const { kpis, fnCargarResumenKPI, fnLimpiarResumenKPI } =
        useDashboardKPIStore();
    const { storageFields, fnSetStorageFields } = useStorageField();

    useEffect(() => {
        return () => {
            fnLimpiarDepartamentos();
            fnLimpiarResumenKPI();
            fnLimpiarEstadias();
            fnSetStorageFields(null);
        };
    }, []);

    useEffect(() => {
        if (cargandoExportacion === true) {
            Swal.fire({
                icon: "warning",
                text: "Un momento porfavor, se está exportando",
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close(); // Cierra el modal cuando isExport es false
        }
    }, [cargandoExportacion]);

    const handleExportarKpiYDepartamentosPDF = () => {
        fnExportarKpiYDepartamentosPdf({
            p_fecha_inicio: storageFields?.p_fecha_inicio,
            p_fecha_fin: storageFields?.p_fecha_fin,
            p_anio: storageFields?.p_anio,
            departamento_id: null,
        });
    };

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Reporte Departamentos</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={cargando}
                fnHandleAction={(values) => {
                    fnCargarReporteDepartamentosPorFechas(values);
                    fnCargarReporteEstadiasPorFechas(values);
                    fnCargarResumenKPI(values);
                    fnSetStorageFields(values);
                }}
            />
            {/* <ConsultarReservaSection /> */}

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
        </Container>
    );
};

export default ReporteDepartamentosPage;
