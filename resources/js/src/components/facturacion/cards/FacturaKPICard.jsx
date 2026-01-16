import { Paper, Group, Stack, Text, Box } from "@mantine/core";

/**
 * Tarjeta KPI minimalista para empresa seria
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icono del KPI
 * @param {string|number} props.value - Valor principal
 * @param {string} props.label - Etiqueta descriptiva
 * @param {string} props.color - Color del tema
 */
export const FacturaKPICard = ({ icon: Icon, value, label, color }) => {
    return (
        <Paper
            shadow="lg"
            p="lg"
            radius="sm"
            style={{
                height: "100%",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
            }}
        >
            <Stack gap="md">
                {/* Icono */}
                <Group justify="space-between" align="center">
                    <Text
                        size="xs"
                        tt="uppercase"
                        fw={500}
                        c="#64748b"
                        mt={8}
                        style={{
                            letterSpacing: "1px",
                        }}
                    >
                        {label}
                    </Text>
                    <Icon size={24} color={color} strokeWidth={1.5} />
                </Group>
                <Text size="32px" fw={600} c="#0f172a">
                    {value}
                </Text>
            </Stack>
        </Paper>
    );
};
