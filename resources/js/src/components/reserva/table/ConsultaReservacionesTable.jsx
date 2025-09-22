import { Badge, Table, Text } from "@mantine/core";

export const ConsultaReservacionesTable = ({ reserva }) => {
    return (
        <Table highlightOnHover withTableBorder verticalSpacing="sm">
            <Table.Tbody>
                <Table.Tr>
                    <Table.Th w={220}>Departamento</Table.Th>
                    <Table.Td>
                        <Text fw={500}>{reserva.nombre_departamento}</Text>
                        <Badge color="indigo" ml={8} size="sm">
                            {reserva.tipo_departamento}
                        </Badge>
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Capacidad</Table.Th>
                    <Table.Td>
                        <Badge color="blue" size="sm">
                            {reserva.capacidad} personas
                        </Badge>
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Reservas</Table.Th>
                    <Table.Td>
                        <Badge color="teal" size="sm">
                            {reserva.total_reservas}
                        </Badge>
                        <Text size="xs" color="dimmed" ml={12}>
                            huéspedes: {reserva.total_huespedes}
                        </Text>
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Consumos</Table.Th>
                    <Table.Td>
                        <Text fw={500}>${reserva.subtotal_consumos}</Text>
                        <Text size="xs" color="dimmed">
                            IVA: ${reserva.iva_recaudado}
                        </Text>
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Total Consumos</Table.Th>
                    <Table.Td fw={500}>${reserva.total_consumos}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
};
