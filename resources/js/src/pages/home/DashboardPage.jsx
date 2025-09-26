import { useEffect } from "react";
import {
    Grid,
    Card,
    Title,
    Container,
} from "@mantine/core";
import {
    useDashboardKPIStore,
    useDashHuepedGananciaStore,
    useDashHuespedStore,
    useDashIngresosPorDepartamentoStore,
    useDashRankingProductosStore,
    useTitleHook,
} from "../../hooks";
import KPICard from "../../components/dashboard/KPICard";
import OccupancyLineChart from "../../components/dashboard/OccupancyLineChart";
import DepartmentBarChart from "../../components/dashboard/DepartmentBarChart";
import ProductPieChart from "../../components/dashboard/ProductPieChart";
import ReservationsTable from "../../components/dashboard/ReservationsTable";
import GuestsRankingTable from "../../components/dashboard/GuestsRankingTable";
import { FiltrarPorFechasForm } from "../../components";

export default function DashboardPage() {
    useTitleHook("Dashboard - Mansión Real");

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
    const { fnCargarHuespedesRecurrentes, fnLimpiarHuespedesRecurrentes } =
        useDashHuespedStore();

    useEffect(() => {
        fnCargarResumenKPI({ p_anio: new Date().getFullYear() });
        fnCargarHuespedesGananciasMes(new Date().getFullYear());
        fnCargarRankingProductos({ anio: new Date().getFullYear() });
        fnCargarIngresosPorDepartamento({ anio: new Date().getFullYear() });
        fnCargarHuespedesRecurrentes({ anio: new Date().getFullYear() });
        return () => {
            fnLimpiarResumenKPI();
            fnLimpiarHuespedesGananciasMes();
            fnLimpiarRankingProductos();
            fnLimpiarIngresosPorDepartamento();
            fnLimpiarHuespedesRecurrentes();
        };
    }, []);

    return (
        <Container size="xl">
            <Title order={2} mb="md">
                Panel Administrativo
            </Title>
            {/* Filtros */}
            {/* <FiltrarPorFechasForm
                titulo="Filtrar por Año"
                fnHandleAction={(values) => {
                    fnCargarResumenKPI(values);
                    fnCargarHuespedesGananciasMes(values.anio);
                    fnCargarRankingProductos({ anio: values.anio });
                    fnCargarIngresosPorDepartamento({ anio: values.anio });
                    fnCargarHuespedesRecurrentes({ anio: values.anio });
                }}
            /> */}

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
                <Grid.Col span={12}>
                    <Card shadow="sm" withBorder>
                        <Title order={4}>Ocupación Mensual</Title>
                        <OccupancyLineChart />
                    </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card shadow="sm" withBorder>
                        <Title order={4}>
                            Ingresos por Tipo de Departamento
                        </Title>
                        <DepartmentBarChart />
                    </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card shadow="sm" withBorder>
                        <Title order={4}>Productos Más Consumidos</Title>
                        <ProductPieChart />
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Listados */}
            <Grid>
                <Grid.Col span={6}>
                    <Card shadow="sm" withBorder>
                        <Title order={4}>Reservas Activas</Title>
                        <ReservationsTable />
                    </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card shadow="sm" withBorder>
                        <Title order={4}>Ranking Huéspedes Recurrentes</Title>
                        <GuestsRankingTable />
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
