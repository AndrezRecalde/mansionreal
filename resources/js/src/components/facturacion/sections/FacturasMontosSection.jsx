import { Grid, Text, Box } from "@mantine/core";
import {
    IconCurrencyDollar,
    IconChartBar,
    IconTrendingUp,
    IconDiscount,
} from "@tabler/icons-react";
import { FacturaMontoCard } from "../cards/FacturaMontoCard";

/**
 * Sección con montos - Diseño corporativo serio
 */
export const FacturasMontosSection = ({ formatMonto, montos }) => {
    const montosConfig = [
        {
            icon: IconCurrencyDollar,
            label: "Total Facturado",
            monto: formatMonto(montos?.total_facturado),
            color: "#16a34a",
        },
        {
            icon: IconChartBar,
            label: "Total IVA",
            monto: formatMonto(montos?.total_iva),
            color: "#0284c7",
        },
        {
            icon: IconTrendingUp,
            label: "Promedio por Factura",
            monto: formatMonto(montos?.promedio_factura),
            color: "#7c3aed",
        },
        {
            icon: IconDiscount,
            label: "Descuentos Aplicados",
            monto: formatMonto(montos?.total_descuentos),
            color: "#ea580c",
        },
    ];

    return (
        <Box mb={40}>
            <Text
                size="sm"
                fw={600}
                mb="lg"
                tt="uppercase"
                style={{ letterSpacing: "1px" }}
            >
                Montos Facturados
            </Text>
            <Grid>
                {montosConfig.map((config, index) => (
                    <Grid.Col
                        key={index}
                        span={{ base: 12, sm: 6, md: 6, lg: 3 }}
                    >
                        <FacturaMontoCard {...config} />
                    </Grid.Col>
                ))}
            </Grid>
        </Box>
    );
};
