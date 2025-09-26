import { Card, CardSection, Text, Table } from "@mantine/core";
import { useEstadiaStore } from "../../../hooks";

export const ConsultarEstadiasSection = () => {
    const { estadias } = useEstadiaStore();
    const resumen = estadias?.[0]; // tomo el primer elemento

    if (!resumen) {
        return (
            <Card shadow="sm" radius="md" p="lg" withBorder>
                <CardSection inheritPadding py="xs">
                    <Text fw={600} size="lg">
                        Estadías
                    </Text>
                </CardSection>
                <CardSection inheritPadding py="md">
                    <Text size="sm" c="dimmed">
                        No hay datos de estadías que mostrar
                    </Text>
                </CardSection>
            </Card>
        );
    }

    return (
        <Card shadow="sm" radius="md" p="lg" mt={20} withBorder>
            {/* Header */}
            <CardSection inheritPadding py="xs">
                <div>
                    <Text fw={500}>Estadías</Text>
                    <Text fz="xs" c="dimmed">
                        Reporte General
                    </Text>
                </div>
            </CardSection>

            {/* Tabla de Totales */}
            <CardSection inheritPadding py="md">
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Total estadías</Table.Th>
                            <Table.Th>Subtotal consumos</Table.Th>
                            <Table.Th>IVA recaudado</Table.Th>
                            <Table.Th>Total consumos</Table.Th>
                            <Table.Th>Total huéspedes</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{resumen.total_estadias}</Table.Td>
                            <Table.Td>${resumen.subtotal_consumos}</Table.Td>
                            <Table.Td>${resumen.iva_recaudado}</Table.Td>
                            <Table.Td>${resumen.total_consumos}</Table.Td>
                            <Table.Td>{resumen.total_huespedes}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </CardSection>
        </Card>
    );
};
