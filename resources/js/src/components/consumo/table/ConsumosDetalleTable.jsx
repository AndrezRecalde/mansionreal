import { useMemo } from "react";
import { Table } from "@mantine/core";
import { useConsumoStore } from "../../../hooks";

export const ConsumosDetalleTable = () => {
    const { consumos } = useConsumoStore();

    const totalConsumos = useMemo(() => {
        if (!Array.isArray(consumos)) return 0;
        return consumos.reduce((acc, curr) => acc + Number(curr.total ?? 0), 0);
    }, [consumos]);

    // formateador de moneda
    const formatoMoneda = (valor) =>
        new Intl.NumberFormat("es-EC", {
            style: "currency",
            currency: "USD",
        }).format(valor);

    const rows = consumos.map((consumo) => (
        <Table.Tr key={consumo.id}>
            <Table.Td>{consumo.nombre_producto}</Table.Td>
            <Table.Td>{consumo.cantidad}</Table.Td>
            <Table.Td>{formatoMoneda(consumo.subtotal)}</Table.Td>
            <Table.Td>{formatoMoneda(consumo.iva)}</Table.Td>
            <Table.Td>{formatoMoneda(consumo.total)}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={500} maxHeight={300}>
            <Table
                withTableBorder
                withColumnBorders
                style={{ tableLayout: "fixed", width: "100%" }}
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Producto</Table.Th>
                        <Table.Th>Cantidad</Table.Th>
                        <Table.Th>Subtotal</Table.Th>
                        <Table.Th>Iva</Table.Th>
                        <Table.Th>Total</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                    <Table.Tr>
                        <Table.Td
                            colSpan={4}
                            style={{
                                fontWeight: "bold",
                                textAlign: "right",
                            }}
                        >
                            TOTAL
                        </Table.Td>
                        <Table.Td
                            style={{
                                fontWeight: "bold",
                                textAlign: "right",
                            }}
                        >
                            {formatoMoneda(totalConsumos)}
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
};
