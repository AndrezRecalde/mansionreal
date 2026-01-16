import { Paper, Group, Text, Box } from "@mantine/core";
import { IconCalendar, IconFileText } from "@tabler/icons-react";
import dayjs from "dayjs";

/**
 * Indicador del periodo - Diseño corporativo serio
 */
export const FacturaPeriodoIndicator = ({ periodo, totalFacturas }) => {
    const formatearPeriodo = () => {
        if (!periodo) return "Año Actual";

        const { fecha_inicio, fecha_fin, anio, es_rango } = periodo;

        if (es_rango && fecha_inicio && fecha_fin) {
            return `${dayjs(fecha_inicio).format("DD/MM/YYYY")} - ${dayjs(
                fecha_fin
            ).format("DD/MM/YYYY")}`;
        }

        if (anio) {
            return `Año ${anio}`;
        }

        return "Periodo Personalizado";
    };

    return (
        <Paper
            shadow="none"
            p="lg"
            radius="sm"
            style={{
                background: "#1e293b",
                border: "none",
            }}
        >
            <Group justify="space-between" align="center">
                <Group gap="md">
                    <Box
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "4px",
                            background: "rgba(255, 255, 255, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <IconCalendar
                            size={20}
                            color="#ffffff"
                            strokeWidth={1.5}
                        />
                    </Box>
                    <div>
                        <Text
                            size="xs"
                            c="rgba(255, 255, 255, 0.6)"
                            fw={500}
                            mb={4}
                            tt="uppercase"
                            style={{ letterSpacing: "1px" }}
                        >
                            Periodo Seleccionado
                        </Text>
                        <Text size="md" c="#ffffff" fw={600}>
                            {formatearPeriodo()}
                        </Text>
                    </div>
                </Group>

                {totalFacturas > 0 && (
                    <Group gap="md">
                        <Box
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "4px",
                                background: "rgba(255, 255, 255, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconFileText
                                size={20}
                                color="#ffffff"
                                strokeWidth={1.5}
                            />
                        </Box>
                        <div>
                            <Text
                                size="xs"
                                c="rgba(255, 255, 255, 0.6)"
                                fw={500}
                                tt="uppercase"
                                style={{ letterSpacing: "1px" }}
                            >
                                Total
                            </Text>
                            <Text
                                size="xl"
                                c="#ffffff"
                                fw={600}
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {totalFacturas}
                            </Text>
                        </div>
                    </Group>
                )}
            </Group>
        </Paper>
    );
};
