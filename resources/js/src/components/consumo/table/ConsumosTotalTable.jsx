import { Table } from "@mantine/core";

export const ConsumosTotalTable = ({ departamento }) => {
    return (
        <Table
            highlightOnHover
            withTableBorder
            withColumnBorders
            verticalSpacing="sm"
        >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Total Huespedes</Table.Th>
                    <Table.Th>Total Reservas</Table.Th>
                    <Table.Th>Subtotal</Table.Th>
                    <Table.Th>Iva Recaudado</Table.Th>
                    <Table.Th>Total Consumos</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>{departamento.total_huespedes}</Table.Td>
                    <Table.Td>{departamento.total_reservas}</Table.Td>
                    <Table.Td>{departamento.subtotal_consumos}</Table.Td>
                    <Table.Td>{departamento.iva_recaudado}</Table.Td>
                    <Table.Td>{departamento.total_consumos}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
};
