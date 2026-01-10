import {
    Drawer,
    Stack,
    Text,
    Badge,
    Group,
    Paper,
    Divider,
    Box,
} from "@mantine/core";
import {
    IconUser,
    IconMapPin,
    IconClock,
    IconCalendar,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import classes from "../modules/EventsDrawer.module.css";

export const EventosDrawer = ({
    opened,
    onClose,
    events,
    date,
    onSelectEvent,
}) => {
    if (!events || events.length === 0 || !date) return null;

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position="right"
            size="md"
            title={
                <Group gap="xs">
                    <IconCalendar size={22} />
                    <div>
                        <Text size="md" fw={700} tt="capitalize">
                            {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {events.length}{" "}
                            {events.length === 1 ? "reserva" : "reservas"}
                        </Text>
                    </div>
                </Group>
            }
            overlayProps={{ opacity: 0.5, blur: 4 }}
            classNames={{
                header: classes.drawerHeader,
                body: classes.drawerBody,
            }}
        >
            <Stack gap="md">
                {events.map((event, index) => (
                    <Paper
                        key={event.id}
                        p="md"
                        radius="md"
                        withBorder
                        className={classes.eventCard}
                        onClick={() => {
                            onSelectEvent(event);
                            onClose();
                        }}
                        style={{
                            borderLeftWidth: 4,
                            borderLeftColor: event.backgroundColor,
                            animationDelay: `${index * 0.05}s`,
                        }}
                    >
                        <Group justify="space-between" wrap="nowrap" mb="sm">
                            <Group gap={8}>
                                <Box
                                    w={12}
                                    h={12}
                                    style={{
                                        borderRadius: "50%",
                                        backgroundColor: event.backgroundColor,
                                    }}
                                />
                                <Text size="md" fw={600}>
                                    {event.title}
                                </Text>
                            </Group>
                            {event?.estado && (
                                <Badge
                                    variant="light"
                                    color={event.backgroundColor}
                                >
                                    {event.estado.nombre_estado}
                                </Badge>
                            )}
                        </Group>

                        <Divider my="xs" />

                        <Stack gap="sm">
                            <Group gap="sm">
                                <IconClock
                                    size={18}
                                    stroke={1.5}
                                    className={classes.icon}
                                />
                                <Text size="xs">
                                    {format(event.start, "HH:mm")} -{" "}
                                    {format(event.end, "HH:mm")}
                                </Text>
                            </Group>

                            {event?.huesped?.nombre_completo && (
                                <Group gap="sm">
                                    <IconUser
                                        size={18}
                                        stroke={1.5}
                                        className={classes.icon}
                                    />
                                    <Text size="xs">
                                        {event?.huesped.nombre_completo}
                                    </Text>
                                </Group>
                            )}

                            {event?.departamento?.numero && (
                                <Group gap="sm">
                                    <IconMapPin
                                        size={18}
                                        stroke={1.5}
                                        className={classes.icon}
                                    />
                                    <Text size="xs">
                                        Depto. {event?.departamento.numero}
                                        {event?.departamento.tipo &&
                                            ` - ${event?.departamento.tipo}`}
                                    </Text>
                                </Group>
                            )}
                        </Stack>

                        {event?.codigo_reserva && (
                            <Text
                                size="sm"
                                c="dimmed"
                                mt="xs"
                                ta="right"
                                fw={500}
                            >
                                #{event?.codigo_reserva}
                            </Text>
                        )}
                    </Paper>
                ))}
            </Stack>
        </Drawer>
    );
};
