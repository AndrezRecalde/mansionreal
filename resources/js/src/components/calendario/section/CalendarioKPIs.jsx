import {
    Card,
    Group,
    Paper,
    ThemeIcon,
    rem,
    Stack,
    SimpleGrid,
} from "@mantine/core";
import {
    IconBed,
    IconCalendar,
    IconClock,
    IconRefresh,
    IconUsers,
} from "@tabler/icons-react";
import { BtnSection, TextSection, TitlePage } from "../../../components";
import { useMediaQuery } from "@mantine/hooks";

const KPICard = ({ icon: Icon, label, value, color = "blue.7" }) => (
    <Paper
        p="md"
        withBorder
        radius="md"
        shadow="xs"
        styles={{
            root: {
                "&:hover": {
                    boxShadow: "var(--mantine-shadow-md)",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease",
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
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (!estadisticas) return null;

    const ocupacionColor = getOcupacionColor(estadisticas.porcentaje_ocupacion);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                <Group justify="space-between" wrap="wrap">
                    <TitlePage order={isMobile ? 4 : 3}>
                        KPIs de Ocupación
                    </TitlePage>
                    <BtnSection
                        IconSection={IconRefresh}
                        handleAction={onRefresh}
                        variant="light"
                        disabled={cargando}
                        size={isMobile ? "sm" : "md"}
                    >
                        {isMobile ? "" : "Actualizar"}
                    </BtnSection>
                </Group>

                <SimpleGrid
                    cols={{ base: 1, xs: 2, sm: 3, md: 5 }}
                    spacing={{ base: "xs", sm: "sm", md: "md" }}
                >
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
                </SimpleGrid>
            </Stack>
        </Card>
    );
};
