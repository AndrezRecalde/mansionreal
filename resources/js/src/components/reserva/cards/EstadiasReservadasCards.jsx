import {
    Badge,
    Card,
    Center,
    Paper,
    SimpleGrid,
    Text,
    ThemeIcon,
    useMantineTheme,
} from "@mantine/core";
import { useEstadiaStore, useUiConsumo } from "../../../hooks";
import { IconBeach, IconCalendar } from "@tabler/icons-react";
import classes from "../modules/EstadiasReservadasCards.module.css";
import dayjs from "dayjs";
import "dayjs/locale/es"; // importar español
dayjs.locale("es");

export const EstadiasReservadasCards = () => {
    const theme = useMantineTheme();

    const { estadias, fnAsignarEstadia } = useEstadiaStore();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();

    const getEstadoColor = (theme, estadoColor) => {
        if (theme.colors[estadoColor]) {
            return theme.colors[estadoColor][7];
        }
        return estadoColor;
    };

    const formatFecha = (fecha) =>
        dayjs(fecha)
            .locale("es")
            .format("DD-MMMM")
            .replace(/-./, (s) => s.toUpperCase());

    const handleAbrirConsumos = (estadia) => {
        fnAsignarEstadia(estadia);
        fnAbrirDrawerConsumosDepartamento(true);
    }

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }}>
            {estadias.length > 0 ? (
                estadias.map((estadia) => (
                    <Card
                        key={estadia.id}
                        radius="md"
                        withBorder
                        className={classes.card}
                        mt={20}
                        onDoubleClick={() => handleAbrirConsumos(estadia)}
                    >
                        <ThemeIcon
                            className={classes.icon}
                            size={60}
                            radius={60}
                            variant="default"
                        >
                            <IconBeach size={32} stroke={1.5} />
                        </ThemeIcon>

                        <Center>
                            <Text fz={14} fw={500}>
                                {estadia.huesped || "Sin Huesped"}
                            </Text>
                        </Center>
                        <Center>
                            <Text fz={12} fw={500} c="dimmed">
                                Huesped Anfitrion
                            </Text>
                        </Center>
                        <Card.Section mt="sm" withBorder inheritPadding py={10}>
                            <Center>
                                <IconCalendar size={16} stroke={1.5} />
                                <Text size="xs">
                                    {`${formatFecha(
                                        estadia.fecha_checkin
                                    )} - ${formatFecha(
                                        estadia.fecha_checkout
                                    )}`}
                                </Text>
                            </Center>
                        </Card.Section>
                        <Card.Section
                            withBorder
                            className={classes.section}
                            bg={getEstadoColor(
                                theme,
                                estadia.estado_color
                            )}
                        >
                            <Badge
                                variant="filled"
                                color={estadia.estado_color}
                                size="lg"
                                radius="lg"
                                fullWidth
                                style={{
                                    backgroundColor: "transparent",
                                }}
                            >
                                {estadia.estado}
                            </Badge>
                        </Card.Section>
                    </Card>
                ))
            ) : (
                <div>No se han registrado departamentos</div>
            )}
        </SimpleGrid>
    );
};
