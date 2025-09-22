import { Table } from "@mantine/core";
import { TextSection } from "../../../components";

export const DetalleReservaTable = ({ row }) => {
    return (
        <Table variant="vertical" layout="fixed" withTableBorder>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Th w={250}>
                        <TextSection fw={700} tt="">
                           Huesped Anfitrión
                        </TextSection>
                    </Table.Th>
                    <Table.Td>
                        {row?.original.reserva?.huesped ||
                            "SIN DATOS RESERVA"}
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th w={250}>
                        <TextSection fw={700} tt="">
                            Fecha CheckIn
                        </TextSection>
                    </Table.Th>
                    <Table.Td>
                        {row?.original.reserva?.fecha_checkin ||
                            "SIN DATOS RESERVA"}
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th w={250}>
                        <TextSection fw={700} tt="">
                            Fecha CheckOut
                        </TextSection>
                    </Table.Th>
                    <Table.Td>
                        {row?.original.reserva?.fecha_checkout ||
                            "SIN DATOS RESERVA"}
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th w={250}>
                        <TextSection fw={700} tt="">
                            Total Noches
                        </TextSection>
                    </Table.Th>
                    <Table.Td>
                        {row?.original.reserva?.total_noches ||
                            "SIN DATOS RESERVA"}
                    </Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
};
