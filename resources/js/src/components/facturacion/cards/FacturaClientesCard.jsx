import { Paper, Text, Stack, Group, Box } from "@mantine/core";
import { IconUsers, IconUserCheck, IconUserStar } from "@tabler/icons-react";

/**
 * Tarjeta con análisis de clientes - Diseño corporativo serio
 */
export const FacturaClientesCard = ({
    consumidoresFinales,
    clientesRegistrados,
    clientesUnicos,
}) => {
    const clientesData = [
        {
            icon: IconUsers,
            label: "Consumidores Finales",
            value: consumidoresFinales,
            color: "#64748b",
        },
        {
            icon: IconUserCheck,
            label: "Clientes Registrados",
            value: clientesRegistrados,
            color: "#0284c7",
        },
        {
            icon: IconUserStar,
            label: "Clientes Únicos",
            value: clientesUnicos,
            color: "#16a34a",
        },
    ];

    return (
        <Paper
            shadow="lg"
            p="lg"
            radius="sm"
            style={{
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
                    <IconUsers size={18} strokeWidth={1.5} />
                </Box>
                <Text
                    size="sm"
                    fw={600}
                    tt="uppercase"
                    style={{ letterSpacing: "0.5px" }}
                >
                    Clientes
                </Text>
            </Group>

            {/* Lista */}
            <Stack gap="md">
                {clientesData.map((item, index) => (
                    <Group
                        key={index}
                        justify="space-between"
                        p="md"
                        style={{
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
                            <Text size="sm" fw={400}>
                                {item.label}
                            </Text>
                        </Group>
                        <Text
                            size="lg"
                            fw={600}
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {item.value}
                        </Text>
                    </Group>
                ))}
            </Stack>
        </Paper>
    );
};
