import { Paper, SimpleGrid, Group } from "@mantine/core";
import {
    IconCalendar,
    IconClock,
    IconCategory,
    IconBox,
} from "@tabler/icons-react";
import { TextSection } from "../../elements/titles/TextSection";

export const MetadatosSection = ({ metadatos, PAGE_TITLE }) => {
    const items = [
        {
            label: PAGE_TITLE.REPORTE_CONSUMOS.META_DATOS_SECTION.PERIODO,
            value: `${metadatos.p_fecha_inicio} al ${metadatos.p_fecha_fin}`,
            icon: IconCalendar,
        },
        {
            label: PAGE_TITLE.REPORTE_CONSUMOS.META_DATOS_SECTION.GENERADO,
            value: metadatos.fecha_generacion,
            icon: IconClock,
        },
        {
            label: PAGE_TITLE.REPORTE_CONSUMOS.META_DATOS_SECTION
                .TOTAL_CATEGORIAS,
            value: metadatos.total_categorias,
            icon: IconCategory,
        },
        {
            label: PAGE_TITLE.REPORTE_CONSUMOS.META_DATOS_SECTION
                .TOTAL_PRODUCTOS,
            value: metadatos.total_productos,
            icon: IconBox,
        },
    ];

    return (
        <Paper shadow="sm" p="md" withBorder mb="lg">
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
                                <TextSection
                                    tt=""
                                    fz={12}
                                    color="dimmed"
                                    fw={500}
                                >
                                    {item.label}
                                </TextSection>
                                <TextSection tt="" fz={14} fw={600}>
                                    {item.value}
                                </TextSection>
                            </div>
                        </Group>
                    );
                })}
            </SimpleGrid>
        </Paper>
    );
};
