import { Table } from "@mantine/core";
import { formatFechaHoraModal } from "../../../helpers/fnHelper";

export const ReservaInfoHuespedTable = ({ datos }) => {
    return (
        <Table withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Codigo Reserva</Table.Th>
                    <Table.Th>Cliente</Table.Th>
                    <Table.Th>Fecha CheckIn</Table.Th>
                    <Table.Th>Fecha CheckOut</Table.Th>
                    <Table.Th>Total Noches</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>{datos.codigo_reserva}</Table.Td>
                    <Table.Td>{datos.huesped}</Table.Td>
                    <Table.Td>
                        {formatFechaHoraModal(datos.fecha_checkin)}
                    </Table.Td>
                    <Table.Td>
                        {formatFechaHoraModal(datos.fecha_checkout)}
                    </Table.Td>
                    <Table.Td>{datos.total_noches}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
};
