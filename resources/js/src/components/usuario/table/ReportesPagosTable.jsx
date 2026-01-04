import { useMemo } from "react";
import { MantineReactTable } from "mantine-react-table";
import { useStorageField, useUsuarioStore } from "../../../hooks";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconPackageExport } from "@tabler/icons-react";

export const ReportesPagosTable = ({ reportes }) => {
    const { cargandoReportes, fnExportarPDFReportesPorGerente } =
        useUsuarioStore();
    const { storageFields } = useStorageField();

    // Normalizamos la data para que siempre sea un array
    const data = useMemo(() => {
        if (!reportes) return [];
        return Array.isArray(reportes) ? reportes : [reportes];
    }, [reportes]);

    // Columnas de la tabla principal (usuarios gerentes)
    const columns = useMemo(
        () => [
            { accessorKey: "nombres", header: "Usuario" },
            { accessorKey: "dni", size: 80, header: "DNI" },
            {
                accessorKey: "activo",
                header: "Activo",
                size: 80,
                Cell: ({ cell }) => (cell.getValue() ? "Sí" : "No"),
            },
            { accessorKey: "total_registros", size: 80, header: "Total Pagos" },
            {
                accessorKey: "total_monto",
                size: 80,
                header: "Total Monto",
                Cell: ({ cell }) => `$${Number(cell.getValue()).toFixed(2)}`,
            },
        ],
        []
    );

    // DetailPanel para mostrar los pagos de cada gerente
    const renderDetailPanel = ({ row }) => {
        const pagos = row.original.pagos || [];
        if (!pagos.length) return <div>No hay pagos registrados</div>;

        const pagoColumns = [
            { accessorKey: "reserva.codigo_reserva", header: "Reserva" },
            { accessorKey: "codigo_voucher", header: "Voucher" },
            {
                accessorKey: "concepto_pago_id.nombre_concepto",
                header: "Concepto",
            },
            {
                accessorKey: "monto",
                header: "Monto",
                Cell: ({ cell }) => `$${Number(cell.getValue()).toFixed(2)}`,
            },
            { accessorKey: "metodo_pago", header: "Método" },
            { accessorKey: "fecha_pago", header: "Fecha" },
            { accessorKey: "observaciones", header: "Observaciones" },
        ];

        return (
            <MantineReactTable
                columns={pagoColumns}
                data={pagos}
                enableColumnActions={false}
                enablePagination={false}
                enableSorting={false}
                enableTopToolbar={false}
                enableBottomToolbar={false}
                mantineTableContainerProps={{ style: { maxHeight: 300 } }}
                mantineTableProps={{
                    withTableBorder: true,
                    withColumnBorders: true,
                }}
                localization={MRT_Localization_ES}
            />
        );
    };

    const renderTopToolbar = () => (
        <Group gap={20} mr={8}>
            <Tooltip label="Exportar Reporte">
                <ActionIcon
                    variant="default"
                    size="lg"
                    radius="xs"
                    onClick={() => {
                        fnExportarPDFReportesPorGerente(storageFields);
                    }}
                >
                    <IconPackageExport
                        style={{ width: "80%", height: "80%" }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Tooltip>
        </Group>
    );

    return (
        <MantineReactTable
            columns={columns}
            data={data}
            //enableExpandAll={false}
            renderDetailPanel={renderDetailPanel}
            state={{ expanded: true, showProgressBars: cargandoReportes }}
            enableSorting
            enableColumnActions
            enablePagination
            mantineTableProps={{
                withTableBorder: true,
                withColumnBorders: true,
            }}
            localization={MRT_Localization_ES}
            renderTopToolbarCustomActions={renderTopToolbar}
        />
    );
};
