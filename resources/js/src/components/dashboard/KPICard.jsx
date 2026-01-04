import { Card, Group, useMantineColorScheme } from "@mantine/core";
import { TextSection } from "../../components";

export default function KPICard({ label, value, color }) {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    return (
        <Card
            radius="md"
            shadow="sm"
            withBorder
            style={{
                padding: "20px",
                borderRadius: "12px",
                background: isDark
                    ? "linear-gradient(135deg, #1A1B1E 0%, #25262B 100%)"
                    : "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
                boxShadow: isDark
                    ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                    : "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: isDark ? "1px solid #373A40" : "none",
            }}
        >
            <Group wrap="nowrap" spacing="xs">
                <TextSection fz={12} tt="" color="dimmed">
                    {label}
                </TextSection>
                <TextSection fz={20} fw={700} color={color}>
                    {value}
                </TextSection>
            </Group>
        </Card>
    );
}
