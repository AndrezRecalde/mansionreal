import {
    ActionIcon,
    Badge,
    Card,
    Center,
    SimpleGrid,
    ThemeIcon,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import { TextSection } from "../../../components";
import { useEstadiaStore, useUiConsumo } from "../../../hooks";
import { formatFechaModal, getEstadoColor } from "../../../helpers/fnHelper";
import { IconBeach, IconCalendar, IconEye } from "@tabler/icons-react";
import classes from "../modules/EstadiasReservadasCards.module.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

export const EstadiasReservadasCards = () => {
    const theme = useMantineTheme();

    const { estadias, fnAsignarEstadia } = useEstadiaStore();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();

    const handleAbrirConsumos = (estadia) => {
        fnAsignarEstadia(estadia);
        fnAbrirDrawerConsumosDepartamento(true);
    };

    return (
        <div>
            {estadias.length > 0 ? (
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 3 }}
                    spacing={{ base: "xl", sm: "lg", md: "md" }}
                    verticalSpacing={{ base: "xl", sm: "lg" }}
                >
                    {estadias.map((estadia) => (
                        <Card
                            key={estadia.id}
                            radius="md"
                            withBorder
                            className={classes.card}
                            mt={20}
                            onDoubleClick={() => handleAbrirConsumos(estadia)}
                            style={{ position: "relative" }}
                        >
                            {/* Botón para abrir consumos - funciona en móviles y desktop */}
                            <Tooltip
                                label="Ver consumos"
                                position="left"
                                withArrow
                            >
                                <ActionIcon
                                    variant="light"
                                    size="lg"
                                    radius="xl"
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        zIndex: 1,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAbrirConsumos(estadia);
                                    }}
                                    aria-label="Ver consumos"
                                >
                                    <IconEye size={20} stroke={1.5} />
                                </ActionIcon>
                            </Tooltip>

                            <ThemeIcon
                                className={classes.icon}
                                size={70}
                                radius={60}
                                variant="default"
                            >
                                <IconBeach size={32} stroke={1.5} />
                            </ThemeIcon>

                            <Center>
                                <TextSection fw={500} tt="">
                                    {estadia.huesped || "Sin Huesped"}
                                </TextSection>
                            </Center>
                            <Center>
                                <TextSection
                                    fz={12}
                                    fw={500}
                                    color="dimmed"
                                    tt=""
                                >
                                    Huesped Anfitrion
                                </TextSection>
                            </Center>

                            <Card.Section
                                mt="sm"
                                withBorder
                                inheritPadding
                                py={10}
                            >
                                <Center>
                                    <IconCalendar size={16} stroke={1.5} />
                                    <TextSection fz={12} tt="">
                                        {`${formatFechaModal(
                                            estadia.fecha_checkin,
                                        )} - ${formatFechaModal(
                                            estadia.fecha_checkout,
                                        )}`}
                                    </TextSection>
                                </Center>
                            </Card.Section>
                            <Card.Section
                                withBorder
                                className={classes.section}
                                bg={getEstadoColor(
                                    theme,
                                    estadia?.estado?.color,
                                )}
                            >
                                <Badge
                                    variant="filled"
                                    color={estadia?.estado?.color}
                                    size="lg"
                                    radius="lg"
                                    fullWidth
                                    style={{
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <TextSection
                                        fz={14}
                                        fw={700}
                                        tt=""
                                        style={{ letterSpacing: "1px" }}
                                    >
                                        {estadia?.estado?.nombre_estado ||
                                            "SIN ESTADO"}{" "}
                                        - {estadia.codigo_reserva}
                                    </TextSection>
                                </Badge>
                            </Card.Section>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Card shadow="sm" radius="md" p="lg" withBorder>
                    <Card.Section inheritPadding py="xs">
                        <Center>
                            <TextSection>
                                No hay estadías reservadas
                            </TextSection>
                        </Center>
                    </Card.Section>
                </Card>
            )}
        </div>
    );
};
