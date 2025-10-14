import { Table } from "@mantine/core";

export const PagosTotalesReserva = ({ totalesPagos }) => {

    const rows = totalesPagos.map((pago) => (
        <Table.Tr key={pago.reserva_id}>
            <Table.Td>{pago.total_consumos}</Table.Td>
            <Table.Td>{pago.total_pagos}</Table.Td>
            <Table.Td>{pago.saldo_pendiente}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table
            withTableBorder
            withColumnBorders
            style={{ tableLayout: "fixed", width: "100%" }}
        >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Total Consumos</Table.Th>
                    <Table.Th>Total Pagos</Table.Th>
                    <Table.Th>Saldo Pendiente</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};
