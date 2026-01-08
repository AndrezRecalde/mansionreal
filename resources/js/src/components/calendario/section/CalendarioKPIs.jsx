import { Card, Group, Paper, ThemeIcon, rem } from "@mantine/core";
import {
    IconBed,
    IconCalendar,
    IconClock,
    IconRefresh,
    IconUsers,
} from "@tabler/icons-react";
import { BtnSection, TextSection, TitlePage } from "../../../components";

const KPICard = ({ icon: Icon, label, value, color = "blue. 7" }) => (
    <Paper
        p="md"
        withBorder
        radius="md"
        shadow="xs" // A��ade sutileza

        styles={{
            root: {
                "&:hover": {
                    boxShadow: "var(--mantine-shadow-md)",
                    transform: "translateY(-2px)",
                },
            },
        }}
    >
        <Group gap="md">
            <ThemeIcon size="xl" variant="light" color={color} radius="xl">
                <Icon style={{ width: rem(24), height: rem(24) }} />
            </ThemeIcon>
            <div>
                <TextSection fz={12} color="dimmed" fw={500} mb={4}>
                    {label}
                </TextSection>
                <TextSection fw={700} fz={16} color={color}>
                    {value}
                </TextSection>
            </div>
        </Group>
    </Paper>
);

const getOcupacionColor = (porcentaje) => {
    if (porcentaje > 80) return "red";
    if (porcentaje > 60) return "orange";
    return "green";
};

export const CalendarioKPIs = ({ estadisticas, onRefresh, cargando }) => {
    if (!estadisticas) return null;

    const ocupacionColor = getOcupacionColor(estadisticas.porcentaje_ocupacion);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
                <TitlePage order={3}>KPIs de Ocupación</TitlePage>
                <BtnSection
                    IconSection={IconRefresh}
                    handleAction={onRefresh}
                    variant="light"
                    disabled={cargando}
                    //iconColor={"indigo"}
                >
                    Actualizar
                </BtnSection>
            </Group>
            <Group grow mt={10}>
                <KPICard
                    icon={IconBed}
                    label="Departamentos"
                    value={estadisticas.total_departamentos}
                    color="blue.8"
                />
                <KPICard
                    icon={IconCalendar}
                    label="Días Periodo"
                    value={estadisticas.dias_periodo}
                    color="indigo.7"
                />
                <KPICard
                    icon={IconClock}
                    label="Noches Posibles"
                    value={estadisticas.noches_posibles}
                    color="gray.7"
                />
                <KPICard
                    icon={IconBed}
                    label="Noches Ocupadas"
                    value={estadisticas.noches_ocupadas}
                    color="blue.6"
                />
                <KPICard
                    icon={IconUsers}
                    label="Ocupación"
                    value={`${estadisticas.porcentaje_ocupacion}%`}
                    color={ocupacionColor}
                />
            </Group>
        </Card>
    );
};
