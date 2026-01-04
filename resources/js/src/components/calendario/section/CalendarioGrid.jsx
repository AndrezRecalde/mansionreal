import { useMemo, useCallback } from "react";
import { Box, Group, Loader, Text } from "@mantine/core";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "../modules/CalendarioGrid.module.css";

const locales = { es };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const messages = {
    allDay: "Todo el día",
    previous: "←",
    next: "→",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay reservas en este período",
    showMore: (total) => `+${total} más`,
};

const ResourceHeader = ({ label }) => (
    <Box p="xs" style={{ textAlign: "center" }}>
        <Text size="sm" fw={600}>
            {label}
        </Text>
    </Box>
);

export const CalendarioGrid = ({
    cargando,
    reservas,
    recursos,
    currentDate,
    currentView,
    onNavigate,
    onViewChange,
    onSelectEvent,
}) => {
    const resources = useMemo(() => {
        return recursos.map((recurso) => ({
            resourceId: recurso.id,
            resourceTitle: recurso.title,
            ...recurso.extendedProps,
        }));
    }, [recursos]);

    const eventos = useMemo(() => {
        return reservas.map((reserva) => ({
            id: reserva.id,
            title: reserva.title,
            start: new Date(reserva.start),
            end: new Date(reserva.end),
            allDay: reserva.allDay ?? false,
            resourceId: reserva.resourceId,
            ...reserva.extendedProps,
            backgroundColor: reserva.backgroundColor,
        }));
    }, [reservas]);

    const eventStyleGetter = useCallback(
        (event) => ({
            style: {
                backgroundColor: event.backgroundColor || "#667eea",
                borderRadius: "6px",
                opacity: 0.95,
                color: "white",
                border: "2px solid white",
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 500,
                padding: "4px 8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
        }),
        []
    );

    const formats = useMemo(
        () => ({
            timeGutterFormat: (date, culture, localizer) =>
                localizer.format(date, "HH:mm", culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer.format(
                    start,
                    "HH:mm",
                    culture
                )} - ${localizer.format(end, "HH: mm", culture)}`,
            agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer.format(
                    start,
                    "HH:mm",
                    culture
                )} - ${localizer.format(end, "HH:mm", culture)}`,
            dayHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, "EEEE dd MMMM", culture),
            dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                `${localizer.format(
                    start,
                    "dd MMM",
                    culture
                )} — ${localizer.format(end, "dd MMM", culture)}`,
            monthHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, "MMMM yyyy", culture),
        }),
        []
    );

    if (cargando) {
        return (
            <Box className={classes.calendarWrapper}>
                <Box className={classes.calendarInner}>
                    <Group justify="center" py={100}>
                        <Loader size="lg" color="violet" />
                    </Group>
                </Box>
            </Box>
        );
    }

    return (
        <Box className={classes.calendarWrapper}>
            <Box className={classes.calendarInner}>
                <Box className={classes.calendarContainer}>
                    <Calendar
                        localizer={localizer}
                        events={eventos}
                        resources={resources}
                        resourceIdAccessor="resourceId"
                        resourceTitleAccessor="resourceTitle"
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "100%" }}
                        messages={messages}
                        formats={formats}
                        culture="es"
                        views={[
                            Views.DAY,
                            Views.WEEK,
                            Views.MONTH,
                            Views.AGENDA,
                        ]}
                        view={currentView}
                        date={currentDate}
                        onNavigate={onNavigate}
                        onView={onViewChange}
                        onSelectEvent={onSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            resourceHeader: ResourceHeader,
                        }}
                        popup
                        selectable={false}
                        step={30}
                        timeslots={2}
                        min={new Date(2025, 0, 1, 0, 0, 0)}
                        max={new Date(2025, 0, 1, 23, 59, 59)}
                        showMultiDayTimes
                    />
                </Box>
            </Box>
        </Box>
    );
};
