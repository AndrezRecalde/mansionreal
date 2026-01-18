import { Card, Table, useMantineColorScheme } from "@mantine/core";
import { TitlePage } from "../../components";
import { useDashHuespedStore } from "../../hooks";
import { PAGE_TITLE } from "../../helpers/getPrefix";

export default function GuestsRankingTable() {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const { huespedesRecurrentes } = useDashHuespedStore();

    const rows = huespedesRecurrentes.map((huesped) => (
        <Table.Tr key={huesped.id}>
            <Table.Td>{huesped.apellidos + " " + huesped.nombres}</Table.Td>
            <Table.Td>{huesped.dni}</Table.Td>
            <Table.Td>{huesped.cantidad_reservas}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Card
            shadow="sm"
            withBorder
            style={{
                padding: "20px",
                borderRadius: "12px",
                background: isDark
                    ? "linear-gradient(135deg, #1A1B1E 0%, #25262B 100%)"
                    : "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
                boxShadow: isDark
                    ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                    : "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: isDark ? "1px solid #373A40" : "none",
            }}
        >
            <TitlePage order={3}>{PAGE_TITLE.DASHBOARD.TABLE_RANKING_HUESPEDES.TITLE}</TitlePage>
            <Table striped withTableBorder withColumnBorders mt={20}>
                <Table.Thead style={{ backgroundColor: isDark ? "#2C2E33" : "#C8C8C8" }}>
                    <Table.Tr>
                        <Table.Th>{PAGE_TITLE.DASHBOARD.TABLE_RANKING_HUESPEDES.COLUMNS.NOMBRE_HUESPED}</Table.Th>
                        <Table.Th>{PAGE_TITLE.DASHBOARD.TABLE_RANKING_HUESPEDES.COLUMNS.CEDULA}</Table.Th>
                        <Table.Th>{PAGE_TITLE.DASHBOARD.TABLE_RANKING_HUESPEDES.COLUMNS.TOTAL_RESERVAS}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Card>
    );
}
