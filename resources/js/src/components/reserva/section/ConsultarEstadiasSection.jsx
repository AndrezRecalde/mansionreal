import {
    Card,
    CardSection,
    Text,
    Table,
    Group,
    useMantineColorScheme,
} from "@mantine/core";
import { BtnSection } from "../../../components";
import { useEstadiaStore, useStorageField } from "../../../hooks";
import { IconPackageExport } from "@tabler/icons-react";

export const ConsultarEstadiasSection = () => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const { estadias, fnExportarConsumosEstadiasPDF } = useEstadiaStore();
    const resumen = estadias?.[0]; // tomo el primer elemento
    const { storageFields } = useStorageField();

    const handleExportarEstadiasPDF = () => {
        fnExportarConsumosEstadiasPDF({
            p_fecha_inicio: storageFields?.p_fecha_inicio,
            p_fecha_fin: storageFields?.p_fecha_fin,
            p_anio: storageFields?.p_anio,
        });
    };

    if (!resumen) {
        return (
            <Card shadow="sm" radius="md" p="lg" withBorder>
                <CardSection inheritPadding py="xs">
                    <Text fw={600} size="lg">
                        Estadías
                    </Text>
                </CardSection>
                <CardSection inheritPadding py="md">
                    <Text size="sm" c="dimmed">
                        No hay datos de estadías que mostrar
                    </Text>
                </CardSection>
            </Card>
        );
    }

    return (
        <Card
            mt={20}
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
            {/* Header */}
            <CardSection inheritPadding py="xs">
                <Group justify="space-between">
                    <div>
                        <Text fw={500}>Estadías</Text>
                        <Text fz="xs" c="dimmed">
                            Reporte General
                        </Text>
                    </div>
                    <BtnSection
                        radius="sm"
                        h={30}
                        IconSection={IconPackageExport}
                        handleAction={handleExportarEstadiasPDF}
                    >
                        Exportar PDF
                    </BtnSection>
                </Group>
            </CardSection>

            {/* Tabla de Totales */}
            <CardSection inheritPadding py="md">
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Total estadías</Table.Th>
                            <Table.Th>Subtotal consumos</Table.Th>
                            <Table.Th>IVA recaudado</Table.Th>
                            <Table.Th>Total consumos</Table.Th>
                            <Table.Th>Total huéspedes</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{resumen.total_estadias}</Table.Td>
                            <Table.Td>${resumen.subtotal_consumos}</Table.Td>
                            <Table.Td>${resumen.iva_recaudado}</Table.Td>
                            <Table.Td>${resumen.total_consumos}</Table.Td>
                            <Table.Td>{resumen.total_huespedes}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </CardSection>
        </Card>
    );
};
