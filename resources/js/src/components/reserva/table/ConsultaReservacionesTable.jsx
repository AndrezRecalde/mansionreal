import { Table } from "@mantine/core";

export const ConsultaReservacionesTable = ({ reserva }) => {
    return (
        <Table variant="vertical" layout="fixed" withTableBorder>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Th w={250}>Nombre de departamento</Table.Th>
                    <Table.Td>
                        Departamento {reserva.nombre_departamento}
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Tipo de departamento</Table.Th>
                    <Table.Td>{reserva.tipo_departamento}</Table.Td>
                </Table.Tr>

                <Table.Tr>
                    <Table.Th>Capacidad</Table.Th>
                    <Table.Td>{reserva.capacidad}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Total de Reservas</Table.Th>
                    <Table.Td>{reserva.total_reservas}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Total Huespedes</Table.Th>
                    <Table.Td>{reserva.total_huespedes}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Total Consumos</Table.Th>
                    <Table.Td>{reserva.subtotal_consumos}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Iva Recaudado</Table.Th>
                    <Table.Td>{reserva.iva_recaudado}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Total Consumos</Table.Th>
                    <Table.Td>{reserva.total_consumos}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
};
