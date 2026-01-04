import { Badge, Group, Table, UnstyledButton } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { ContenidoTable } from "../../../components";
import { useCallback, useMemo } from "react";
import { useReservaDepartamentoStore, useUiConsumo } from "../../../hooks";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { formatFechaHoraModal } from "../../../helpers/fnHelper";

export const ReservasInformacionTable = ({ cargando }) => {
    const { reservas, fnAsignarReserva } = useReservaDepartamentoStore();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();

    const columns = useMemo(
        () => [
            {
                header: "Estado",
                accessorKey: "estado.nombre_estado",
                Cell: ({ cell }) => (
                    <Group>
                        <Badge
                            radius="sm"
                            color={cell.row.original.estado.color}
                            variant="transparent"
                        >
                            {cell.row.original.estado.nombre_estado}
                        </Badge>
                    </Group>
                ),
                size: 80,
                filterVariant: "autocomplete",
            },
            {
                header: "Codigo Reserva",
                accessorFn: (row) =>
                    row?.codigo_reserva || "NO CONTIENE INFORMACION",
                filterVariant: "autocomplete",
                Cell: ({ cell }) => (
                    <UnstyledButton
                        onDoubleClick={() =>
                            handleAgregarConsumos(cell.row.original)
                        }
                    >
                        {cell.row.original.codigo_reserva}
                    </UnstyledButton>
                ),
            },
            {
                header: "Departamento",
                accessorFn: (row) => row?.numero_departamento || "ESTADIA",
                size: 80,
            },
            {
                header: "Huesped Anfitrión",
                accessorFn: (row) => row?.huesped || "NO CONTIENE INFORMACION",
                filterVariant: "autocomplete",
            },
            {
                header: "Fecha Check-In",
                accessorFn: (row) =>
                    formatFechaHoraModal(row?.fecha_checkin) || "NO CONTIENE INFORMACION",
                enableColumnActions: true,
                size: 80,
            },
            {
                header: "Fecha Check-Out",
                accessorFn: (row) =>
                    formatFechaHoraModal(row?.fecha_checkout) || "NO CONTIENE INFORMACION",
                enableColumnActions: true,
                size: 80,
            },
            {
                header: "Total Noches",
                accessorFn: (row) => row?.total_noches,
                size: 80,
            },
        ],
        [reservas]
    );

    const handleAgregarConsumos = useCallback(
        (selected) => {
            //console.log(selected);
            fnAsignarReserva(selected);
            fnAbrirDrawerConsumosDepartamento(true);
        },
        [reservas]
    );

    const table = useMantineReactTable({
        columns,
        data: reservas,
        state: { showProgressBars: cargando },
        localization: MRT_Localization_ES,
        enableFacetedValues: false,
        enableColumnDragging: false,
        enableDensityToggle: false,
        enableSorting: false,
        enableColumnActions: false,
        enableRowActions: false,
        renderDetailPanel: ({ row }) => (
            <Group>
                <Table withTableBorder withColumnBorders mb={10}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Total Adultos</Table.Th>
                            <Table.Th>Total Niños</Table.Th>
                            <Table.Th>Total Mascotas</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>
                                {row.original.total_adultos || 0}
                            </Table.Td>
                            <Table.Td>{row.original.total_ninos || 0}</Table.Td>
                            <Table.Td>
                                {row.original.total_mascotas || 0}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
                <Table withTableBorder withColumnBorders mb={10}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Usuario Creador</Table.Th>
                            <Table.Th>Fecha Creacion</Table.Th>
                            <Table.Th>Motivo Cancelacion</Table.Th>
                            <Table.Th>Observacion Cancelacion</Table.Th>
                            <Table.Th>Fecha Cancelacion</Table.Th>
                            <Table.Th>Usuario Cancelador</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>
                                {row.original.usuario_creador ||
                                    "SIN INFORMACION"}
                            </Table.Td>
                            <Table.Td>
                                { formatFechaHoraModal(row.original.fecha_creacion) ||
                                    "SIN INFORMACION"}
                            </Table.Td>
                            <Table.Td>
                                {row.original.motivo_cancelacion ||
                                    "SIN INFORMACION"}
                            </Table.Td>
                            <Table.Td>
                                {row.original.observacion_cancelacion ||
                                    "SIN INFORMACION"}
                            </Table.Td>
                            <Table.Td>
                                {formatFechaHoraModal(row.original.fecha_cancelacion) ||
                                    "SIN INFORMACION"}
                            </Table.Td>
                            <Table.Td>
                                {row.original.usuario_cancelador ||
                                    "SIN INFORMACION"}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Group>
        ),
        mantineTableProps: {
            withColumnBorders: true,
            withTableBorder: true,
            sx: {
                "thead > tr": {
                    backgroundColor: "inherit",
                },
                "thead > tr > th": {
                    backgroundColor: "inherit",
                },
                "tbody > tr > td": {
                    backgroundColor: "inherit",
                },
            },
        },
    });

    return <ContenidoTable table={table} />;
};
