import { Grid, Text, Box } from "@mantine/core";
import {
    IconFileText,
    IconFileCheck,
    IconFileOff,
    IconUsers,
} from "@tabler/icons-react";
import { FacturaKPICard } from "../cards/FacturaKPICard";

/**
 * Sección con KPIs principales - Diseño corporativo serio
 */
export const FacturasKPISection = ({ facturas, clientes }) => {
    const kpis = [
        {
            icon: IconFileText,
            value: facturas?.total_general || 0,
            label: "Total Facturas",
            color: "#1e293b",
        },
        {
            icon: IconFileCheck,
            value: facturas?.total_emitidas || 0,
            label: "Emitidas",
            color: "#16a34a",
        },
        {
            icon: IconFileOff,
            value: facturas?.total_anuladas || 0,
            label: "Anuladas",
            color: "#dc2626",
        },
        {
            icon: IconUsers,
            value: clientes?.clientes_registrados || 0,
            label: "Clientes Registrados",
            color: "#0284c7",
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
                Resumen de Facturas
            </Text>
            <Grid>
                {kpis.map((kpi, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                        <FacturaKPICard {...kpi} />
                    </Grid.Col>
                ))}
            </Grid>
        </Box>
    );
};
