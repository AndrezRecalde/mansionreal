import {
    Image,
    Title,
    SimpleGrid,
    Group,
    Text,
    Card,
    Center,
    Badge,
    Grid,
} from "@mantine/core";
import { BtnSection, ConsumosTotalTable } from "../../../components";
import {
    useDashboardKPIStore,
    useDepartamentoStore,
    useStorageField,
} from "../../../hooks";
import { IconBuilding, IconPackageExport } from "@tabler/icons-react";
import classes from "../modules/ConsultaReservaSection.module.css";
import KPICard from "../../dashboard/KPICard";

export const ConsultarReservaSection = () => {
    const {
        departamentos,
        fnExportarConsumosPorDepartamentoPDF,
        fnExportarKpiYDepartamentosPdf,
    } = useDepartamentoStore();
    const { kpis } = useDashboardKPIStore();
    const { storageFields } = useStorageField();

    const handleExportarPorDepartamentoPDF = (departamento) => {
        //console.log("Exportar PDF una reserva", departamento);
        fnExportarConsumosPorDepartamentoPDF({
            p_fecha_inicio: storageFields?.p_fecha_inicio,
            p_fecha_fin: storageFields?.p_fecha_fin,
            p_anio: storageFields?.p_anio,
            departamento_id: departamento.id,
        });
    };

    const handleExportarKpiYDepartamentosPDF = () => {
        //console.log("Exportar PDF todas las reservas");
        fnExportarKpiYDepartamentosPdf({
            p_fecha_inicio: storageFields?.p_fecha_inicio,
            p_fecha_fin: storageFields?.p_fecha_fin,
            p_anio: storageFields?.p_anio,
            departamento_id: null,
        });
    };

    return (
        <div>
            {/* Botón superior fuera de la grilla */}
            {departamentos.length > 0 && (
                <div>
                    <BtnSection
                        fullWidth
                        fontSize={12}
                        mb={10}
                        mt={10}
                        IconSection={IconPackageExport}
                        variant="default"
                        handleAction={handleExportarKpiYDepartamentosPDF}
                    >
                        Exportar PDF Todas las Reservas
                    </BtnSection>
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

            {/* Grilla de reservas */}
            <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2 }} mt={10}>
                {departamentos.length > 0 ? (
                    departamentos.map((departamento) => (
                        <Card
                            withBorder
                            radius="md"
                            className={classes.card}
                            key={departamento.id}
                        >
                            <Card.Section className={classes.imageSection}>
                                <Image
                                    src={`/storage/${departamento.imagen_departamento}`}
                                    alt={`departamento-${departamento.nombre_departamento}`}
                                    fit="cover"
                                    w="100%"
                                    h={{ base: 90, sm: 90, md: 120 }}
                                    styles={{
                                        image: { objectPosition: "center" },
                                    }}
                                />
                            </Card.Section>
                            <Group justify="space-between" mt="md">
                                <div>
                                    <Text fw={500}>
                                        Departamento -{" "}
                                        {departamento.nombre_departamento}
                                    </Text>
                                    <Text fz="xs" c="dimmed">
                                        Numero Departamento
                                    </Text>
                                </div>
                                <Badge variant="outline">
                                    {departamento.tipo_departamento}
                                </Badge>
                            </Group>

                            <Group gap={8} mb={-8} mt={5}>
                                <Center>
                                    <IconBuilding
                                        size={16}
                                        className={classes.icon}
                                        stroke={1.5}
                                    />
                                    <Text size="xs">
                                        capacidad: {departamento.capacidad}{" "}
                                        personas
                                    </Text>
                                </Center>
                            </Group>
                            <Card.Section className={classes.section} mt="md">
                                <Text
                                    fz="sm"
                                    c="dimmed"
                                    className={classes.label}
                                >
                                    Total Consumos
                                </Text>
                                <ConsumosTotalTable
                                    departamento={departamento}
                                />
                            </Card.Section>
                            <Card.Section className={classes.section}>
                                <Group gap={30} justify="space-between">
                                    <div>
                                        <Text
                                            fz="xl"
                                            fw={700}
                                            style={{ lineHeight: 1 }}
                                        >
                                            ${departamento.precio_unitario}
                                        </Text>
                                        <Text
                                            fz="sm"
                                            c="dimmed"
                                            fw={500}
                                            style={{ lineHeight: 1 }}
                                            mt={3}
                                        >
                                            por noche
                                        </Text>
                                    </div>
                                    <BtnSection
                                        radius="sm"
                                        heigh={30}
                                        IconSection={IconPackageExport}
                                        handleAction={() =>
                                            handleExportarPorDepartamentoPDF(
                                                departamento
                                            )
                                        }
                                    >
                                        Exportar PDF
                                    </BtnSection>
                                </Group>
                            </Card.Section>
                        </Card>
                    ))
                ) : (
                    <Title order={4} align="center" mt={20} mb={20}>
                        No hay reservas para mostrar
                    </Title>
                )}
            </SimpleGrid>
        </div>
    );
};
