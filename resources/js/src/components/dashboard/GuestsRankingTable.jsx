import { Table } from "@mantine/core";
import { useDashHuespedStore } from "../../hooks";

export default function GuestsRankingTable() {
    const { huespedesRecurrentes } = useDashHuespedStore();

    const rows = huespedesRecurrentes.map((huesped) => (
        <Table.Tr key={huesped.id}>
            <Table.Td>{huesped.apellidos + " " + huesped.nombres}</Table.Td>
            <Table.Td>{huesped.dni}</Table.Td>
            <Table.Td>{huesped.cantidad_reservas}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Cedula</Table.Th>
                    <Table.Th>Total Reservas</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
