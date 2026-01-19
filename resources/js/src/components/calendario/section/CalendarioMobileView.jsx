import { useState, useMemo } from "react";
import {
    Stack,
    Card,
    Text,
    Badge,
    Group,
    Paper,
    ActionIcon,
    Box,
    ScrollArea,
    UnstyledButton,
    Indicator,
    Divider,
} from "@mantine/core";
import {
    IconChevronLeft,
    IconChevronRight,
    IconCalendarEvent,
    IconUser,
    IconMapPin,
    IconClock,
} from "@tabler/icons-react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import classes from "../modules/CalendarioMobileView.module.css";

/**
 * Vista móvil tipo Google Calendar
 * Mini calendario + lista de eventos
 */
export const CalendarioMobileView = ({ reservas, onSelectEvent }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Obtener días del calendario (incluyendo días de otros meses para completar la cuadrícula)
    const diasCalendario = useMemo(() => {
        const inicio = startOfMonth(currentMonth);
        const fin = endOfMonth(currentMonth);
        const inicioSemana = startOfWeek(inicio, { weekStartsOn: 1 });
        const finSemana = endOfWeek(fin, { weekStartsOn: 1 });

        return eachDayOfInterval({ start: inicioSemana, end: finSemana });
    }, [currentMonth]);

    // Verificar si un día tiene eventos
    const tieneEventos = (fecha) => {
        return reservas.some((reserva) =>
            isSameDay(new Date(reserva.start), fecha)
        );
    };

    // Obtener eventos de la fecha seleccionada
    const eventosSeleccionados = useMemo(() => {
        return reservas.filter((reserva) =>
            isSameDay(new Date(reserva.start), selectedDate)
        );
    }, [reservas, selectedDate]);

    // Navegación de mes
    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleToday = () => {
        setCurrentMonth(new Date());
        setSelectedDate(new Date());
    };

    // Seleccionar día
    const handleSelectDay = (fecha) => {
        setSelectedDate(fecha);
        if (!isSameMonth(fecha, currentMonth)) {
            setCurrentMonth(fecha);
        }
    };

    return (
        <Box className={classes.container}>
            {/* Mini Calendario */}
            <Card withBorder radius="md" className={classes.calendarCard}>
                {/* Header del calendario */}
                <Group justify="space-between" mb="md">
                    <ActionIcon
                        variant="subtle"
                        onClick={handlePrevMonth}
                        size="lg"
                    >
                        <IconChevronLeft size={20} />
                    </ActionIcon>

                    <UnstyledButton onClick={handleToday}>
                        <Text fw={600} size="md" tt="capitalize">
                            {format(currentMonth, "MMMM yyyy", { locale: es })}
                        </Text>
                    </UnstyledButton>

                    <ActionIcon
                        variant="subtle"
                        onClick={handleNextMonth}
                        size="lg"
                    >
                        <IconChevronRight size={20} />
                    </ActionIcon>
                </Group>

                {/* Días de la semana */}
                <Group gap={0} mb="xs" grow>
                    {["L", "M", "X", "J", "V", "S", "D"].map((dia) => (
                        <Text
                            key={dia}
                            size="xs"
                            c="dimmed"
                            fw={600}
                            ta="center"
                        >
                            {dia}
                        </Text>
                    ))}
                </Group>

                {/* Grid de días */}
                <Box className={classes.daysGrid}>
                    {diasCalendario.map((fecha, index) => {
                        const esHoy = isToday(fecha);
                        const esSeleccionado = isSameDay(fecha, selectedDate);
                        const esMesActual = isSameMonth(fecha, currentMonth);
                        const tieneReservas = tieneEventos(fecha);

                        return (
                            <UnstyledButton
                                key={index}
                                onClick={() => handleSelectDay(fecha)}
                                className={classes.dayButton}
                                data-today={esHoy || undefined}
                                data-selected={esSeleccionado || undefined}
                                data-other-month={!esMesActual || undefined}
                            >
                                <Indicator
                                    disabled={!tieneReservas}
                                    color="blue"
                                    size={6}
                                    offset={-2}
                                    position="bottom-center"
                                >
                                    <Text size="sm" className={classes.dayText}>
                                        {format(fecha, "d")}
                                    </Text>
                                </Indicator>
                            </UnstyledButton>
                        );
                    })}
                </Box>
            </Card>

            {/* Lista de eventos */}
            <Box className={classes.eventsSection}>
                <Group mb="sm" px="xs">
                    <IconCalendarEvent size={20} />
                    <Text fw={600} size="md">
                        {format(selectedDate, "EEEE, d 'de' MMMM", {
                            locale: es,
                        })}
                    </Text>
                    {eventosSeleccionados.length > 0 && (
                        <Badge size="sm" variant="light" circle>
                            {eventosSeleccionados.length}
                        </Badge>
                    )}
                </Group>

                <Divider mb="sm" />

                <ScrollArea h="calc(100vh - 420px)" type="auto">
                    {eventosSeleccionados.length === 0 ? (
                        <Paper p="xl" radius="md" withBorder>
                            <Stack align="center" gap="xs">
                                <IconCalendarEvent
                                    size={48}
                                    stroke={1}
                                    opacity={0.3}
                                />
                                <Text c="dimmed" size="sm" ta="center">
                                    No hay reservas para este día
                                </Text>
                            </Stack>
                        </Paper>
                    ) : (
                        <Stack gap="xs">
                            {eventosSeleccionados.map((evento) => (
                                <EventCard
                                    key={evento.id}
                                    evento={evento}
                                    onSelect={onSelectEvent}
                                />
                            ))}
                        </Stack>
                    )}
                </ScrollArea>
            </Box>
        </Box>
    );
};

