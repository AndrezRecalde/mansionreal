import { SimpleGrid, Box, Text } from "@mantine/core";
import { FacturaClientesCard } from "../cards/FacturaClientesCard";
import { FacturaTicketsCard } from "../cards/FacturaTicketsCard";

/**
 * Sección con análisis detallado - Diseño corporativo serio
 */
export const FacturasDetalleSection = ({ clientes, formatMonto, montos }) => {
    return (
        <Box mb={40}>
            <Text
                size="sm"
                fw={600}
                c="#0f172a"
                mb="lg"
                tt="uppercase"
                style={{ letterSpacing: "1px" }}
            >
                Análisis Detallado
            </Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <FacturaClientesCard
                    consumidoresFinales={clientes?.consumidores_finales || 0}
                    clientesRegistrados={clientes?.clientes_registrados || 0}
                    clientesUnicos={clientes?.clientes_unicos || 0}
                />
                <FacturaTicketsCard
                    ticketMaximo={formatMonto(montos?.ticket_maximo)}
                    ticketMinimo={formatMonto(montos?.ticket_minimo)}
                    ticketPromedio={formatMonto(montos?.promedio_factura)}
                />
            </SimpleGrid>
        </Box>
    );
};
