import { Table } from "@mantine/core";

export default function GuestsRankingTable() {
    const data = [
        { nombre: "Juan Pérez", reservas: 5 },
        { nombre: "Ana Gómez", reservas: 4 },
    ];

    return (
        <Table withTableBorder highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Reservas</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {data.map((row) => (
                    <Table.Tr key={row.nombre}>
                        <Table.Td>{row.nombre}</Table.Td>
                        <Table.Td>{row.reservas}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
}
