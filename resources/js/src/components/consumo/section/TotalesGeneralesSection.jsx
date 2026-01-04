import { Paper, Stack, Group, Divider } from "@mantine/core";
import {
    IconShoppingCart,
    IconReceipt,
    IconCoin,
    IconCash,
} from "@tabler/icons-react";
import { TextSection } from "../../elements/titles/TextSection";

export const TotalesGeneralesSection = ({ totales, colorScheme, theme }) => {
    const items = [
        {
            label: "Cantidad Total de Productos",
            value: `${totales.cantidad_total_general} unidades`,
            icon: IconShoppingCart,
            color: "blue",
        },
        {
            label: "Subtotal General",
            value: `$${totales.subtotal_general.toFixed(2)}`,
            icon: IconReceipt,
            color: "cyan",
        },
        {
            label: "IVA General",
            value: `$${totales.iva_general.toFixed(2)}`,
            icon: IconCoin,
            color: "orange",
        },
        {
            label: "Total General",
            value: `$${totales.total_general.toFixed(2)}`,
            icon: IconCash,
            color: "green",
        },
    ];

    return (
        <Paper shadow="md" p="xl" withBorder>
            <Stack gap="lg">
                <TextSection fz={20} fw={700} color="dimmed" tt="">
                    📊 Totales Generales del Reporte
                </TextSection>
                <Divider />

                {items.map((item, index) => {
                    const Icon = item.icon;
                    const isLast = index === items.length - 1;

                    return (
                        <Paper
                            key={item.label}
                            p="md"
                            withBorder
                            style={{
                                backgroundColor: isLast
                                    ? "#d3f9d8"
                                    : colorScheme === "dark"
                                    ? theme.colors.dark[6]
                                    : theme.colors.gray[0],
                                borderColor: isLast ? "#51cf66" : undefined,
                                borderWidth: isLast ? 2 : 1,
                            }}
                        >
                            <Group justify="space-between">
                                <Group>
                                    <Icon
                                        size={24}
                                        color={`var(--mantine-color-${item.color}-6)`}
                                    />
                                    <TextSection fz={14} tt="" fw={isLast ? 700 : 500}>
                                        {item.label}:
                                    </TextSection>
                                </Group>
                                <TextSection
                                    tt=""
                                    fz={isLast ? 16 : 14}
                                    fw={700}
                                    color={isLast ? "green" : item.color}
                                >
                                    {item.value}
                                </TextSection>
                            </Group>
                        </Paper>
                    );
                })}
            </Stack>
        </Paper>
    );
};
