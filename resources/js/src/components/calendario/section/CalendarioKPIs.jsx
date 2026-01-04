import { Card, Group, Paper, ThemeIcon, rem } from "@mantine/core";
import {
    IconBed,
    IconCalendar,
    IconClock,
    IconRefresh,
    IconUsers,
} from "@tabler/icons-react";
import { BtnSection, TextSection, TitlePage } from "../../../components";

const KPICard = ({ icon: Icon, label, value, color = "blue" }) => (
    <Paper p="md" withBorder radius="md">
        <Group>
            <ThemeIcon size="lg" variant="light" color={color}>
                <Icon style={{ width: rem(20), height: rem(20) }} />
            </ThemeIcon>
            <div>
                <TextSection tt="" fz={12} color="dimmed">
                    {label}
                </TextSection>
                <TextSection
                    fw={700}
                    fz={18}
                    color={color !== "blue" ? color : undefined}
                >
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
                    iconColor={"teal"}
                >
                    Actualizar
                </BtnSection>
            </Group>
            <Group grow mt={10}>
                <KPICard
                    icon={IconBed}
                    label="Departamentos"
                    value={estadisticas.total_departamentos}
                    color="indigo"
                />
                <KPICard
                    icon={IconCalendar}
                    label="Días Periodo"
                    value={estadisticas.dias_periodo}
                    color="cyan"
                />
                <KPICard
                    icon={IconClock}
                    label="Noches Posibles"
                    value={estadisticas.noches_posibles}
                    color="grape"
                />
                <KPICard
                    icon={IconBed}
                    label="Noches Ocupadas"
                    value={estadisticas.noches_ocupadas}
                    color="orange"
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
