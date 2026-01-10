import { useMemo, useCallback, useState } from "react";
import { Box, Group, Loader, Text } from "@mantine/core";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { useMediaQuery } from "@mantine/hooks";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "../modules/CalendarioGrid.module.css";
import { CalendarioMobileView } from "./CalendarioMobileView";
import { EventosDrawer } from "../eventos/EventosDrawer";

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
    // Estados para el drawer de eventos
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [drawerEvents, setDrawerEvents] = useState([]);
    const [drawerDate, setDrawerDate] = useState(null);

    // Detectar tamaño de pantalla
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1024px)");

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

    const handleShowMore = useCallback((events, date) => {
        setDrawerEvents(events);
        setDrawerDate(date);
        setDrawerOpened(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setDrawerOpened(false);
    }, []);

    const handleDrawerEventClick = useCallback(
        (event) => {
            onSelectEvent(event);
            setDrawerOpened(false);
        },
        [onSelectEvent]
    );
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
                cursor: "pointer",
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
                )} - ${localizer.format(end, "HH:mm", culture)}`,
            agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer.format(
                    start,
                    "HH:mm",
                    culture
                )} - ${localizer.format(end, "HH:mm", culture)}`,
            dayHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, "EEEE d", culture),
            dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                `${localizer.format(
                    start,
                    "d MMM",
                    culture
                )} - ${localizer.format(end, "d MMM yyyy", culture)}`,
            monthHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, "MMMM yyyy", culture),
        }),
        []
    );

    if (cargando) {
        return (
            <Box className={classes.calendarCard}>
                <Group justify="center" p="xl">
                    <Loader size="lg" />
                </Group>
            </Box>
        );
    }
    // Vista móvil tipo Google Calendar
    if (isMobile) {
        return (
            <CalendarioMobileView
                reservas={eventos}
                onSelectEvent={onSelectEvent}
            />
        );
    }
    // Vista de calendario completo para desktop/tablet
    return (
        <>
            <Box className={classes.calendarCard}>
                <Box className={classes.calendarContainer}>
                    <Calendar
                        culture="es"
                        localizer={localizer}
                        events={eventos}
                        resources={resources}
                        resourceIdAccessor="resourceId"
                        resourceTitleAccessor="resourceTitle"
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "100%" }}
                        messages={messages}
                        date={currentDate}
                        view={currentView}
                        onNavigate={onNavigate}
                        onView={onViewChange}
                        onSelectEvent={onSelectEvent}
                        onShowMore={handleShowMore}
                        eventPropGetter={eventStyleGetter}
                        formats={formats}
                        popup={false}
                        doShowMoreDrillDown={false}
                        components={{
                            resourceHeader: ResourceHeader,
                        }}
                        views={
                            isTablet
                                ? [Views.MONTH]
                                : [Views.MONTH, Views.WEEK, Views.DAY]
                        }
                        step={30}
                        timeslots={2}
                        showMultiDayTimes
                        defaultView={Views.MONTH}
                    />
                </Box>
            </Box>

            {/* Drawer lateral de eventos */}
            <EventosDrawer
                opened={drawerOpened}
                onClose={handleCloseDrawer}
                events={drawerEvents}
                date={drawerDate}
                onSelectEvent={handleDrawerEventClick}
            />
        </>
    );
};
