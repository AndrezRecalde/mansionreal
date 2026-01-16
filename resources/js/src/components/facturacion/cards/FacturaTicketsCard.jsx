import { Paper, Text, Stack, Group, Box, Divider } from "@mantine/core";
import {
    IconTrendingUp,
    IconTrendingDown,
    IconEqual,
} from "@tabler/icons-react";

/**
 * Tarjeta con análisis de tickets - Diseño corporativo serio
 */
export const FacturaTicketsCard = ({
    ticketMaximo,
    ticketMinimo,
    ticketPromedio,
}) => {
    const ticketsData = [
        {
            icon: IconTrendingUp,
            label: "Ticket Máximo",
            value: ticketMaximo,
            color: "#16a34a",
        },
        {
            icon: IconTrendingDown,
            label: "Ticket Mínimo",
            value: ticketMinimo,
            color: "#ea580c",
        },
        {
            icon: IconEqual,
            label: "Ticket Promedio",
            value: ticketPromedio,
            color: "#0284c7",
        },
    ];

    return (
        <Paper
            shadow="lg"
            p="lg"
            radius="sm"
            style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                height: "100%",
            }}
        >
            {/* Header */}
            <Group mb="xl" gap="sm">
                <Box
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "4px",
                        background: "#1e293b08",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <IconTrendingUp
                        size={18}
                        color="#1e293b"
                        strokeWidth={1.5}
                    />
                </Box>
                <Text
                    size="sm"
                    fw={600}
                    c="#0f172a"
                    tt="uppercase"
                    style={{ letterSpacing: "0.5px" }}
                >
                    Tickets
                </Text>
            </Group>

            {/* Lista */}
            <Stack gap="md">
                {ticketsData.map((item, index) => (
                    <Group
                        key={index}
                        justify="space-between"
                        p="md"
                        style={{
                            background: "#f8fafc",
                            borderRadius: "4px",
                            border: "1px solid #f1f5f9",
                        }}
                    >
                        <Group gap="sm">
                            <Box
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "4px",
                                    background: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <item.icon
                                    size={16}
                                    color={item.color}
                                    strokeWidth={1.5}
                                />
                            </Box>
                            <Text size="sm" fw={400} c="#64748b">
                                {item.label}
                            </Text>
                        </Group>
                        <Text
                            size="lg"
                            fw={600}
                            c="#0f172a"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            ${item.value}
                        </Text>
                    </Group>
                ))}
            </Stack>
        </Paper>
    );
};
