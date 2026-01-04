import { Paper, SimpleGrid, Text, Group } from "@mantine/core";
import {
    IconCalendar,
    IconClock,
    IconCategory,
    IconBox,
} from "@tabler/icons-react";

export const MetadatosSection = ({ metadatos }) => {
    const items = [
        {
            label: "Período",
            value: `${metadatos.p_fecha_inicio} al ${metadatos.p_fecha_fin}`,
            icon: IconCalendar,
        },
        {
            label: "Generado",
            value: metadatos.fecha_generacion,
            icon: IconClock,
        },
        {
            label: "Total Categorías",
            value: metadatos.total_categorias,
            icon: IconCategory,
        },
        {
            label: "Total Productos",
            value: metadatos.total_productos,
            icon: IconBox,
        },
    ];

    return (
        <Paper
            shadow="sm"
            p="md"
            withBorder
            mb="lg"
        >
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Group key={item.label} gap="xs">
                            <Icon
                                size={20}
                                color="var(--mantine-color-blue-6)"
                            />
                            <div>
                                <Text size="xs" c="dimmed" fw={500}>
                                    {item.label}
                                </Text>
                                <Text size="sm" fw={600}>
                                    {item.value}
                                </Text>
                            </div>
                        </Group>
                    );
                })}
            </SimpleGrid>
        </Paper>
    );
};
