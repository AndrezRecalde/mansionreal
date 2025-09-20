import {
    Grid,
    Card,
    Group,
    Title,
    Container,
    ActionIcon,
    Paper,
    rem,
} from "@mantine/core";
import { DateInput, YearPickerInput } from "@mantine/dates";
import {
    useDashHuepedGananciaStore,
    useDashIngresosPorDepartamentoStore,
    useDashRankingProductosStore,
    useTitleHook,
} from "../../hooks";
import { IconSearch } from "@tabler/icons-react";
import KPICard from "../../components/dashboard/KPICard";
import OccupancyLineChart from "../../components/dashboard/OccupancyLineChart";
import DepartmentBarChart from "../../components/dashboard/DepartmentBarChart";
import ProductPieChart from "../../components/dashboard/ProductPieChart";
import ReservationsTable from "../../components/dashboard/ReservationsTable";
import GuestsRankingTable from "../../components/dashboard/GuestsRankingTable";
import { useDashboardKPIStore } from "../../hooks/dashboard/useDashboardKPIStore";
import { useEffect } from "react";

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

    useEffect(() => {
        fnCargarResumenKPI({ p_anio: new Date().getFullYear() });
        fnCargarHuespedesGananciasMes(new Date().getFullYear());
        fnCargarRankingProductos({ anio: new Date().getFullYear() });
        fnCargarIngresosPorDepartamento({ anio: new Date().getFullYear() });
        return () => {
            fnLimpiarResumenKPI();
            fnLimpiarHuespedesGananciasMes();
            fnLimpiarRankingProductos();
            fnLimpiarIngresosPorDepartamento();
        };
    }, []);

    return (
        <Container size="xl">
            <Title order={2} mb="md">
                Panel Administrativo
            </Title>
            {/* Filtros */}
            <Paper p={15} mb={20} radius="md" shadow="xs" withBorder>
                <Group gap="xs" align="end" wrap="wrap">
                    <DateInput
                        valueFormat="YYYY-MM-DD"
                        label={null}
                        placeholder="Fecha Inicio"
                        size="sm"
                        style={{ minWidth: rem(110) }}
                    />
                    <DateInput
                        valueFormat="YYYY-MM-DD"
                        label={null}
                        placeholder="Fecha Fin"
                        size="sm"
                        radius="md"
                        style={{ minWidth: rem(110) }}
                    />
                    <YearPickerInput
                        label={null}
                        placeholder="Año"
                        value={new Date()}
                        size="sm"
                        style={{ minWidth: rem(70) }}
                    />
                    <ActionIcon
                        color="indigo"
                        variant="filled"
                        size={rem(34)}
                        radius="xl"
                        aria-label="Buscar"
                    >
                        <IconSearch size={18} stroke={2} />
                    </ActionIcon>
                </Group>
            </Paper>

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
