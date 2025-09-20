import { Table } from "@mantine/core";

export default function ReservationsTable() {
    const data = [
        {
            id: 1,
            departamento: "101",
            huesped: "Juan Pérez",
            checkin: "2025-09-10",
            checkout: "2025-09-15",
        },
        {
            id: 2,
            departamento: "102",
            huesped: "Ana Gómez",
            checkin: "2025-09-12",
            checkout: "2025-09-16",
        },
    ];

    return (
        <Table highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID Reserva</Table.Th>
                    <Table.Th>Departamento</Table.Th>
                    <Table.Th>Huésped</Table.Th>
                    <Table.Th>Check-In</Table.Th>
                    <Table.Th>Check-Out</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {data.map((row) => (
                    <Table.Tr key={row.id}>
                        <Table.Td>{row.id}</Table.Td>
                        <Table.Td>{row.departamento}</Table.Td>
                        <Table.Td>{row.huesped}</Table.Td>
                        <Table.Td>{row.checkin}</Table.Td>
                        <Table.Td>{row.checkout}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
}
