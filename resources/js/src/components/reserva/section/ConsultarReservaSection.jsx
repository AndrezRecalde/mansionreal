import {
    Image,
    SimpleGrid,
    Group,
    Text,
    Card,
    Center,
    Badge,
    useMantineColorScheme,
    Alert,
} from "@mantine/core";
import { BtnSection, ConsumosTotalTable } from "../../../components";
import { useDepartamentoStore, useStorageField } from "../../../hooks";
import {
    IconAlertCircle,
    IconBuilding,
    IconPackageExport,
} from "@tabler/icons-react";
import classes from "../modules/ConsultaReservaSection.module.css";

export const ConsultarReservaSection = () => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const { departamentos, fnExportarConsumosPorDepartamentoPDF } =
        useDepartamentoStore();
    const { storageFields } = useStorageField();

    const handleExportarPorDepartamentoPDF = (departamento) => {
        fnExportarConsumosPorDepartamentoPDF({
            p_fecha_inicio: storageFields?.p_fecha_inicio,
            p_fecha_fin: storageFields?.p_fecha_fin,
            p_anio: storageFields?.p_anio,
            departamento_id: departamento.id,
        });
    };

    if (departamentos.length === 0) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="Sin datos - Reservas"
                color="gray"
                mt="xl"
            >
                No hay datos para mostrar. Por favor, seleccione un rango de
                fechas y presione "Buscar".
            </Alert>
        );
    }

    return (
        <div>
            {/* Grilla de reservas */}
            <SimpleGrid
                cols={{ base: 1, sm: 1, md: 1, lg: 1 }}
                spacing="lg"
                mt={10}
            >
                {departamentos.map((departamento) => (
                    <Card
                        key={departamento.id}
                        withBorder
                        style={{
                            padding: "20px",
                            borderRadius: "12px",
                            background: isDark
                                ? "linear-gradient(135deg, #1A1B1E 0%, #25262B 100%)"
                                : "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
                            boxShadow: isDark
                                ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                                : "0 4px 20px rgba(0, 0, 0, 0.08)",
                            border: isDark ? "1px solid #373A40" : "none",
                        }}
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
                                <Text size="xs" c="dimmed">
                                    Número Departamento
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
                                    capacidad: {departamento.capacidad} personas
                                </Text>
                            </Center>
                        </Group>

                        <Card.Section className={classes.section} mt="md">
                            <Text
                                size="sm"
                                c="dimmed"
                                className={classes.label}
                            >
                                Total Consumos
                            </Text>
                            <ConsumosTotalTable departamento={departamento} />
                        </Card.Section>

                        <Card.Section className={classes.section}>
                            <Group gap={30} justify="space-between">
                                <div>
                                    <Text
                                        size="xl"
                                        fw={700}
                                        style={{ lineHeight: 1 }}
                                    >
                                        ${departamento.precio_unitario}
                                    </Text>
                                    <Text
                                        size="sm"
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
                                    h={30}
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
                ))}
            </SimpleGrid>
        </div>
    );
};
