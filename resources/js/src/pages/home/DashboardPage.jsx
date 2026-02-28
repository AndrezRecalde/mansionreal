import { useEffect } from "react";
import { Grid, Title, Container, Group, Divider } from "@mantine/core";
import {
    useDashboardKPIStore,
    useDashHuepedGananciaStore,
    useDashHuespedStore,
    useDashIngresosPorDepartamentoStore,
    useDashRankingProductosStore,
    useEstadiaStore,
    useTitleHook,
} from "../../hooks";
//import { FiltrarPorFechasForm } from "../../components";
import KPICard from "../../components/dashboard/KPICard";
import OccupancyLineChart from "../../components/dashboard/OccupancyLineChart";
import DepartmentBarChart from "../../components/dashboard/DepartmentBarChart";
import ProductPieChart from "../../components/dashboard/ProductPieChart";
import GuestsRankingTable from "../../components/dashboard/GuestsRankingTable";
import EstadiasBarChart from "../../components/dashboard/EstadiasBarChart";
import { FiltrarPorFechasForm } from "../../components";
import { PAGE_TITLE } from "../../helpers/getPrefix";

export default function DashboardPage() {
    useTitleHook(PAGE_TITLE.DASHBOARD.TITLE);
    const { kpis, fnCargarResumenKPI, fnLimpiarResumenKPI } =
        useDashboardKPIStore();
    const { fnCargarHuespedesGananciasMes, fnLimpiarHuespedesGananciasMes } =
        useDashHuepedGananciaStore();
    const { fnCargarRankingProductos, fnLimpiarRankingProductos } =
        useDashRankingProductosStore();
    const {
        fnCargarIngresosPorDepartamento,
        fnLimpiarIngresosPorDepartamento,
    } = useDashIngresosPorDepartamentoStore();
    const { fnCargarReporteEstadiasPorFechas, fnLimpiarEstadias } =
        useEstadiaStore();
    const { fnCargarHuespedesRecurrentes, fnLimpiarHuespedesRecurrentes } =
        useDashHuespedStore();

    useEffect(() => {
        fnCargarResumenKPI({ p_anio: new Date().getFullYear() });
        fnCargarHuespedesGananciasMes(new Date().getFullYear());
        fnCargarRankingProductos({ p_anio: new Date().getFullYear() });
        fnCargarIngresosPorDepartamento({ p_anio: new Date().getFullYear() });
        fnCargarReporteEstadiasPorFechas({ p_anio: new Date().getFullYear() });
        fnCargarHuespedesRecurrentes({ p_anio: new Date().getFullYear() });
        return () => {
            fnLimpiarResumenKPI();
            fnLimpiarHuespedesGananciasMes();
            fnLimpiarRankingProductos();
            fnLimpiarIngresosPorDepartamento();
            fnLimpiarHuespedesRecurrentes();
            // No limpiar estadías aquí - son datos compartidos con DisponibilidadDepartamentoPage
            // fnLimpiarEstadias();
        };
    }, []);

    return (
        <Container size="xl">
            <Group justify="space-between">
                <Title order={2} mb="md">
                    {PAGE_TITLE.DASHBOARD.TITLE_PAGE}
                </Title>
            </Group>
            <Divider my={10} />

            {/* Filtros */}
            <FiltrarPorFechasForm
                titulo="Filtrar por Año"
                fnHandleAction={(values) => {
                    fnCargarResumenKPI(values);
                    fnCargarHuespedesGananciasMes(values.p_anio);
                    fnCargarRankingProductos({
                        p_anio: values.p_anio,
                        p_fecha_inicio: values.p_fecha_inicio,
                        p_fecha_fin: values.p_fecha_fin,
                    });
                    fnCargarIngresosPorDepartamento({
                        p_anio: values.p_anio,
                        p_fecha_inicio: values.p_fecha_inicio,
                        p_fecha_fin: values.p_fecha_fin,
                    });
                    fnCargarReporteEstadiasPorFechas({
                        p_anio: values.p_anio,
                        p_fecha_inicio: values.p_fecha_inicio,
                        p_fecha_fin: values.p_fecha_fin,
                    });
                    fnCargarHuespedesRecurrentes({
                        p_anio: values.p_anio,
                        p_fecha_inicio: values.p_fecha_inicio,
                        p_fecha_fin: values.p_fecha_fin,
                    });
                }}
            />

            {/* KPIs */}
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

            {/* Gráficas */}
            <Grid mb="md">
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                    <OccupancyLineChart />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <DepartmentBarChart />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <EstadiasBarChart />
                </Grid.Col>
            </Grid>

            {/* Listados */}
            <Grid>
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                    <ProductPieChart />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                    <GuestsRankingTable />
                </Grid.Col>
            </Grid>
        </Container>
    );
}