/**
 * Card individual de evento
 */
const EventCard = ({ evento, onSelect }) => {
    return (
        <Card
            withBorder
            radius="md"
            p="sm"
            className={classes.eventCard}
            onClick={() => onSelect(evento)}
            style={{
                borderLeftWidth: 4,
                borderLeftColor: evento.backgroundColor,
            }}
        >
            <Group justify="space-between" wrap="nowrap" mb="xs">
                <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <Box
                        className={classes.eventColorDot}
                        style={{ backgroundColor: evento.backgroundColor }}
                    />
                    <Text fw={600} size="sm" lineClamp={1}>
                        {evento.title}
                    </Text>
                </Group>
                {evento?.estado && (
                    <Badge
                        size="xs"
                        variant="light"
                        color={evento.backgroundColor}
                        style={{ flexShrink: 0 }}
                    >
                        {evento?.estado.nombre_estado}
                    </Badge>
                )}
            </Group>

            <Stack gap={6}>
                {/* Horario */}
                <Group gap="xs">
                    <IconClock size={14} stroke={1.5} opacity={0.6} />
                    <Text size="xs" c="dimmed">
                        {format(new Date(evento.start), "HH:mm")} -{" "}
                        {format(new Date(evento.end), "HH:mm")}
                    </Text>
                </Group>

                {/* Huésped */}
                {evento?.huesped?.nombres_completos && (
                    <Group gap="xs">
                        <IconUser size={14} stroke={1.5} opacity={0.6} />
                        <Text size="xs" c="dimmed" lineClamp={1}>
                            {evento?.huesped.nombres_completos}
                        </Text>
                    </Group>
                )}

                {/* Departamento */}
                {evento?.departamento?.numero && (
                    <Group gap="xs">
                        <IconMapPin size={14} stroke={1.5} opacity={0.6} />
                        <Text size="xs" c="dimmed">
                            Depto. {evento.departamento.numero}
                            {evento.departamento.tipo &&
                                ` - ${evento.departamento.tipo}`}
                        </Text>
                    </Group>
                )}
            </Stack>

            {/* Código de reserva */}
            {evento?.codigo_reserva && (
                <Text size="sm" c="dimmed" mt="xs" ta="right" fw={500}>
                    #{evento?.codigo_reserva}
                </Text>
            )}
        </Card>
    );
};
