import { Card, Stack, Text, Group, Box } from "@mantine/core";

/**
 * Tarjeta para montos - Diseño corporativo serio
 */
export const FacturaMontoCard = ({ icon: Icon, label, monto, color }) => {
    return (
        <Card
            shadow="lg"
            padding="lg"
            radius="sm"
            style={{
                height: "100%",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderLeft: `4px solid ${color}`,
            }}
        >
            <Stack gap="lg">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Text
                        size="xs"
                        tt="uppercase"
                        fw={600}
                        c="#64748b"
                        style={{
                            letterSpacing: "1px",
                        }}
                    >
                        {label}
                    </Text>
                    <Box
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "20px",
                            background: `${color}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon size={18} color={color} strokeWidth={1.7} />
                    </Box>
                </Group>

                {/* Monto */}
                <Text
                    size="28px"
                    fw={600}
                    c="#0f172a"
                    style={{
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    ${monto}
                </Text>
            </Stack>
        </Card>
    );
};
